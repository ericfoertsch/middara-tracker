// src/components/build/GearSlot.tsx
import type { GearItem } from '@/types/gear'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface GearSlotProps {
  label: string
  item: GearItem | null
  onClear?: () => void
}

export function GearSlot({ label, item, onClear }: GearSlotProps) {
  return (
    <div className={cn(
      'rounded-lg border-2 border-dashed p-3 flex flex-col gap-1 min-h-[72px]',
      item ? 'border-muted bg-muted/20' : 'border-muted/40'
    )}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      {item ? (
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate">{item.name}</span>
          {onClear && (
            <Button size="icon" variant="ghost" className="h-5 w-5 shrink-0" onClick={onClear}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Empty</p>
      )}
    </div>
  )
}
