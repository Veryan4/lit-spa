import { State } from "../models";

const THEME_KEY = "lit-spa-theme";

const state = new State<string>();

export const themeService = {
  getTheme,
  changeTheme,
  registerThemes,
  state,
};

let themes: Record<string, any> = {
  light: {
    "--primary-color": "#2c2c2c",
    "--secondary-color": "black",
    "--primary-background-color": "#fafafa",
    "--secondary-background-color": "white",
    "--image-color": "unset",
    "--input-fill": "#E8E8E8",
    "--outline-color": "#b0bec5",
    "--toast-background": "#313131",
    "--chip-background": "#E8E8E8",
  },
  dark: {
    "--primary-color": "#fafafa",
    "--secondary-color": "white",
    "--primary-background-color": "#2c2c2c",
    "--secondary-background-color": "black",
    "--image-color": "invert(100%)",
    "--input-fill": "#696969",
    "--outline-color": "#2c2c2c",
    "--toast-background": "black",
    "--chip-background": "#696969",
  },
};

function setTheme(theme: Record<string, string>): void {
  const root = document.querySelector(":root") as HTMLElement;
  Object.keys(theme).forEach((key) => root.style.setProperty(key, theme[key]));
}

function getTheme(): string {
  const storedTheme = localStorage.getItem(THEME_KEY);
  return storedTheme || detectOSTheme();
}

function changeTheme(newTheme: string): void {
  if (themes.hasOwnProperty(newTheme)) {
    setTheme(themes[newTheme]);
    localStorage.setItem(THEME_KEY, newTheme);
    state.update(newTheme);
  } else {
    console.warn(newTheme + " isn't registered as a theme yet!");
  }
}

function registerThemes(themesMap?: Record<string, any>) {
  if (themesMap) {
    themes = themesMap;
  }
  const initTheme = getTheme();
  if (themes.hasOwnProperty(initTheme)) {
    setTheme(themes[initTheme]);
  } else {
    setTheme(themes["light"]);
  }
}

function detectOSTheme() {
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}
