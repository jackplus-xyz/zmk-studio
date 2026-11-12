import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Keymap } from "./Keymap";
import { hid_usage_from_page_and_id } from "../hid-usages";

const binding = (behaviorId: number, key = 0) => ({
  behaviorId,
  param1: key ? hid_usage_from_page_and_id(7, key) : 0,
  param2: 0,
});

const meta = {
  title: "Keyboard/Keymap",
  component: Keymap,
  args: {
    layout: {
      name: "Transparent preview",
      keys: Array.from({ length: 4 }, (_, i) => ({
        x: i * 100,
        y: 0,
        width: 100,
        height: 100,
        r: 0,
        rx: 0,
        ry: 0,
      })),
    },
    keymap: {
      availableLayers: 3,
      maxLayerNameLength: 16,
      layers: [
        {
          id: 0,
          name: "Base",
          bindings: [binding(1, 4), binding(1, 5), binding(1, 6), binding(2)],
        },
        {
          id: 1,
          name: "Lower",
          bindings: [binding(2), binding(1, 7), binding(3), binding(2)],
        },
        {
          id: 2,
          name: "Upper",
          bindings: [binding(2), binding(2), binding(2), binding(2)],
        },
      ],
    },
    behaviors: {
      1: { id: 1, displayName: "Key Press", metadata: [] },
      2: { id: 2, displayName: "Transparent", metadata: [] },
      3: { id: 3, displayName: "None", metadata: [] },
    },
    scale: 1,
    selectedLayerIndex: 1,
    selectedKeyPosition: undefined,
    onKeyPositionClicked: fn(),
  },
} satisfies Meta<typeof Keymap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inherited: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const keys = canvas.getAllByRole("button");
    await expect(canvas.getByLabelText("A").parentElement).toHaveClass(
      "opacity-50",
    );
    await expect(canvas.getByLabelText("D").parentElement).not.toHaveClass(
      "opacity-50",
    );
    await expect(within(keys[2]).getByText("None")).not.toHaveClass(
      "opacity-50",
    );
    await userEvent.click(keys[0]);
    await expect(args.onKeyPositionClicked).toHaveBeenCalledWith(0);
    await expect(args.keymap.layers[1].bindings[0].behaviorId).toBe(2);
  },
};

export const MultipleTransparentLayers: Story = {
  args: { selectedLayerIndex: 2, selectedKeyPosition: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("A").parentElement).toHaveClass(
      "opacity-50",
    );
    await expect(canvas.getByLabelText("D").parentElement).toHaveClass(
      "opacity-50",
    );
    // A non-transparent "None" binding stops fall-through.
    await expect(canvas.getByText("None")).toHaveClass("opacity-50");
    await expect(canvas.queryByLabelText("C")).not.toBeInTheDocument();
    await expect(canvas.getByText("Transprnt")).toBeInTheDocument();
  },
};

export const BaseLayer: Story = {
  args: { selectedLayerIndex: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("A").parentElement).not.toHaveClass(
      "opacity-50",
    );
    await expect(canvas.getByText("Transprnt")).not.toHaveClass("opacity-50");
  },
};
