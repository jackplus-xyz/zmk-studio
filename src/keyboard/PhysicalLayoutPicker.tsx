import {
  Button,
  Key,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Text,
} from "react-aria-components";
import { PhysicalLayout, type KeyPosition } from "./PhysicalLayout";
import { useCallback } from "react";
import { ChevronDown } from "lucide-react";

export interface PhysicalLayoutItem {
  name: string;
  keys: Array<Omit<KeyPosition, "id">>;
}

export type PhysicalLayoutClickCallback = (index: number) => void;

export interface PhysicalLayoutPickerProps {
  layouts: Array<PhysicalLayoutItem>;

  selectedPhysicalLayoutIndex: number;

  onPhysicalLayoutClicked?: PhysicalLayoutClickCallback;
}

export const PhysicalLayoutPicker = ({
  layouts,
  selectedPhysicalLayoutIndex,
  onPhysicalLayoutClicked,
}: PhysicalLayoutPickerProps) => {
  const selectionChanged = useCallback(
    (e: Key) => {
      onPhysicalLayoutClicked?.(layouts.findIndex((l) => l.name === e));
    },
    [layouts, onPhysicalLayoutClicked],
  );

  return (
    <Select
      onSelectionChange={selectionChanged}
      className="flex items-center"
      selectedKey={layouts[selectedPhysicalLayoutIndex].name}
    >
      <Label className="sr-only">Keyboard layout</Label>
      <Button className="p-1 rounded flex items-center gap-1 text-[12px] text-left hover:bg-base-300">
        <span>Layout:</span>
        <SelectValue<PhysicalLayoutItem>>
          {(v) => {
            return <span>{v.selectedItem?.name}</span>;
          }}
        </SelectValue>
        <ChevronDown size={14} aria-hidden="true" />
      </Button>
      <Popover className="min-w-[var(--trigger-width)] max-h-4 shadow-md text-base-content rounded border-base-content bg-base-100">
        <ListBox items={layouts}>
          {(l) => (
            <ListBoxItem
              id={l.name}
              textValue={l.name}
              className="p-1 aria-selected:bg-primary aria-selected:text-primary-content cursor-pointer first:rounded-t last:rounded-b"
            >
              <Text slot="label">{l.name}</Text>
              <div className="p-1 flex justify-center">
                <PhysicalLayout
                  oneU={15}
                  hoverZoom={false}
                  positions={l.keys.map(
                    ({ x, y, width, height, r, rx, ry }, i) => ({
                      id: `${layouts[selectedPhysicalLayoutIndex].name}-${i}`,
                      x: x / 100.0,
                      y: y / 100.0,
                      width: width / 100.0,
                      height: height / 100.0,
                      r: (r || 0) / 100.0,
                      rx: (rx || 0) / 100.0,
                      ry: (ry || 0) / 100.0,
                    }),
                  )}
                />
              </div>
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  );
};
