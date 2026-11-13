export function getLightingKind(name: string): "rgb" | "backlight" | undefined {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (["rgb", "rgbug", "rgbunderglow", "underglow"].includes(normalized))
    return "rgb";
  if (normalized === "backlight") return "backlight";
  return undefined;
}
