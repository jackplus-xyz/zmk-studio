import {
  hid_usage_get_labels,
  hid_usage_page_and_id_from_usage,
} from "../hid-usages";

const modifierNames = [
  "Ctrl",
  "Shift",
  "Alt",
  "GUI",
  "RCtrl",
  "RShift",
  "AltGr",
  "RGUI",
];

export function getHidUsageLabels(usage: number, withModifiers = false) {
  const [usagePage, id] = hid_usage_page_and_id_from_usage(usage);
  const modifiers = usage >>> 24;
  const page = usagePage & 0xff;
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
  const prefix =
    withModifiers && !shiftedNumber
      ? modifierNames
          .filter((_, index) => modifiers & (1 << index))
          .map((name) => `${name}+`)
          .join("")
      : "";
  const format = (label?: string) =>
    label ? prefix + label.replace(/^Keyboard /, "") : undefined;
  return {
    short: format(labels.short),
    med: format(labels.med || labels.short),
    long: format(labels.long || labels.med || labels.short),
    prefix,
  };
}
