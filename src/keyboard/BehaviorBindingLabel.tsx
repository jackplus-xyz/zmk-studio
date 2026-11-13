import type { GetBehaviorDetailsResponse } from "@zmkfirmware/zmk-studio-ts-client/behaviors";
import type { BehaviorBinding } from "@zmkfirmware/zmk-studio-ts-client/keymap";
import { Bluetooth } from "lucide-react";
import { HidUsageLabel } from "./HidUsageLabel";
import { getLightingKind } from "../behaviors/lighting";
import { LightingBindingLabel } from "./LightingBindingLabel";

interface BehaviorBindingLabelProps {
  binding: BehaviorBinding;
  behavior?: GetBehaviorDetailsResponse;
  layers: { id: number; name: string }[];
  active?: boolean;
}

// Commands and zero-based profile numbers match dt-bindings/zmk/bt.h.
// https://zmk.dev/docs/keymaps/behaviors/bluetooth
const bluetoothActions: Record<number, string> = {
  0: "Clear selected profile",
  1: "Next profile",
  2: "Previous profile",
  4: "Clear all profiles",
};

export const BehaviorBindingLabel = ({
  binding,
  behavior,
  layers,
  active = false,
}: BehaviorBindingLabelProps) => {
  if (behavior?.displayName === "Output Selection") {
    const outputs: Record<number, string> = {
      0: "Toggle",
      1: "USB",
      2: "BLE",
      3: "None",
    };
    return (
      <span
        className="text-[10px]"
        title={`Output: ${outputs[binding.param1] || `Command ${binding.param1}`}`}
      >
        {outputs[binding.param1] || `Cmd ${binding.param1}`}
      </span>
    );
  }

  const lightingKind = getLightingKind(behavior?.displayName || "");
  if (lightingKind) {
    return (
      <LightingBindingLabel
        kind={lightingKind}
        command={binding.param1}
        value={binding.param2}
      />
    );
  }

  if (behavior?.displayName === "Mod-Tap") {
    return (
      <span className="flex flex-col items-center leading-tight max-w-full px-1">
        <span title="Tap">
          <HidUsageLabel hid_usage={binding.param2} withModifiers />
        </span>
        <span className="text-xs" title="Hold">
          <HidUsageLabel hid_usage={binding.param1} withModifiers />
        </span>
      </span>
    );
  }

  if (behavior?.displayName === "Bluetooth") {
    const action =
      binding.param1 === 3
        ? `Select profile ${binding.param2}`
        : binding.param1 === 5
          ? `Disconnect profile ${binding.param2}`
          : bluetoothActions[binding.param1] || `Command ${binding.param1}`;

    return (
      <span
        className="flex flex-col items-center max-w-full"
        title={`Bluetooth: ${action}`}
      >
        <Bluetooth size={11} aria-hidden="true" className="shrink-0" />
        <span
          className="leading-[9px] text-center max-w-full"
          style={{
            fontSize: Math.min(
              8,
              40 /
                (Math.max(...action.split(" ").map((word) => word.length)) *
                  0.62),
            ),
          }}
        >
          {action}
        </span>
      </span>
    );
  }

  const layerName =
    layers.find((l) => l.id === binding.param1)?.name ||
    `Layer ${binding.param1}`;
  if (behavior?.displayName === "Layer-Tap") {
    if (active) {
      return (
        <span className="flex flex-col items-center max-w-full">
          <span className="text-[10px] max-w-full truncate">{layerName}</span>
          <span className="text-xs">Held</span>
        </span>
      );
    }
    return (
      <span className="flex flex-col items-center leading-tight max-w-full px-1">
        <HidUsageLabel hid_usage={binding.param2} />
        <span className="text-xs max-w-full truncate" title={layerName}>
          {layerName}
        </span>
      </span>
    );
  }

  if (behavior?.displayName === "Momentary Layer") {
    return (
      <span className="text-[10px] max-w-full truncate px-1" title={layerName}>
        {layerName}
      </span>
    );
  }

  return <HidUsageLabel hid_usage={binding.param1} />;
};
