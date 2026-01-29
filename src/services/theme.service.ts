import { State } from "../models";

const THEME_KEY = "lit-spa-theme";

const state = new State<string>();

export const themeService = {
  getTheme,
  changeTheme,
  registerThemes,
  state,
};

let themes: Record<string, Record<string, string>> = {
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

function changeTheme(newTheme: string, persist = true): void {
  if (!Object.hasOwn(themes, newTheme)) {
    console.warn(newTheme + " isn't registered as a theme yet!");
    return;
  }
  setTheme(themes[newTheme]);
  if (persist) localStorage.setItem(THEME_KEY, newTheme);
  state.update(newTheme);
}

function registerThemes(themesMap?: Record<string, Record<string, string>>) {
  if (themesMap) {
    themes = themesMap;
  }
  const initTheme = getTheme();
  const name = Object.hasOwn(themes, initTheme) ? initTheme : "light";
  setTheme(themes[name]);
  state.update(name);
  watchOperatingSystemTheme();
}

let watchingOperatingSystemTheme = false;

function watchOperatingSystemTheme() {
  if (watchingOperatingSystemTheme || typeof window === "undefined") return;
  if (!window.matchMedia) return;
  watchingOperatingSystemTheme = true;
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (localStorage.getItem(THEME_KEY)) return;
      changeTheme(detectOSTheme(), false);
    });
}

function detectOSTheme() {
  if (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches) {
    return "dark";
  }
  return "light";
}
