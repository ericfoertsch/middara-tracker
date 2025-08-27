import { dice } from "@/assets/data/diceData";
import type { DiceColor } from "@/types/dice";
import { DiceHover } from "./DiceHover";

interface DieProps {
    color: DiceColor;
    size?: number;
}

const colorStyles: Record<DiceColor, string> = {
  black: "bg-black text-white border-white",
  purple: "bg-purple-600 text-white border-black",
  white: "bg-white text-black border-black",
  orange: "bg-orange-500 text-white border-black",
  teal: "bg-teal-500 text-white border-black",
  red: "bg-red-600 text-white border-black",
  green: "bg-green-600 text-white border-black",
  grey: "bg-gray-400 text-black border-black",
  blue: "bg-blue-600 text-white border-black"
};

export function Die({color, size = 48}: DieProps) {
    const faces = dice[color];

    return (
        <DiceHover faces={faces}>
            <div
                className={`
                    ${colorStyles[color]}
                    flex items-center justify-center
                    rounded-md border-2 shadow-md
                    cursor-pointer hover:scale-105 transition-transform
                `}
                style={{ width: size, height: size }}
            >
                🎲
            </div>
        </DiceHover>
    );
}