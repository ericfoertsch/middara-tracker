import { useState } from 'react'
import type { DiceColor, DiceSymbol } from '@/types/dice'
import { calculatePool } from '@/utils/diceCalculations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Die } from '@/components/dice/Die'
import { X } from 'lucide-react'

const AVAILABLE_COLORS: DiceColor[] = ['purple', 'white', 'orange', 'teal', 'red', 'green', 'grey', 'blue', 'black']

const SYMBOL_LABELS: Record<DiceSymbol, string> = {
  shield: 'Shield',
  burst: 'Burst',
  book: 'Book',
  skull: 'Skull',
}

interface DiceSimulatorProps {
  initialDice?: DiceColor[]
}

export function DiceSimulator({ initialDice = [] }: DiceSimulatorProps) {
  const [pool, setPool] = useState<DiceColor[]>(initialDice)

  const result = pool.length > 0 ? calculatePool(pool) : null

  function addDie(color: DiceColor) {
    setPool((prev) => [...prev, color])
  }

  function removeDie(index: number) {
    setPool((prev) => prev.filter((_, i) => i !== index))
  }

  function clearPool() {
    setPool([])
  }

  return (
    <Card>
      <CardHeader><CardTitle>Dice Simulator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {/* Palette */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Add dice to pool:</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => addDie(color)}
                title={`Add ${color} die`}
                className="hover:scale-110 transition-transform"
              >
                <Die color={color} />
              </button>
            ))}
          </div>
        </div>

        {/* Pool */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">Current pool ({pool.length} dice):</p>
            {pool.length > 0 && (
              <Button size="sm" variant="ghost" onClick={clearPool}>Clear</Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 min-h-[48px]">
            {pool.map((color, i) => (
              <button
                key={i}
                onClick={() => removeDie(i)}
                title="Remove die"
                className="relative group"
              >
                <Die color={color} />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded text-white">
                  <X className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="rounded-lg border p-4 space-y-3 bg-muted/20">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold">{result.averageTotal.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Average</p>
              </div>
              <div>
                <p className="text-xl font-bold">{result.minTotal}</p>
                <p className="text-xs text-muted-foreground">Min</p>
              </div>
              <div>
                <p className="text-xl font-bold">{result.maxTotal}</p>
                <p className="text-xs text-muted-foreground">Max</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(SYMBOL_LABELS) as DiceSymbol[]).map((sym) => {
                const prob = result.symbolProbs[sym]
                if (prob === 0) return null
                return (
                  <Badge key={sym} variant="outline">
                    {SYMBOL_LABELS[sym]}: {(prob * 100).toFixed(0)}% avg {prob.toFixed(2)}/roll
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
