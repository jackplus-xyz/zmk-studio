import type { PhysicalLayout } from "@zmkfirmware/zmk-studio-ts-client/keymap";
import type { LayoutScreenshotOptions } from "./layout-screenshot";
import { Keymap } from "./Keymap";
import { getCompactSplitLayout } from "./compact-split-layout";

function screenshotBounds(layout: PhysicalLayout, hideCenterKeys: boolean) {
  const compact = hideCenterKeys ? getCompactSplitLayout(layout) : undefined;
  const xs = [0];
  const ys = [0];
  (compact?.keys || layout.keys).forEach((key, index) => {
    if (compact?.hiddenPositions.has(index)) return;
    const angle = (((key.r || 0) / 100) * Math.PI) / 180;
    // Match Keymap's rendering coordinates and rotation origins.
    const rx = key.rx || 0;
    const ry = key.ry || 0;
    for (const [x, y] of [
      [key.x, key.y],
      [key.x + key.width, key.y],
      [key.x, key.y + key.height],
      [key.x + key.width, key.y + key.height],
    ]) {
      xs.push(
        (rx + (x - rx) * Math.cos(angle) - (y - ry) * Math.sin(angle)) * 0.48,
      );
      ys.push(
        (ry + (x - rx) * Math.sin(angle) + (y - ry) * Math.cos(angle)) * 0.48,
      );
    }
  });
  return {
    left: Math.min(...xs),
    top: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

export function LayoutScreenshot({
  keymap,
  layout,
  behaviors,
  hideCenterKeys,
  keyboardName,
}: LayoutScreenshotOptions) {
  const bounds = screenshotBounds(layout, hideCenterKeys);
  return (
    <div
      style={{
        width: Math.max(600, Math.ceil(bounds.width) + 80),
        padding: 32,
        background: "#fff",
        color: "#1f2937",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
        {keyboardName}
      </h1>
      <p style={{ fontSize: 12, marginBottom: 32 }}>{layout.name}</p>
      {keymap.layers.map((layer, index) => (
        <section
          key={layer.id}
          style={{ marginBottom: index === keymap.layers.length - 1 ? 0 : 32 }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            {index} {layer.name || "Layer"}
          </h2>
          <div
            style={{
              position: "relative",
              height: Math.ceil(bounds.height) + 32,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -bounds.left + 8,
                top: -bounds.top + 8,
              }}
            >
              <Keymap
                layout={layout}
                keymap={keymap}
                behaviors={behaviors}
                hideCenterKeys={hideCenterKeys}
                scale={1}
                selectedLayerIndex={index}
                selectedKeyPosition={undefined}
                onKeyPositionClicked={() => {}}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
