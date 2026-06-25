import { convictionRatings } from "@/types/dice"
import type { DiceColor } from "@/types/dice"

const ratingToColorMap: Record<number, DiceColor> = Object.entries(convictionRatings).reduce(
  (acc, [color, rating]) => ({ ...acc, [rating]: color as DiceColor }),
  {} as Record<number, DiceColor>
)

export function ratingToColor(rating: number): DiceColor | null {
  return ratingToColorMap[rating] ?? null
}
