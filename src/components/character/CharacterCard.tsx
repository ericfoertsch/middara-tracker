import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Character } from "@/types/character";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Eye, Lock } from "lucide-react";
import { CharacterTooltip } from "./CharacterTooltip";
import { CategoryBadge } from "../elements/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CharacterCardProps {
    character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
    const primary = character.primaryColor || "#4B5563";
    const secondary = character.secondaryColor || "#9CA3AF";
    const urlName = character.name.trim().replace(/\s+/g, "-");

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
                    <CategoryBadge category="Adventurer" subcategory={character.adventurer} categoryColor="#12FF45" />
                </CardContent>
                <CardFooter>
                    <Button asChild size="sm" variant="ghost" className="p-1 bg-primary text-primary-foreground">
                        <Link to={`/characters/${urlName}`} title={`View ${character.name}`}>
                            <Eye className="w-4 h-4 text-white" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </ TooltipProvider>
    );
}

export default CharacterCard