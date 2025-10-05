// src/utils/replacementMap.tsx
import { IconTextBadge } from "@/components/discipline/IconTextBadge";
import type { Replacement } from "@/types/replacements";
import { Star, ArrowDown } from "lucide-react";

export const replacementMap: Record<string, Replacement> = {
  Exhaust: {
    type: "iconText",
    element: (
      <IconTextBadge
        icon={<ArrowDown className="w-4 h-4 text-red-500" />}
        text="Exhaust"
      />
    ),
    label: "Exhaust",
    tooltip: "Exhaust"
  },
  SOI: {
    type: "text",
    label: "SOI",
    tooltip: "Range is 4."
  },
  Haste: {
    type: "text",
    label: "Haste",
    tooltip: "This unit acts twice this round.",
  },
  SP: {
    type: "icon",
    element: <Star className="inline w-4 h-4 text-purple-500" />,
    label: "SP"
  },
};
