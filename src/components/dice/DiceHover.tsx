import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import type { DiceFace } from "@/types/dice";
import { symbolIconMap } from "./DiceIcon";

interface DiceHoverProps {
    faces: DiceFace[];
    children: React.ReactNode;
}

export function DiceHover({faces, children}: DiceHoverProps) {
    <HoverCard>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardContent className="w-48">
            <ul className="space-y-1">
                {faces.map((face, i) => (
                    <li key={i} className="flex items-center gap-2">
                        {face.value !== undefined && (
                            <span className="font-mono text-sm">{face.value}</span>
                        )}
                        {face.symbols?.map((s, idx) => (
                            <span key={idx}>{symbolIconMap[s]}</span>
                        ))}
                    </li>
                ))}
            </ul>
        </HoverCardContent>
    </HoverCard>
}