import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Character } from "@/types/character";
import { Lock } from "lucide-react";
import { CharacterBaseStatRow } from "./CharacterBaseStatRow";
import { CharacterSkillStatRow } from "./CharacterSkillStatRow";
import { baseStatMap, skillStatMap } from "@/assets/data/stats";

interface CharacterCardProps {
    character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
    const primary = character.primaryColor || "#4B5563";
    const secondary = character.secondaryColor || "#9CA3AF";

    return (
        <Card 
            className="w-80 overflow-hidden shadow-lg border-0 rounded-xl"
            style={{ 
                background: `linear-gradient(135deg, ${primary}, ${secondary})`,
            }}
        >
            {character.image && (
                <div className="h-40 w-full overflow-hidden">
                    <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-background-to-b from-black/40 to-transparent" />
                </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between p-4 bg-black/30">
                <CardTitle className="text-lg text-white drop-shadow">{ character.name }</CardTitle>
                { character.locked && <Lock className="w-5 h-5 text-white/70"></Lock>}
            </CardHeader>
            <CardContent className="bg-white p-4 rounded-b-xl">
                <CharacterBaseStatRow 
                    stats={character.baseStats}
                    statMap={baseStatMap}
                />
                <CharacterSkillStatRow 
                    stats={character.skillStats}
                    statMap={skillStatMap}
                />
            </CardContent>
        </Card>
    );
}

export default CharacterCard