"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/contexts/theme-context";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, mounted, toggle } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-8 w-8 ${className ?? ""}`}
      onClick={toggle}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
      suppressHydrationWarning
    >
      {/* Render placeholder until mounted to avoid hydration mismatch */}
      {mounted ? (
        isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4 opacity-0" />
      )}
    </Button>
  );
}
