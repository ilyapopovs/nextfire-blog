export const THEME_SYSTEM = "system-theme";
export const THEME_LIGHT = "light-theme";
export const THEME_DARK = "dark-theme";

export const THEME_ICON_SYSTEM = "brightness_auto";
export const THEME_ICON_LIGHT = "light_mode";
export const THEME_ICON_DARK = "dark_mode";

export const THEME_SEQUENCE = {
  [THEME_SYSTEM]: THEME_LIGHT,
  [THEME_LIGHT]: THEME_DARK,
  [THEME_DARK]: THEME_SYSTEM,
};

export const THEME_ICONS_SEQUENCE = {
  [THEME_SYSTEM]: THEME_ICON_LIGHT,
  [THEME_LIGHT]: THEME_ICON_DARK,
  [THEME_DARK]: THEME_ICON_SYSTEM,
};

export const DEFAULT_THEME = THEME_SYSTEM;

export const LOCAL_STORAGE_KEY = "themeClass";
