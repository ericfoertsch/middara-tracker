import { dice as diceData } from '@/assets/data/diceData'
import type { DiceColor, DiceFace, DiceSymbol } from '@/types/dice'

export interface DieAverage {
  averageValue: number
  symbolProbs: Record<DiceSymbol, number>
}

export interface PoolResult {
  averageTotal: number
  symbolProbs: Record<DiceSymbol, number>
  minTotal: number
  maxTotal: number
}

export function averageDie(faces: DiceFace[]): DieAverage {
  const count = faces.length
  const symbolProbs: Record<DiceSymbol, number> = { book: 0, shield: 0, burst: 0, skull: 0 }

  let totalValue = 0
  for (const face of faces) {
    totalValue += face.value ?? 0
    if (face.symbols) {
      for (const sym of face.symbols) {
        symbolProbs[sym] += 1 / count
      }
    }
  }

  return { averageValue: totalValue / count, symbolProbs }
}

export function calculatePool(colors: DiceColor[]): PoolResult {
  const symbolProbs: Record<DiceSymbol, number> = { book: 0, shield: 0, burst: 0, skull: 0 }
  let averageTotal = 0
  let minTotal = 0
  let maxTotal = 0

  for (const color of colors) {
    const faces = diceData[color]
    const avg = averageDie(faces)
    averageTotal += avg.averageValue

    const faceValues = faces.map((f) => f.value ?? 0)
    minTotal += Math.min(...faceValues)
    maxTotal += Math.max(...faceValues)

    for (const sym of Object.keys(symbolProbs) as DiceSymbol[]) {
      symbolProbs[sym] += avg.symbolProbs[sym]
    }
  }

  return { averageTotal, symbolProbs, minTotal, maxTotal }
}
