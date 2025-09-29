// src/utils/replacements.tsx
import { Flame, Activity, Star } from "lucide-react"

export type ReplacementType =
  | { type: "icon"; element: React.ReactNode }
  | { type: "text"; label: string; tooltip?: string }
  | { type: "bar"; label: string } // for Blaa|1 style

export const replacementMap: Record<string, ReplacementType> = {
  Exhaust: { type: "icon", element: <Flame className="inline w-4 h-4 text-red-500" /> },
  SOI: { type: "icon", element: <Activity className="inline w-4 h-4 text-blue-500" /> },
  Haste: { type: "text", label: "Haste", tooltip: "This unit acts twice this round." },
  SP: { type: "icon", element: <Star className="inline w-4 h-4 text-purple-500" /> },
  Blaa: { type: "bar", label: "Blaa" },
}
