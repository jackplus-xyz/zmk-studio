import type { PhysicalLayout } from "@zmkfirmware/zmk-studio-ts-client/keymap";

type PhysicalKey = PhysicalLayout["keys"][number];

function horizontalBounds(key: PhysicalKey): [number, number] {
  const angle = (((key.r || 0) / 100) * Math.PI) / 180;
  const pivotX = key.rx ?? key.x;
  const pivotY = key.ry ?? key.y;
  const corners = [
    [key.x, key.y],
    [key.x + key.width, key.y],
    [key.x, key.y + key.height],
    [key.x + key.width, key.y + key.height],
  ];
  const xs = corners.map(
    ([x, y]) =>
      pivotX + (x - pivotX) * Math.cos(angle) - (y - pivotY) * Math.sin(angle),
  );
  return [Math.min(...xs), Math.max(...xs)];
}

/** Recognize the pictured center cross and its separate lower-left key by geometry. */
export function getCompactSplitLayout(layout?: PhysicalLayout) {
  if (!layout) return undefined;
  const keys = layout.keys;
  // Offsets from the top of the five-key cross, measured in key widths/heights.
  const offsets = [
    [0, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [0, 2],
    [-3, 2],
  ];
  for (const anchor of keys) {
    if (anchor.r || anchor.width <= 0 || anchor.height <= 0) continue;
    const indexes = offsets.map(([dx, dy]) =>
      keys.findIndex(
        (key) =>
          !key.r &&
          key.width === anchor.width &&
          key.height === anchor.height &&
          Math.abs(key.x - anchor.x - dx * anchor.width) <= 1 &&
          Math.abs(key.y - anchor.y - dy * anchor.height) <= 1,
      ),
    );
    if (indexes.some((index) => index < 0)) continue;
    const hiddenPositions = new Set(indexes);
    const remaining = keys.filter((_, index) => !hiddenPositions.has(index));
    const bandLeft = anchor.x - 3 * anchor.width;
    const bandRight = anchor.x + 2 * anchor.width;
    // This is a separate center cluster, not six keys inside a regular grid.
    if (
      remaining.some(
        (key) => !key.r && key.x < bandRight && key.x + key.width > bandLeft,
      )
    )
      continue;
    const splitX = anchor.x + anchor.width / 2;
    const left = remaining.filter((key) => key.x + key.width / 2 < splitX);
    const right = remaining.filter((key) => key.x + key.width / 2 >= splitX);
    if (left.length < 12 || right.length < 12) continue;

    // Leave three quarters of a key between the halves, including rotated thumbs.
    const leftEdge = Math.max(...left.map((key) => horizontalBounds(key)[1]));
    const rightEdge = Math.min(...right.map((key) => horizontalBounds(key)[0]));
    const shift = Math.max(0, rightEdge - leftEdge - anchor.width * 0.75);
    return {
      hiddenPositions,
      keys: keys.map((key, index) => {
        if (hiddenPositions.has(index) || key.x + key.width / 2 < splitX)
          return key;
        return {
          ...key,
          x: key.x - shift,
          rx: key.rx === undefined ? undefined : key.rx - shift,
        };
      }),
    };
  }
  return undefined;
}
