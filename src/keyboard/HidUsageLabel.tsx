import { hid_usage_page_and_id_from_usage } from "../hid-usages";
import { getHidUsageLabels } from "./hid-usage-labels";
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
  withModifiers?: boolean;
}

export const HidUsageLabel = ({
  hid_usage,
  withModifiers = false,
}: HidUsageLabelProps) => {
  const [usagePage, id] = hid_usage_page_and_id_from_usage(hid_usage);

  const page = usagePage & 0xff;
  const labels = getHidUsageLabels(hid_usage, withModifiers);

  const media = page === 12 ? mediaIcons[id] : undefined;
  if (media) {
    const Icon = media.icon;
    return (
      <span
        role="img"
        aria-label={labels.prefix + media.label}
        title={labels.prefix + media.label}
        className="inline-flex"
      >
        {labels.prefix}
        <Icon size={20} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span
      className="@[10em]:before:content-[attr(data-long-content)] @[6em]:before:content-[attr(data-med-content)] before:content-[attr(aria-label)]"
      aria-label={labels.short}
      data-med-content={labels.med}
      data-long-content={labels.long}
      title={withModifiers ? labels.long : undefined}
      style={
        withModifiers
          ? {
              fontSize: `min(1em, ${40 / (Math.max(1, labels.short?.length || 0) * 0.62)}px)`,
            }
          : undefined
      }
    />
  );
};
