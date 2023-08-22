export interface KeyBindContextInterface {
  keyBinds: KeyBindType[];
  setKeyBinds(keyBinds: KeyBindType[]): void;
  getKeyBinds: () => Promise<KeyBindType[]>;
  registerKeyBinds: (keyBind: KeyBindType[]) => Promise<void>;
  unregisterKeyBind: (keyBind: KeyBindType) => Promise<void>;
}
