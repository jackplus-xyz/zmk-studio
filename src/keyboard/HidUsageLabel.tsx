import {
  hid_usage_get_labels,
  hid_usage_page_and_id_from_usage,
} from "../hid-usages";
import {
  Sun,
  SunDim,
  Volume2,
  Volume1,
  VolumeX,
  SkipForward,
  SkipBack,
  Play,
  Pause,
  CirclePlay,
  Square,
  FastForward,
  Rewind,
  type LucideIcon,
} from "lucide-react";

const mediaIcons: Record<number, { icon: LucideIcon; label: string }> = {
  0x6f: { icon: Sun, label: "Brightness up" },
  0x70: { icon: SunDim, label: "Brightness down" },
  0xb0: { icon: Play, label: "Play" },
  0xb1: { icon: Pause, label: "Pause" },
  0xb3: { icon: FastForward, label: "Fast forward" },
  0xb4: { icon: Rewind, label: "Rewind" },
  0xb5: { icon: SkipForward, label: "Next track" },
  0xb6: { icon: SkipBack, label: "Previous track" },
  0xb7: { icon: Square, label: "Stop" },
  0xcd: { icon: CirclePlay, label: "Play/pause" },
  0xe2: { icon: VolumeX, label: "Mute" },
  0xe9: { icon: Volume2, label: "Volume up" },
  0xea: { icon: Volume1, label: "Volume down" },
};

export interface HidUsageLabelProps {
  hid_usage: number;
}

function remove_prefix(s?: string) {
  return s?.replace(/^Keyboard /, "");
}

export const HidUsageLabel = ({ hid_usage }: HidUsageLabelProps) => {
  const [usagePage, id] = hid_usage_page_and_id_from_usage(hid_usage);

  const modifiers = hid_usage >>> 24;
  const page = usagePage & 0xff;

  // Number-row symbols follow the same US layout as the HID label table.
  const shiftedNumber =
    page === 7 &&
    (modifiers & 0x22) !== 0 &&
    (modifiers & ~0x22) === 0 &&
    id >= 0x1e &&
    id <= 0x27
      ? "!@#$%^&*()"[id - 0x1e]
      : undefined;
  const labels = shiftedNumber
    ? { short: shiftedNumber }
    : hid_usage_get_labels(page, id);

  const media = page === 12 ? mediaIcons[id] : undefined;
  if (media) {
    const Icon = media.icon;
    return (
      <span
        role="img"
        aria-label={media.label}
        title={media.label}
        className="inline-flex"
      >
        <Icon size={20} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span
      className="@[10em]:before:content-[attr(data-long-content)] @[6em]:before:content-[attr(data-med-content)] before:content-[attr(aria-label)]"
      aria-label={remove_prefix(labels.short)}
      data-med-content={remove_prefix(labels.med || labels.short)}
      data-long-content={remove_prefix(
        labels.long || labels.med || labels.short,
      )}
    />
  );
};
