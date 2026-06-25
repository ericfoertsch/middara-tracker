// src/components/campaign/PartyMemberCard.tsx
import type { PartyMember } from '@/types/campaign'
import type { Character } from '@/types/character'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PartyMemberCardProps {
  member: PartyMember
  character: Character | undefined
  onAdjustHealth: (amount: number) => void
}

const STATUS_COLORS: Record<PartyMember['status'], string> = {
  active: 'bg-green-500/20 text-green-700 dark:text-green-400',
  injured: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  missing: 'bg-red-500/20 text-red-700 dark:text-red-400',
}

export function PartyMemberCard({ member, character, onAdjustHealth }: PartyMemberCardProps) {
  const healthPct = member.maxHealth > 0 ? member.currentHealth / member.maxHealth : 0
  const barColor = healthPct > 0.5 ? 'bg-green-500' : healthPct > 0.25 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base truncate">
            {character?.name ?? member.characterCardId}
          </CardTitle>
          <Badge className={cn('text-xs shrink-0', STATUS_COLORS[member.status])}>
            {member.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Health bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={cn('h-2 rounded-full transition-all', barColor)}
            style={{ width: `${Math.round(healthPct * 100)}%` }}
          />
        </div>

        {/* Health controls */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono">
            {member.currentHealth} / {member.maxHealth}
          </span>
          <div className="flex gap-1">
            {[-5, -3, -1].map((v) => (
              <Button
                key={v}
                size="icon"
                variant="outline"
                className="h-8 w-8 text-destructive border-destructive/30"
                onClick={() => onAdjustHealth(v)}
              >
                <span className="text-xs font-bold">{v}</span>
              </Button>
            ))}
            {[1, 3, 5].map((v) => (
              <Button
                key={v}
                size="icon"
                variant="outline"
                className="h-8 w-8 text-green-600 border-green-600/30"
                onClick={() => onAdjustHealth(v)}
              >
                <span className="text-xs font-bold">+{v}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
