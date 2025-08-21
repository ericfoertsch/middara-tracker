import { CharacterStat } from "./CharacterStat";
import type { CharacterSkillStats } from "@/types/character";
import { skillStatMap } from "@/assets/data/stats";

interface CharacterSkillStatRowProps {
    stats: CharacterSkillStats;
}

export function CharacterSkillStatRow({ stats }: CharacterSkillStatRowProps) {
    const statMap = skillStatMap
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