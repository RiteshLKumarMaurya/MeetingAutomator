"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("meetingautomator-theme-v2") as Theme | null;
    const preferred: Theme = stored === "light" || stored === "dark" ? stored : "dark";
    setTheme(preferred);
    document.documentElement.dataset.theme = preferred;
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("meetingautomator-theme-v2", next);
  };

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} title="Toggle theme">
      <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
      <span className="theme-toggle-label">{theme === "light" ? "Night" : "Light"}</span>
    </button>
  );
}
