const THEME_KEY = "deepfake_theme";

export type Theme = "dark" | "light";

export const getTheme = (): Theme => {
  return (localStorage.getItem(THEME_KEY) as Theme) || "dark";
};

export const setTheme = (theme: Theme) => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const initTheme = () => {
  setTheme(getTheme());
};
