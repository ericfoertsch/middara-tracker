// src/components/ThemeProvider.tsx
import { useEffect } from "react";
import { useRootStore } from "@/stores/root";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useRootStore((state) => state.theme);

  useEffect(() => {
    // Read theme from localStorage if available
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme && storedTheme !== theme) {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(storedTheme);
    } else {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
}
