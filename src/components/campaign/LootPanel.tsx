// src/components/campaign/LootPanel.tsx
import { useState } from 'react'
import type { GearItem, GearCategory } from '@/types/gear'
import type { PartyMember } from '@/types/campaign'
import type { Character } from '@/types/character'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Package, Plus } from 'lucide-react'

const CATEGORIES: GearCategory[] = ['weapon', 'armor', 'core', 'relic', 'accessory', 'consumable']
const SINGLE_SLOTS = ['hand1', 'hand2', 'armor', 'core'] as const

const CATEGORY_TO_SLOTS: Partial<Record<GearCategory, typeof SINGLE_SLOTS[number][]>> = {
  weapon: ['hand1', 'hand2'],
  armor: ['armor'],
  core: ['core'],
}

interface LootPanelProps {
  loot: GearItem[]
  party: PartyMember[]
  characters: Character[]
  onAddLoot: (item: GearItem) => void
  onEquipSingle: (memberIndex: number, slot: typeof SINGLE_SLOTS[number], item: GearItem | null) => void
}

export function LootPanel({ loot, party, characters, onAddLoot, onEquipSingle }: LootPanelProps) {
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<GearCategory>('weapon')

  function handleAdd() {
    if (!newName.trim()) return
    onAddLoot({ id: crypto.randomUUID(), name: newName.trim(), category: newCategory })
    setNewName('')
  }

  return (
    <div className="space-y-3">
      {/* Add loot form */}
      <div className="flex gap-2">
        <Input
          placeholder="Item name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <Select value={newCategory} onValueChange={(v) => setNewCategory(v as GearCategory)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="icon" onClick={handleAdd}><Plus className="w-4 h-4" /></Button>
      </div>

      {/* Loot list */}
      {loot.length === 0 && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Package className="w-4 h-4" /> No loot found yet.
        </p>
      )}
      <div className="space-y-2">
        {loot.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2 border rounded-md px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium truncate">{item.name}</span>
              <Badge variant="outline" className="text-xs shrink-0">{item.category}</Badge>
            </div>
            {/* Quick equip to single slots only for now */}
            {CATEGORY_TO_SLOTS[item.category] && party.length > 0 && (
              <Select
                onValueChange={(v) => {
                  const [memberIdx, slot] = v.split('|')
                  onEquipSingle(parseInt(memberIdx), slot as typeof SINGLE_SLOTS[number], item)
                }}
              >
                <SelectTrigger className="w-40 h-7 text-xs">
                  <SelectValue placeholder="Equip to..." />
                </SelectTrigger>
                <SelectContent>
                  {party.map((m, i) => {
                    const char = characters.find((c) => c.cardId === m.characterCardId)
                    const slots = CATEGORY_TO_SLOTS[item.category] ?? []
                    return slots.map((slot) => (
                      <SelectItem key={`${i}|${slot}`} value={`${i}|${slot}`}>
                        {char?.name ?? m.characterCardId} — {slot}
                      </SelectItem>
                    ))
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
