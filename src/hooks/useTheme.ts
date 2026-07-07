import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import { useEffect, useState } from "react";

import {
  applyThemeToDocument,
  resolveColorMode,
  type Theme,
} from "../utils/theme";

export type { Theme };

export default function useTheme(defaultTheme: Theme = "auto") {
  const isMatchDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [value, setValue] = useLocalStorage<Theme>("theme", defaultTheme);
  const [theme, setTheme] = useState<Theme>(value);

  const colorMode = resolveColorMode(theme, isMatchDark);

  useEffect(() => {
    if (value && value !== theme) {
      setTheme(value);
    }
  }, []);

  useEffect(() => {
    applyThemeToDocument(colorMode);
  }, [colorMode]);

  const setThemeAndStorage = (next: Theme) => {
    setValue(next);
    setTheme(next);
  };

  return {
    colorMode,
    theme,
    setTheme: setThemeAndStorage,
  };
}
