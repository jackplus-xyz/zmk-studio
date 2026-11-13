import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { hid_usage_from_page_and_id } from "../hid-usages";
import { HidUsageLabel } from "./HidUsageLabel";

const meta = {
  title: "Keyboard/HidUsageLabel",
  component: HidUsageLabel,
  args: { hid_usage: hid_usage_from_page_and_id(7, 30) },
} satisfies Meta<typeof HidUsageLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShiftedNumbers: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {[0, 0x02, 0x20, 0x22, 0x23, 0x0a].map((mods) => (
        <div key={mods} data-testid={`mods-${mods}`} className="flex gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <HidUsageLabel
              key={i}
              hid_usage={hid_usage_from_page_and_id(7, 30 + i) | (mods << 24)}
            />
          ))}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const mods of [0, 0x02, 0x20, 0x22, 0x23, 0x0a]) {
      const row = within(canvas.getByTestId(`mods-${mods}`));
      for (const label of [0x02, 0x20, 0x22].includes(mods)
        ? "!@#$%^&*()"
        : "1234567890") {
        await expect(row.getByLabelText(label)).toBeInTheDocument();
      }
    }
  },
};
