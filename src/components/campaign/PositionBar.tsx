// src/components/campaign/PositionBar.tsx
import type { CampaignPosition } from '@/types/campaign'
import { Input } from '@/components/ui/input'

interface PositionBarProps {
  position: CampaignPosition
  onChange: (position: CampaignPosition) => void
}

export function PositionBar({ position, onChange }: PositionBarProps) {
  return (
    <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-2 border">
      <div className="flex items-center gap-1.5 flex-1">
        <span className="text-xs font-medium text-muted-foreground shrink-0">Chapter</span>
        <Input
          className="h-7 text-sm border-none shadow-none bg-transparent focus-visible:ring-0 px-1"
          value={position.chapter}
          onChange={(e) => onChange({ ...position, chapter: e.target.value })}
          placeholder="—"
        />
      </div>
      <div className="flex items-center gap-1.5 w-24">
        <span className="text-xs font-medium text-muted-foreground shrink-0">Pg</span>
        <Input
          className="h-7 text-sm border-none shadow-none bg-transparent focus-visible:ring-0 px-1"
          type="number"
          value={position.page}
          onChange={(e) => onChange({ ...position, page: parseInt(e.target.value) || 1 })}
        />
      </div>
      <div className="flex items-center gap-1.5 flex-1">
        <span className="text-xs font-medium text-muted-foreground shrink-0">Mission</span>
        <Input
          className="h-7 text-sm border-none shadow-none bg-transparent focus-visible:ring-0 px-1"
          value={position.mission}
          onChange={(e) => onChange({ ...position, mission: e.target.value })}
          placeholder="—"
        />
      </div>
    </div>
  )
}
