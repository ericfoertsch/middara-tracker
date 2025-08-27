import type { DiceColor, DiceDisplayType } from "@/types/dice";
import { Die } from "./Die";

interface DiceDisplayProps {
    mode: DiceDisplayType;
    dice: (DiceColor | null)[];
}

export function DiceDisplay({mode, dice}: DiceDisplayProps) {
    return (
        <div className="flex gap-3">
            {mode === "conviction" && 
            dice.map((d, i) => 
                d ? <Die key={i} color={d} /> : <div key={i} className="w-12 h-12" />
            )}
            {mode === "casting" &&
                (dice[0] ? <Die color={dice[0]} /> : <div className="w-12 h-12" />)}
        </div>
    );
};