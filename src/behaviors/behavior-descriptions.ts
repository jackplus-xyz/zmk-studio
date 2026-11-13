interface BehaviorDescription {
  text: string;
  url: string;
}

// Short paraphrases of the linked official ZMK documentation.
export const behaviorDescriptions: Record<string, BehaviorDescription> = {
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
  Backlight: {
    text: "Controls the keyboard backlight, including its on/off state and brightness.",
    url: "https://zmk.dev/docs/keymaps/behaviors/backlight",
  },
  "RGB Underglow": {
    text: "Controls RGB lighting, including brightness, color, and animation effects.",
    url: "https://zmk.dev/docs/keymaps/behaviors/underglow",
  },
};
