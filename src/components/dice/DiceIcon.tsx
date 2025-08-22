import { Book, Shield, Zap, Skull } from "lucide-react";
import type { DiceSymbol } from "@/types/dice";
import type { JSX } from "react";

export const symbolIconMap: Record<DiceSymbol, JSX.Element> = {
    book: <Book className="inline w-4 h-4 text-white" />,
    shield: <Shield className="inline w-4 h-4 text-white" />,
    burst: <Zap className="inline w-4 h-4 text-white" />,
    skull: <Skull className="inline w-4 h-4 text-white" />,
}