import { useParams, Link } from 'react-router-dom'
import { useBuildStore } from '@/stores/build'
import { useCharacterStore } from '@/stores/character'
import { StatSummary } from '@/components/tester/StatSummary'
import { DiceSimulator } from '@/components/tester/DiceSimulator'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ratingToColor } from '@/utils/diceUtils'
import type { DiceColor } from '@/types/dice'

export default function BuildTesterPage() {
  const { buildId } = useParams<{ buildId: string }>()
  const { getBuild } = useBuildStore()
  const { characters } = useCharacterStore()

  const build = getBuild(buildId ?? '')
  const character = characters.find((c) => c.cardId === build?.characterCardId)

  // Pre-seed the dice simulator with the character's conviction dice
  const initialDice: DiceColor[] = character
    ? character.conviction.map(ratingToColor).filter((d): d is DiceColor => d !== null)
    : []

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        {build && (
          <Button size="sm" variant="outline" asChild>
            <Link to={`/builds/${build.id}`}><ArrowLeft className="w-4 h-4 mr-1" /> Back to Build</Link>
          </Button>
        )}
        <h1 className="text-2xl font-bold">
          {build ? `${build.name} — Tester` : 'Build Tester'}
        </h1>
      </div>

      <StatSummary character={character} />
      <DiceSimulator initialDice={initialDice} />
    </div>
  )
}
