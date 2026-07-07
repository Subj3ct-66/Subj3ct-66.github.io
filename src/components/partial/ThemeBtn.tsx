import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faCircleHalfStroke,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";

import useTheme from "../../hooks/useTheme";
import { nextTheme } from "../../utils/theme";

const THEME_LABELS = {
  light: "浅色模式",
  "eye-care": "护眼模式",
  dark: "深色模式",
  auto: "跟随系统",
} as const;

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <></>;
  }

  const handleClick = () => {
    const next = nextTheme(theme);
    setTheme(next);
    document.body.dispatchEvent(
      new CustomEvent("theme-set", {
        detail: { theme: next },
      })
    );
  };

  return (
    <span
      className={className}
      onClick={handleClick}
      title={THEME_LABELS[theme]}
      aria-label={THEME_LABELS[theme]}
      role="button"
    >
      {theme === "dark" && <FontAwesomeIcon icon={faMoon} scale={20} />}
      {theme === "light" && <FontAwesomeIcon icon={faSun} scale={20} />}
      {theme === "eye-care" && (
        <FontAwesomeIcon icon={faLeaf} scale={20} style={{ color: "#5c8a52" }} />
      )}
      {theme === "auto" && (
        <FontAwesomeIcon icon={faCircleHalfStroke} scale={20} />
      )}
    </span>
  );
}
