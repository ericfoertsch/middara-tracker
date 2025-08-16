import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Character } from "@/types/character";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Lock } from "lucide-react";
import { CharacterTooltip } from "./CharacterTooltip";
import { CategoryBadge } from "../elements/CategoryBadge";

interface CharacterCardProps {
    character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
    const primary = character.primaryColor || "#4B5563";
    const secondary = character.secondaryColor || "#9CA3AF";

    return (
        <TooltipProvider>
            <Card className="w-80 overflow-visible shadow-none border-0 rounded-xl bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between p-4 bg-black/30 rounded-t-xl"
                            style={{ 
                    background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                }}>
                    <CardTitle 
                        className="text-lg text-white drop-shadow truncate max-w-[220px]"
                    >
                        <CharacterTooltip text={character.name}>{ character.name }</ CharacterTooltip>
                    </CardTitle>
                    { character.locked && <Lock className="w-5 h-5 text-white/70 flex-shrink-0"></Lock>}
                </CardHeader>
                <CardContent className="bg-white p-4 rounded-b-xl">
                    <CategoryBadge category="Adventurer" subcategory={character.name} categoryColor="#12FF45" />
                </CardContent>
            </Card>
        </ TooltipProvider>
    );
}

export default CharacterCard