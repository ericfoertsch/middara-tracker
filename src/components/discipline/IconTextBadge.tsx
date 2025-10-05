import type { ReactNode } from "react";

interface IconTextBadgeProps {
    icon: ReactNode;
    text: string;
    className?: string;
}

export function IconTextBadge({ icon, text, className = "" }: IconTextBadgeProps) {
    return (
        <div
            className={`inline-flex items-center gap-1 rounded-sm border border-gray-400 px-2 py-0.5 text-sm ${className}`}
        >
            {icon}
            <span>{text}</span>
        </div>
    );
}