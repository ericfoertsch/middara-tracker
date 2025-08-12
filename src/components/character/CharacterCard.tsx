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
    return (
        <Card className="w-80">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{ character.name }</CardTitle>
                { character.locked && <Lock className="w-5 h-5 text-gray-500"></Lock>}
            </CardHeader>
            <CardContent>
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