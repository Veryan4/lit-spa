const THEME_EVENT = "lit-spa-theme-update";
const THEME_KEY = "lit-spa-theme";

export const themeService = {
  getTheme,
  changeTheme,
  registerThemes,
  THEME_EVENT,
};

let root: HTMLElement;

let themes: Record<string, any> = {
  light: {
    "--primary-color": "#2c2c2c",
    "--primary-background-color": "#fafafa",
    "--secondary-background-color": "white",
    "--image-color": "unset",
    "--input-fill": "#E8E8E8",
    "--outline-color": "#b0bec5",
    "--toast-background": "#313131",
    "--chip-background": "#E8E8E8",
  },
};

function setTheme(theme: Record<string, string>): void {
  Object.keys(theme).forEach((key) => root.style.setProperty(key, theme[key]));
}

function getTheme(): string {
  const storedTheme = localStorage.getItem(THEME_KEY);
  return storedTheme ? storedTheme : "light";
}

function changeTheme(newTheme: string): void {
  if (themes.hasOwnProperty(newTheme)) {
    setTheme(themes[newTheme]);
    localStorage.setItem(THEME_KEY, newTheme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT));
  } else {
    console.warn(newTheme + " isn't registered as a theme yet!");
  }
}

function registerThemes(rootHTML: HTMLElement, themesMap: Record<string, any>) {
  root = rootHTML;
  themes = themesMap;
  const initTheme = getTheme();
  if (themes.hasOwnProperty(initTheme)) {
    setTheme(themes[initTheme]);
  } else {
    setTheme(themes["light"]);
  }
}
