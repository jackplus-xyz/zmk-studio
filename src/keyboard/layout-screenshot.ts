import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { toBlob } from "html-to-image";
import type {
  Keymap as KeymapMessage,
  PhysicalLayout,
} from "@zmkfirmware/zmk-studio-ts-client/keymap";
import type { GetBehaviorDetailsResponse } from "@zmkfirmware/zmk-studio-ts-client/behaviors";
import { createElement } from "react";
import { LayoutScreenshot } from "./LayoutScreenshot";

export interface LayoutScreenshotOptions {
  keymap: KeymapMessage;
  layout: PhysicalLayout;
  behaviors: Record<number, GetBehaviorDetailsResponse>;
  hideCenterKeys: boolean;
  keyboardName: string;
}

/** Render a separate, unselected view so exporting never changes the live editor. */
export async function downloadLayoutScreenshot(
  options: LayoutScreenshotOptions,
): Promise<void> {
  const mount = document.createElement("div");
  mount.style.cssText =
    "position:fixed;left:-100000px;top:0;pointer-events:none";
  mount.setAttribute("aria-hidden", "true");
  mount.inert = true;
  document.body.append(mount);
  const root = createRoot(mount);
  try {
    flushSync(() => root.render(createElement(LayoutScreenshot, options)));
    await document.fonts.ready;
    const content = mount.firstElementChild as HTMLElement;
    // Keep long, many-layer images within common browser canvas limits.
    const pixelRatio = Math.min(
      2,
      16000 / Math.max(content.scrollWidth, content.scrollHeight),
    );
    const blob = await toBlob(content, {
      backgroundColor: "#fff",
      pixelRatio,
      skipFonts: true,
    });
    if (!blob)
      throw new Error("The browser could not generate the layout image.");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const name =
      options.keyboardName
        .replace(/[^a-z0-9_-]+/gi, "-")
        .replace(/^-|-$/g, "") || "keyboard";
    link.download = `${name}-all-layers-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
    link.href = url;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } finally {
    root.unmount();
    mount.remove();
  }
}
