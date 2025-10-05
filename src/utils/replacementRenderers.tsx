import { type JSX } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Replacement } from "@/types/replacements";

/**
 * Centralized renderer for each Replacement type.
 * Handles tooltips and consistent visual formatting.
 */
export function renderReplacement(
  replacement: Replacement,
  barNumber?: string,
  key?: string
): JSX.Element {
  // 🎯 ICON ONLY
  if (replacement.type === "icon") {
    return (
      <span key={key} className="inline-flex items-center align-middle">
        {replacement.element}
      </span>
    );
  }

  // 🎯 TEXT ONLY
  if (replacement.type === "text") {
    if (replacement.tooltip) {
      return (
        <TooltipProvider key={key}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="underline decoration-dotted cursor-help">
                {replacement.label}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-pre-line">
              {replacement.tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return <span key={key}>{replacement.label}</span>;
  }

  // 🎯 ICON + TEXT BADGE (e.g., "Exhaust")
  if (replacement.type === "iconText") {
    const content = (
      <span
        key={key}
        className="inline-flex items-center gap-1 px-0.5 py-0.5 rounded-sm text-xs font-semibold align-middle"
      >
        {replacement.element}
      </span>
    );

    // Tooltip only if defined
    if (replacement.tooltip) {
      return (
        <TooltipProvider key={key}>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-pre-line">
              {replacement.tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  }

  // 🎯 BAR TYPE
  return (
    <span
      key={key}
      className="inline-flex items-center bg-gray-800 text-white px-2 py-0.5 rounded-md text-xs font-semibold"
    >
      {replacement.label}
      {barNumber && <span className="ml-1 font-bold">{barNumber}</span>}
    </span>
  );
}
