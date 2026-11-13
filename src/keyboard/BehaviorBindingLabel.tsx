import type { GetBehaviorDetailsResponse } from "@zmkfirmware/zmk-studio-ts-client/behaviors";
import type { BehaviorBinding } from "@zmkfirmware/zmk-studio-ts-client/keymap";
import { Bluetooth } from "lucide-react";
import { HidUsageLabel } from "./HidUsageLabel";

interface BehaviorBindingLabelProps {
  binding: BehaviorBinding;
  behavior?: GetBehaviorDetailsResponse;
  layers: { id: number; name: string }[];
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
}: BehaviorBindingLabelProps) => {
  if (behavior?.displayName === "Bluetooth") {
    const action =
      binding.param1 === 3
        ? `Select profile ${binding.param2}`
        : binding.param1 === 5
          ? `Disconnect profile ${binding.param2}`
          : bluetoothActions[binding.param1] || `Command ${binding.param1}`;

    return (
      <span
        className="flex flex-col items-center max-w-full px-0.5"
        title={`Bluetooth: ${action}`}
      >
        <Bluetooth size={12} aria-hidden="true" className="shrink-0" />
        <span className="text-[10px] leading-[10px] text-center max-w-full break-words">
          {action}
        </span>
      </span>
    );
  }

  const layerName =
    layers.find((l) => l.id === binding.param1)?.name ||
    `Layer ${binding.param1}`;
  if (behavior?.displayName === "Layer-Tap") {
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
      <span className="text-sm max-w-full truncate px-1" title={layerName}>
        {layerName}
      </span>
    );
  }

  return <HidUsageLabel hid_usage={binding.param1} />;
};
