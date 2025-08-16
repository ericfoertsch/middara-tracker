import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

interface CharacterTooltipProps {
    children: ReactNode;
    text: string;
    maxWidth?: string;
    className?: string;
}

export function CharacterTooltip({ children, text, maxWidth="220px", className}: CharacterTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={`truncate ${className ?? ""}`}
                    style={{ maxWidth }}
                >
                    {children}
                </div>
            </ TooltipTrigger>
            <TooltipContent side="top">
                {text}
            </TooltipContent>
        </Tooltip>
    );
}