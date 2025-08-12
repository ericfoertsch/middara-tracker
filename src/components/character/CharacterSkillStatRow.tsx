import type { StatDefinition } from "@/types/stats";
import { CharacterStat } from "./CharacterStat";
import type { CharacterSkillStats } from "@/types/character";

interface CharacterSkillStatRowProps {
    stats: CharacterSkillStats;
    statMap: Record<string, StatDefinition>;
}

export function CharacterSkillStatRow({ stats, statMap }: CharacterSkillStatRowProps) {
    return (
        <div className="flex justify-around mb-2">
            <CharacterStat key="presence" stat={statMap["presence"]} value={stats.presence} />
            <CharacterStat key="lore" stat={statMap["lore"]} value={stats.lore} />
            <CharacterStat key="agility" stat={statMap["agility"]} value={stats.agility} />
            <CharacterStat key="perception" stat={statMap["perception"]} value={stats.perception} />
            <CharacterStat key="strength" stat={statMap["strength"]} value={stats.strength} />
        </div>
    );
}