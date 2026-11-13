import {
  PhysicalLayout,
  Keymap as KeymapMsg,
} from "@zmkfirmware/zmk-studio-ts-client/keymap";
import type { GetBehaviorDetailsResponse } from "@zmkfirmware/zmk-studio-ts-client/behaviors";

import {
  LayoutZoom,
  PhysicalLayout as PhysicalLayoutComp,
} from "./PhysicalLayout";
import { BehaviorBindingLabel } from "./BehaviorBindingLabel";
import { getLightingKind } from "../behaviors/lighting";
import { getCompactSplitLayout } from "./compact-split-layout";

type BehaviorMap = Record<number, GetBehaviorDetailsResponse>;

export interface KeymapProps {
  layout: PhysicalLayout;
  keymap: KeymapMsg;
  behaviors: BehaviorMap;
  scale: LayoutZoom;
  selectedLayerIndex: number;
  hideCenterKeys?: boolean;
  selectedKeyPosition: number | undefined;
  onKeyPositionClicked: (keyPosition: number) => void;
}

export const Keymap = ({
  layout,
  keymap,
  behaviors,
  scale,
  selectedLayerIndex,
  hideCenterKeys = false,
  selectedKeyPosition,
  onKeyPositionClicked,
}: KeymapProps) => {
  if (!keymap.layers[selectedLayerIndex]) {
    return <></>;
  }

  const compactLayout = hideCenterKeys
    ? getCompactSplitLayout(layout)
    : undefined;
  const positions = (compactLayout?.keys || layout.keys).map((k, i) => {
    const hidden = compactLayout?.hiddenPositions.has(i) || false;
    if (i >= keymap.layers[selectedLayerIndex].bindings.length) {
      return {
        id: `${keymap.layers[selectedLayerIndex].id}-${i}`,
        header: "Unknown",
        hidden,
        x: k.x / 100.0,
        y: k.y / 100.0,
        width: k.width / 100,
        height: k.height / 100.0,
        children: <span></span>,
      };
    }

    let binding = keymap.layers[selectedLayerIndex].bindings[i];
    const layerActivator =
      selectedLayerIndex > 0
        ? keymap.layers
            .slice(0, selectedLayerIndex)
            .reverse()
            .map((layer) => layer.bindings[i])
            .find(
              (candidate) =>
                candidate &&
                behaviors[candidate.behaviorId]?.displayName !== "Transparent",
            )
        : undefined;
    const active =
      !!layerActivator &&
      layerActivator.param1 === keymap.layers[selectedLayerIndex].id &&
      [
        "Layer-Tap",
        "Momentary Layer",
        "Sticky Layer",
        "Toggle Layer",
        "To Layer",
      ].includes(behaviors[layerActivator.behaviorId]?.displayName || "");
    const transparent =
      behaviors[binding.behaviorId]?.displayName === "Transparent";
    const muted = selectedLayerIndex > 0 && transparent;

    // Preview fall-through without changing the binding edited on this layer.
    if (muted) {
      for (
        let layerIndex = selectedLayerIndex - 1;
        layerIndex >= 0;
        layerIndex--
      ) {
        const inheritedBinding = keymap.layers[layerIndex].bindings[i];
        if (!inheritedBinding) continue;
        binding = inheritedBinding;
        if (behaviors[binding.behaviorId]?.displayName !== "Transparent") break;
      }
    }
    // Show the activation action in the preview while edits still target this layer.
    if (active && layerActivator) binding = layerActivator;

    const behavior = behaviors[binding.behaviorId];
    const lightingKind = getLightingKind(behavior?.displayName || "");
    const hasCombinedLabel =
      ["Layer-Tap", "Mod-Tap", "Bluetooth"].includes(
        behavior?.displayName || "",
      ) || lightingKind === "backlight";

    return {
      id: `${keymap.layers[selectedLayerIndex].id}-${i}`,
      header:
        lightingKind === "rgb"
          ? "Underglow"
          : hasCombinedLabel
            ? ""
            : behavior?.displayName || "Unknown",
      muted: muted && !active,
      active,
      hidden,
      x: k.x / 100.0,
      y: k.y / 100.0,
      width: k.width / 100,
      height: k.height / 100.0,
      r: (k.r || 0) / 100.0,
      rx: (k.rx || 0) / 100.0,
      ry: (k.ry || 0) / 100.0,
      children: (
        <BehaviorBindingLabel
          binding={binding}
          behavior={behavior}
          layers={keymap.layers}
          active={active}
        />
      ),
    };
  });

  return (
    <PhysicalLayoutComp
      positions={positions}
      oneU={48}
      hoverZoom={true}
      zoom={scale}
      selectedPosition={selectedKeyPosition}
      onPositionClicked={onKeyPositionClicked}
    />
  );
};
