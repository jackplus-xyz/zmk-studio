import { getLightingKind } from "./lighting";

interface BehaviorDescription {
  text: string;
  url?: string;
}

// Short paraphrases of the linked official ZMK documentation.
export const behaviorDescriptions: Record<string, BehaviorDescription> = {
  "Layer-Tap": {
    text: "Activates the selected layer while held and sends the selected key when tapped. The keyboard firmware controls the hold/tap timing.",
    url: "https://zmk.dev/docs/keymaps/behaviors/hold-tap#layer-tap",
  },
  "Hold-Tap": {
    text: "Performs one action when held and another when tapped. The actions and timing are defined in the keyboard firmware.",
    url: "https://zmk.dev/docs/keymaps/behaviors/hold-tap",
  },
  "Tap Dance": {
    text: "Performs different actions depending on how many times you tap the key in quick succession. The tap counts, actions, and timing are defined in the keyboard firmware.",
    url: "https://zmk.dev/docs/keymaps/behaviors/tap-dance",
  },
  "Shift/Caps Lock Tap Dance": {
    text: "Uses different tap counts to choose between Shift and Caps Lock. The tap counts and timing are defined in the keyboard firmware.",
    url: "https://zmk.dev/docs/keymaps/behaviors/tap-dance",
  },
  "Mod-Morph": {
    text: "Changes its action when a configured modifier is held. The alternate action and triggering modifiers are defined in the keyboard firmware.",
    url: "https://zmk.dev/docs/keymaps/behaviors/mod-morph",
  },
  "Grave/Escape": {
    text: "Sends Escape normally, or the grave accent (`) when Shift or GUI is held.",
    url: "https://zmk.dev/docs/keymaps/behaviors/mod-morph",
  },
  "Caps Word": {
    text: "Capitalizes letters while you type a word. Turns off on a word-ending key, such as Space, or when pressed again; the continuation keys are configurable.",
    url: "https://zmk.dev/docs/keymaps/behaviors/caps-word",
  },
  "Sticky Key": {
    text: "Keeps the selected key or modifier active for the next key without holding it down. Expires after the configured timeout if unused.",
    url: "https://zmk.dev/docs/keymaps/behaviors/sticky-key",
  },
  "Sticky Layer": {
    text: "Activates the selected layer for the next key press without holding the layer key. Expires after the configured timeout if unused.",
    url: "https://zmk.dev/docs/keymaps/behaviors/sticky-layer",
  },
  "Momentary Layer": {
    text: "Activates the selected layer while this key is held, then deactivates it when released.",
    url: "https://zmk.dev/docs/keymaps/behaviors/layers#momentary-layer",
  },
  "Toggle Layer": {
    text: "Switches the selected layer on or off. It stays in that state after this key is released.",
    url: "https://zmk.dev/docs/keymaps/behaviors/layers#toggle-layer",
  },
  "Toggle Layer On": {
    text: "Activates the selected layer and leaves it on after this key is released.",
    url: "https://zmk.dev/docs/keymaps/behaviors/layers#toggle-layer",
  },
  "Toggle Layer Off": {
    text: "Deactivates the selected layer.",
    url: "https://zmk.dev/docs/keymaps/behaviors/layers#toggle-layer",
  },
  "To Layer": {
    text: "Activates the selected layer and deactivates all other layers except the default layer.",
    url: "https://zmk.dev/docs/keymaps/behaviors/layers#to-layer",
  },
  "Key Toggle": {
    text: "Holds the selected key down after you release this key. Press again to release the selected key.",
    url: "https://zmk.dev/docs/keymaps/behaviors/key-toggle",
  },
  "Key Toggle On": {
    text: "Presses and holds the selected key until another action releases it.",
    url: "https://zmk.dev/docs/keymaps/behaviors/key-toggle",
  },
  "Key Toggle Off": {
    text: "Releases the selected key if it is held down.",
    url: "https://zmk.dev/docs/keymaps/behaviors/key-toggle",
  },
  "Key Repeat": {
    text: "Sends the last key again, including its modifiers. Which types of keys are remembered is configurable in the keyboard firmware.",
    url: "https://zmk.dev/docs/keymaps/behaviors/key-repeat",
  },
  None: {
    text: "Does nothing and blocks this position from falling through to a lower layer.",
    url: "https://zmk.dev/docs/keymaps/behaviors/misc#none",
  },
  "Encoder Key Press": {
    text: "Sends the first key for clockwise encoder rotation and the second key for counterclockwise rotation.",
    url: "https://zmk.dev/docs/keymaps/behaviors/sensor-rotate#variable-sensor-rotation",
  },
  "Sensor Rotation": {
    text: "Runs a different action for clockwise and counterclockwise rotation. The actions are defined in the keyboard firmware.",
    url: "https://zmk.dev/docs/keymaps/behaviors/sensor-rotate",
  },
  "Mouse Key Press": {
    text: "Presses the selected mouse button or buttons while this key is held, then releases them.",
    url: "https://zmk.dev/docs/keymaps/behaviors/mouse-emulation#mouse-button-press",
  },
  "Mouse Move": {
    text: "Moves the mouse pointer in the configured direction while held. Speed and acceleration are configured in the keyboard firmware.",
    url: "https://zmk.dev/docs/keymaps/behaviors/mouse-emulation",
  },
  "Mouse Scroll": {
    text: "Scrolls vertically or horizontally while held, using the configured direction and speed.",
    url: "https://zmk.dev/docs/keymaps/behaviors/mouse-emulation",
  },
  Macro: {
    text: "Runs a sequence of key presses or other actions. The sequence and how it responds to pressing or releasing this key are defined in the keyboard firmware.",
    url: "https://zmk.dev/docs/keymaps/behaviors/macros",
  },
  Bootloader: {
    text: "Restarts the keyboard in bootloader mode so you can flash new firmware. On split keyboards, affects the side where this key is pressed.",
    url: "https://zmk.dev/docs/keymaps/behaviors/reset#bootloader-reset",
  },
  Reset: {
    text: "Restarts the keyboard using its current firmware. On split keyboards, affects the side where this key is pressed.",
    url: "https://zmk.dev/docs/keymaps/behaviors/reset#reset",
  },
  "Soft Off": {
    text: "Turns the keyboard off. Use its power or reset button to turn it back on, depending on the hardware.",
    url: "https://zmk.dev/docs/keymaps/behaviors/soft-off",
  },
  "External Power": {
    text: "Controls the board’s external power output, for example to save battery power used by LEDs.",
    url: "https://zmk.dev/docs/keymaps/behaviors/power",
  },
  "Output Selection": {
    text: "Chooses whether key presses are sent over USB or Bluetooth when both are connected.",
    url: "https://zmk.dev/docs/keymaps/behaviors/outputs",
  },
  "Studio Unlock": {
    text: "Allows ZMK Studio to change the keyboard’s configuration until it locks again after inactivity or disconnection.",
    url: "https://zmk.dev/docs/keymaps/behaviors/studio-unlock",
  },
  Bluetooth: {
    text: "Manages Bluetooth profiles and pairings. Profile numbers start at 0. Clearing a profile removes its saved pairing.",
    url: "https://zmk.dev/docs/keymaps/behaviors/bluetooth",
  },
};

const normalizeName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "");
const descriptionsByName = new Map(
  Object.entries(behaviorDescriptions).map(([name, description]) => [
    normalizeName(name),
    description,
  ]),
);

// Some firmware behaviors report their node name instead of a display name.
const aliases: Record<string, string> = {
  enckeypress: "Encoder Key Press",
  incdeckp: "Encoder Key Press",
  incdeccp: "Encoder Key Press",
  behaviorsensorrotatekeypress: "Encoder Key Press",
  sensorrotate: "Sensor Rotation",
  sensorrotatevar: "Sensor Rotation",
  mousebuttonpress: "Mouse Key Press",
  zsooff: "Soft Off",
  // The user's custom Shift/Caps Lock behavior is a tap dance.
  shiftcapslock: "Shift/Caps Lock Tap Dance",
  shiftcaps: "Shift/Caps Lock Tap Dance",
};

export function getBehaviorDescription(
  displayName: string,
): BehaviorDescription | undefined {
  const name = normalizeName(displayName);
  if (
    getLightingKind(displayName) ||
    [
      "keypress",
      "modtap",
      "transparent",
      "media",
      "mediakey",
      "mediakeys",
      "mediakeypress",
      "consumerkeypress",
      "consumercontrol",
    ].includes(name)
  )
    return undefined;
  const direct = descriptionsByName.get(name);
  if (direct) return direct;

  const alias = aliases[name];
  if (alias) return behaviorDescriptions[alias];

  // Names can identify a behavior family, but do not expose its nested bindings.
  if (name.includes("tapdance")) {
    return behaviorDescriptions[
      name.includes("shift") && name.includes("caps")
        ? "Shift/Caps Lock Tap Dance"
        : "Tap Dance"
    ];
  }
  if (name.includes("holdtap")) return behaviorDescriptions["Hold-Tap"];
  if (name.includes("modmorph")) return behaviorDescriptions["Mod-Morph"];
  if (name.includes("macro")) return behaviorDescriptions.Macro;

  return {
    text: "Custom behavior defined in your keyboard firmware. Studio does not receive its internal actions; check the keyboard’s keymap for how to use it.",
  };
}
