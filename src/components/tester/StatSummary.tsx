import type { Character } from '@/types/character'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatSummaryProps {
  character: Character | undefined
}

export function StatSummary({ character }: StatSummaryProps) {
  if (!character) {
    return (
      <Card>
        <CardContent className="pt-4 text-sm text-muted-foreground">
          Select a character to see stats.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Stats — {character.name}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Health', value: character.baseStats.health },
            { label: 'Defense', value: character.baseStats.defense },
            { label: 'Movement', value: character.baseStats.movement },
            { label: 'SP', value: character.sp },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border p-3 bg-muted/20">
              <p className="text-base font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2 text-center">
          {Object.entries(character.skillStats).map(([key, value]) => (
            <div key={key} className="rounded-lg border p-3 bg-muted/20">
              <p className="text-base font-bold">{value}</p>
              <p className="text-xs text-muted-foreground capitalize">{key}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
