import {
  Power,
  PowerOff,
  Sun,
  SunDim,
  Palette,
  Droplets,
  Gauge,
  Sparkles,
  RotateCw,
  type LucideIcon,
} from "lucide-react";

interface LightingAction {
  icon: LucideIcon;
  label: string;
}

// Command IDs match ZMK's dt-bindings/zmk/rgb.h and backlight.h.
const rgbActions: Record<number, LightingAction> = {
  0: { icon: Power, label: "Toggle" },
  1: { icon: Power, label: "On" },
  2: { icon: PowerOff, label: "Off" },
  3: { icon: Palette, label: "Hue +" },
  4: { icon: Palette, label: "Hue −" },
  5: { icon: Droplets, label: "Sat +" },
  6: { icon: Droplets, label: "Sat −" },
  7: { icon: Sun, label: "Bright +" },
  8: { icon: SunDim, label: "Bright −" },
  9: { icon: Gauge, label: "Speed +" },
  10: { icon: Gauge, label: "Speed −" },
  11: { icon: Sparkles, label: "Effect +" },
  12: { icon: Sparkles, label: "Effect −" },
  13: { icon: Sparkles, label: "Effect" },
  14: { icon: Palette, label: "Color" },
};

const backlightActions: Record<number, LightingAction> = {
  0: { icon: Power, label: "On" },
  1: { icon: PowerOff, label: "Off" },
  2: { icon: Power, label: "Toggle" },
  3: { icon: Sun, label: "Bright +" },
  4: { icon: SunDim, label: "Bright −" },
  5: { icon: RotateCw, label: "Cycle" },
  6: { icon: Sun, label: "Set" },
};

export const LightingBindingLabel = ({
  kind,
  command,
  value,
}: {
  kind: "rgb" | "backlight";
  command: number;
  value: number;
}) => {
  const action = (kind === "rgb" ? rgbActions : backlightActions)[command];
  const Icon = action?.icon || Sun;
  const label =
    kind === "backlight" && command === 6
      ? `Set ${value}`
      : kind === "rgb" && command === 13
        ? `Effect ${value}`
        : action?.label || `Cmd ${command}`;
  const title = `${kind === "rgb" ? "RGB" : "Backlight"}: ${label}`;
  return (
    <span
      className="flex flex-col items-center leading-tight max-w-full"
      title={title}
    >
      <Icon size={kind === "rgb" ? 14 : 18} aria-hidden="true" />
      <span className="text-[8px] leading-[10px] max-w-full truncate">
        {label}
      </span>
    </span>
  );
};
