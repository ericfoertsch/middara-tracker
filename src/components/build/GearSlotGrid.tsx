// src/components/build/GearSlotGrid.tsx
import type { BuildGear } from '@/types/gear'
import { GearSlot } from './GearSlot'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface GearSlotGridProps {
  gear: BuildGear
  onClearSingle: (slot: 'hand1' | 'hand2' | 'armor' | 'core') => void
  onClearRelic: (index: number) => void
  onClearAccessory: (index: number) => void
  onAddRelicSlot: () => void
  onAddAccessorySlot: () => void
}

export function GearSlotGrid({
  gear,
  onClearSingle,
  onClearRelic,
  onClearAccessory,
  onAddRelicSlot,
  onAddAccessorySlot,
}: GearSlotGridProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <GearSlot label="Hand 1" item={gear.hand1} onClear={gear.hand1 ? () => onClearSingle('hand1') : undefined} />
        <GearSlot label="Hand 2" item={gear.hand2} onClear={gear.hand2 ? () => onClearSingle('hand2') : undefined} />
        <GearSlot label="Armor" item={gear.armor} onClear={gear.armor ? () => onClearSingle('armor') : undefined} />
        <GearSlot label="Core" item={gear.core} onClear={gear.core ? () => onClearSingle('core') : undefined} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Relics</p>
          <Button size="sm" variant="outline" onClick={onAddRelicSlot}>
            <Plus className="h-3 w-3 mr-1" /> Add Slot
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {gear.relics.map((relic, i) => (
            <GearSlot
              key={i}
              label={`Relic ${i + 1}`}
              item={relic}
              onClear={relic ? () => onClearRelic(i) : undefined}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Accessories</p>
          <Button size="sm" variant="outline" onClick={onAddAccessorySlot}>
            <Plus className="h-3 w-3 mr-1" /> Add Slot
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {gear.accessories.map((acc, i) => (
            <GearSlot
              key={i}
              label={`Accessory ${i + 1}`}
              item={acc}
              onClear={acc ? () => onClearAccessory(i) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
