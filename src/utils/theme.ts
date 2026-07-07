export type Theme = "light" | "dark" | "auto" | "eye-care";

export type ColorMode = "light" | "dark" | "eye-care";

export const THEME_CYCLE: Theme[] = ["light", "eye-care", "dark", "auto"];

export function resolveColorMode(
  theme: Theme,
  prefersDark = false
): ColorMode {
  if (theme === "auto") {
    return prefersDark ? "dark" : "light";
  }
  return theme;
}

export function applyThemeToDocument(colorMode: ColorMode) {
  if (colorMode === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
    return;
  }
  if (colorMode === "eye-care") {
    document.documentElement.setAttribute("data-theme", "eye-care");
    document.documentElement.style.colorScheme = "light";
    return;
  }
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.colorScheme = "light";
}

export function readStoredTheme(): Theme {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem("theme") ?? '"auto"'
    );
    if (
      stored === "light" ||
      stored === "dark" ||
      stored === "auto" ||
      stored === "eye-care"
    ) {
      return stored;
    }
  } catch {
    // ignore malformed localStorage
  }
  return "auto";
}

export function applyStoredTheme() {
  const theme = readStoredTheme();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyThemeToDocument(resolveColorMode(theme, prefersDark));
}

export function nextTheme(current: Theme): Theme {
  const index = THEME_CYCLE.indexOf(current);
  return THEME_CYCLE[(index + 1) % THEME_CYCLE.length];
}

/** Map site color mode to light/dark for third-party embeds (comments, etc.) */
export function embedColorMode(colorMode: ColorMode): "light" | "dark" {
  return colorMode === "dark" ? "dark" : "light";
}
