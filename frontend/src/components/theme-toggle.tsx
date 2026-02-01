"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const storageKey = "tatvivah-theme";

type ThemeMode = "light" | "dark";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  root.style.colorScheme = theme;
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<ThemeMode>("light");

  React.useEffect(() => {
    const stored = window.localStorage.getItem(storageKey) as ThemeMode | null;
    const initial = stored ?? "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(storageKey, next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "h-9 w-9 flex items-center justify-center border border-border-soft bg-card text-muted-foreground transition-all duration-300 hover:bg-cream hover:text-foreground dark:hover:bg-brown/50",
        className
      )}
      aria-label="Toggle theme"
    >
      <span className="text-sm">
        {theme === "dark" ? "◐" : "○"}
      </span>
    </button>
  );
}
