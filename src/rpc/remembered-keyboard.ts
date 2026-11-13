import type { RpcTransport } from "@zmkfirmware/zmk-studio-ts-client/transport/index";
import type { AvailableDevice } from "../tauri";
import * as nativeSerial from "../tauri/serial";
import * as nativeBle from "../tauri/ble";

type SavedKeyboard =
  | { kind: "serial"; info: SerialPortInfo }
  | { kind: "bluetooth"; id: string }
  | { kind: "native-usb" | "native-ble"; device: AvailableDevice };

const storageKey = "lastConnectedKeyboard";
const identities = new WeakMap<RpcTransport, SavedKeyboard>();
const serviceUuid = "00000000-0196-6107-c967-c5cfb1c2482a";
const characteristicUuid = "00000001-0196-6107-c967-c5cfb1c2482a";

function track(transport: RpcTransport, identity: SavedKeyboard): RpcTransport {
  identities.set(transport, identity);
  return transport;
}

// Remember only after the first successful ZMK RPC, not just opening a port.
export function rememberConnectedKeyboard(transport: RpcTransport) {
  const identity = identities.get(transport);
  if (!identity) return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(identity));
  } catch {
    // A storage restriction must not prevent connecting to a keyboard.
  }
}

async function openSerialPort(port: SerialPort): Promise<RpcTransport> {
  // Match the baud rate used by the installed ZMK client.
  await port.open({ baudRate: 12500 });
  if (!port.readable || !port.writable) {
    await port.close();
    throw new Error("The serial port has no readable or writable stream.");
  }
  const abortController = new AbortController();
  const incoming = new TransformStream<Uint8Array, Uint8Array>();
  const outgoing = new TransformStream<Uint8Array, Uint8Array>();
  const options = { signal: abortController.signal };
  const stop = (error: unknown) => {
    abortController.abort(error);
  };
  const reading = port.readable.pipeTo(incoming.writable, options).catch(stop);
  const writing = outgoing.readable.pipeTo(port.writable, options).catch(stop);
  // Both pipelines release their locks before the port is closed.
  void Promise.allSettled([reading, writing])
    .then(() => port.close())
    .catch((error) => console.debug("Serial port closed", error));
  const info = port.getInfo();
  return track(
    {
      label: `${info.usbVendorId ?? ""}:${info.usbProductId ?? ""}`,
      abortController,
      readable: incoming.readable,
      writable: outgoing.writable,
    },
    { kind: "serial", info },
  );
}

export async function connectSerial(): Promise<RpcTransport> {
  return openSerialPort(await navigator.serial.requestPort({}));
}

async function openBluetoothDevice(
  device: BluetoothDevice,
): Promise<RpcTransport> {
  if (!device.gatt) throw new Error("The Bluetooth device has no GATT server.");
  try {
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUuid);
    const characteristic = await service.getCharacteristic(characteristicUuid);
    await characteristic.stopNotifications();
    await characteristic.startNotifications();
    const abortController = new AbortController();
    let cleanup = () => {};
    const readable = new ReadableStream<Uint8Array>({
      start(controller) {
        const onValue = () => {
          const value = characteristic.value;
          if (value)
            controller.enqueue(
              new Uint8Array(
                value.buffer,
                value.byteOffset,
                value.byteLength,
              ).slice(),
            );
        };
        const onDisconnected = () => {
          cleanup();
          controller.close();
        };
        cleanup = () => {
          characteristic.removeEventListener(
            "characteristicvaluechanged",
            onValue,
          );
          device.removeEventListener("gattserverdisconnected", onDisconnected);
        };
        characteristic.addEventListener("characteristicvaluechanged", onValue);
        device.addEventListener("gattserverdisconnected", onDisconnected);
      },
      cancel() {
        cleanup();
        device.gatt?.disconnect();
      },
    });
    const writable = new WritableStream<Uint8Array>({
      write(chunk) {
        return characteristic.writeValueWithoutResponse(chunk);
      },
    });
    abortController.signal.addEventListener(
      "abort",
      () => device.gatt?.disconnect(),
      { once: true },
    );
    return track(
      { label: device.name || "Keyboard", abortController, readable, writable },
      { kind: "bluetooth", id: device.id },
    );
  } catch (error) {
    device.gatt.disconnect();
    throw error;
  }
}

export async function connectBluetooth(): Promise<RpcTransport> {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [serviceUuid] }],
    optionalServices: [serviceUuid],
  });
  return openBluetoothDevice(device);
}

export async function connectNativeSerial(device: AvailableDevice) {
  return track(await nativeSerial.connect(device), {
    kind: "native-usb",
    device,
  });
}

export async function connectNativeBluetooth(device: AvailableDevice) {
  return track(await nativeBle.connect(device), { kind: "native-ble", device });
}

/** Reuse existing permissions. Never opens a device chooser or guesses between ports. */
export async function reconnectLastKeyboard(): Promise<
  RpcTransport | undefined
> {
  let saved: SavedKeyboard;
  try {
    const value = localStorage.getItem(storageKey);
    if (!value) return undefined;
    saved = JSON.parse(value);
    if (!saved || typeof saved !== "object") return undefined;
  } catch {
    return undefined;
  }

  if (saved.kind === "serial" && saved.info && navigator.serial) {
    const info = saved.info;
    if (
      typeof info.usbVendorId !== "number" ||
      typeof info.usbProductId !== "number"
    )
      return undefined;
    // Web Serial exposes USB model IDs, not a stable per-unit serial number.
    // Requiring exactly one match avoids choosing between identical devices.
    const ports = (await navigator.serial.getPorts()).filter((port) => {
      const candidate = port.getInfo();
      return (
        candidate.usbVendorId === info.usbVendorId &&
        candidate.usbProductId === info.usbProductId
      );
    });
    return ports.length === 1 ? openSerialPort(ports[0]) : undefined;
  }
  if (
    saved.kind === "bluetooth" &&
    typeof saved.id === "string" &&
    navigator.bluetooth?.getDevices
  ) {
    const device = (await navigator.bluetooth.getDevices()).find(
      (device) => device.id === saved.id,
    );
    return device ? openBluetoothDevice(device) : undefined;
  }
  if (
    (saved.kind === "native-usb" || saved.kind === "native-ble") &&
    saved.device &&
    window.__TAURI_INTERNALS__
  ) {
    const native = saved.kind === "native-usb" ? nativeSerial : nativeBle;
    const device = (await native.list_devices()).find(
      (device) => device.id === saved.device.id,
    );
    return device ? track(await native.connect(device), saved) : undefined;
  }
  return undefined;
}
