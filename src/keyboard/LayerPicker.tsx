import { Pencil, Minus, Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  DropIndicator,
  ListBox,
  ListBoxItem,
  Selection,
  useDragAndDrop,
} from "react-aria-components";
import { useModalRef } from "../misc/useModalRef";
import { GenericModal } from "../GenericModal";

interface Layer {
  id: number;
  name?: string;
}

export type LayerClickCallback = (index: number) => void;
export type LayerMovedCallback = (index: number, destination: number) => void;

interface LayerPickerProps {
  layers: Array<Layer>;
  selectedLayerIndex: number;
  canAdd?: boolean;
  canRemove?: boolean;

  onLayerClicked?: LayerClickCallback;
  onLayerMoved?: LayerMovedCallback;
  onAddClicked?: () => void | Promise<void>;
  onRemoveClicked?: () => void | Promise<void>;
  onLayerNameChanged?: (
    id: number,
    oldName: string,
    newName: string,
  ) => void | Promise<void>;
}

interface EditLabelData {
  id: number;
  name: string;
}

const EditLabelModal = ({
  open,
  onClose,
  editLabelData,
  handleSaveNewLabel,
}: {
  open: boolean;
  onClose: () => void;
  editLabelData: EditLabelData;
  handleSaveNewLabel: (
    id: number,
    oldName: string,
    newName: string | null,
  ) => void;
}) => {
  const ref = useModalRef(open);
  const [newLabelName, setNewLabelName] = useState(editLabelData.name);

  const handleSave = () => {
    handleSaveNewLabel(editLabelData.id, editLabelData.name, newLabelName);
    onClose();
  };

  return (
    <GenericModal
      ref={ref}
      onClose={onClose}
      className="min-w-min w-[30vw] flex flex-col"
    >
      <span className="mb-3 text-lg">New Layer Name</span>
      <input
        className="p-1 border rounded border-base-content border-solid"
        type="text"
        defaultValue={editLabelData.name}
        autoFocus
        onChange={(e) => setNewLabelName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
          }
        }}
      />
      <div className="mt-4 flex justify-end">
        <button className="py-1.5 px-2" type="button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="py-1.5 px-2 ml-4 rounded-md bg-gray-100 text-black hover:bg-gray-300"
          type="button"
          onClick={() => {
            handleSave();
          }}
        >
          Save
        </button>
      </div>
    </GenericModal>
  );
};

export const LayerPicker = ({
  layers,
  selectedLayerIndex,
  canAdd,
  canRemove,
  onLayerClicked,
  onLayerMoved,
  onAddClicked,
  onRemoveClicked,
  onLayerNameChanged,
  ...props
}: LayerPickerProps) => {
  const [editLabelData, setEditLabelData] = useState<EditLabelData | null>(
    null,
  );

  const layer_items = useMemo(() => {
    return layers.map((l, i) => ({
      name: l.name || "Layer",
      id: l.id,
      index: i,
      selected: i === selectedLayerIndex,
    }));
  }, [layers, selectedLayerIndex]);

  const selectionChanged = useCallback(
    (s: Selection) => {
      if (s === "all") {
        return;
      }

      onLayerClicked?.(layer_items.findIndex((l) => s.has(l.id)));
    },
    [onLayerClicked, layer_items],
  );

  let { dragAndDropHooks } = useDragAndDrop({
    renderDropIndicator(target) {
      return (
        <DropIndicator
          target={target}
          className={"data-[drop-target]:outline outline-1 outline-accent"}
        />
      );
    },
    getItems: (keys) =>
      [...keys].map((key) => ({ "text/plain": key.toLocaleString() })),
    onReorder(e) {
      let startIndex = layer_items.findIndex((l) => e.keys.has(l.id));
      let endIndex = layer_items.findIndex((l) => l.id === e.target.key);
      onLayerMoved?.(startIndex, endIndex);
    },
  });

  const handleSaveNewLabel = useCallback(
    (id: number, oldName: string, newName: string | null) => {
      if (newName !== null) {
        onLayerNameChanged?.(id, oldName, newName);
      }
    },
    [onLayerNameChanged],
  );

  return (
    <div className="flex items-stretch gap-1 min-w-0">
      <div className="order-last flex items-center gap-1 shrink-0 px-1">
        {onRemoveClicked && (
          <button
            type="button"
            aria-label="Remove selected layer"
            className="text-gray-800 hover:bg-base-300 rounded-sm disabled:opacity-50"
            disabled={!canRemove}
            onClick={onRemoveClicked}
          >
            <Minus className="size-4" />
          </button>
        )}
        {onAddClicked && (
          <button
            type="button"
            aria-label="Add layer"
            disabled={!canAdd}
            className="text-gray-800 ml-1 hover:bg-base-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onAddClicked}
          >
            <Plus className="size-4" />
          </button>
        )}
      </div>
      {editLabelData !== null && (
        <EditLabelModal
          open={editLabelData !== null}
          onClose={() => setEditLabelData(null)}
          editLabelData={editLabelData}
          handleSaveNewLabel={handleSaveNewLabel}
        />
      )}
      <ListBox
        aria-label="Keymap Layer"
        orientation="horizontal"
        selectionMode="single"
        items={layer_items}
        disallowEmptySelection={true}
        selectedKeys={
          layer_items[selectedLayerIndex]
            ? [layer_items[selectedLayerIndex].id]
            : []
        }
        className="flex flex-1 min-w-0 items-stretch gap-1 overflow-x-auto cursor-pointer"
        onSelectionChange={selectionChanged}
        dragAndDropHooks={dragAndDropHooks}
        {...props}
      >
        {(layer_item) => (
          <ListBoxItem
            textValue={`${layer_item.index} ${layer_item.name}`}
            className="group font-mono flex shrink-0 min-w-[8rem] items-center justify-center gap-1 px-4 py-3 bg-[#f6f6f6] text-gray-800 aria-selected:bg-white aria-selected:font-semibold outline-offset-[-2px]"
          >
            <span className="whitespace-nowrap">
              <span className="font-semibold">{layer_item.index}</span>{" "}
              <span className="inline-block max-w-[14rem] truncate align-bottom">
                {layer_item.name}
              </span>
            </span>
            <Pencil
              className="h-4 w-4 mx-1 invisible group-hover:visible"
              onClick={() =>
                setEditLabelData({ id: layer_item.id, name: layer_item.name })
              }
            />
          </ListBoxItem>
        )}
      </ListBox>
    </div>
  );
};
