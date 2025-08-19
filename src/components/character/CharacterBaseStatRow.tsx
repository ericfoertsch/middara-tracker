import { CharacterStat } from "./CharacterStat";
import type { CharacterBaseStats } from "@/types/character";
import { baseStatMap } from "@/assets/data/stats";

interface CharacterBaseStatRowProps {
    stats: CharacterBaseStats;
}

export function CharacterBaseStatRow({ stats }: CharacterBaseStatRowProps) {
    const statMap = baseStatMap
    return (
        <div className="flex justify-around mb-2">
            <CharacterStat key="health" stat={statMap["health"]} value={stats.health} />
            <CharacterStat key="defense" stat={statMap["defense"]} value={stats.defense} />
            <CharacterStat key="movement" stat={statMap["movement"]} value={stats.movement} />
        </div>
    );
}