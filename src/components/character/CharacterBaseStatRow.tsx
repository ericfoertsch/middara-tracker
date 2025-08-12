import type { StatDefinition } from "@/types/stats";
import { CharacterStat } from "./CharacterStat";
import type { CharacterBaseStats } from "@/types/character";

interface CharacterBaseStatRowProps {
    stats: CharacterBaseStats;
    statMap: Record<string, StatDefinition>;
}

export function CharacterBaseStatRow({ stats, statMap }: CharacterBaseStatRowProps) {
    return (
        <div className="flex justify-around mb-2">
            <CharacterStat key="health" stat={statMap["health"]} value={stats.health} />
            <CharacterStat key="defense" stat={statMap["defense"]} value={stats.defense} />
            <CharacterStat key="movement" stat={statMap["movement"]} value={stats.movement} />
        </div>
    );
}