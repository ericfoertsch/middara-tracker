// src/pages/BuildEditorPage.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useBuildStore } from '@/stores/build'
import { useCharacterStore } from '@/stores/character'
import { GearSlotGrid } from '@/components/build/GearSlotGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function BuildEditorPage() {
  const { buildId } = useParams<{ buildId: string }>()
  const { getBuild, updateBuild, deleteBuild } = useBuildStore()
  const { characters } = useCharacterStore()
  const navigate = useNavigate()
  const [newConsumable, setNewConsumable] = useState('')

  const build = getBuild(buildId ?? '')

  if (!build) {
    return <div className="p-6 text-muted-foreground">Build not found.</div>
  }

  function patch(updates: Parameters<typeof updateBuild>[1]) {
    updateBuild(build!.id, updates)
  }

  function handleDelete() {
    deleteBuild(build!.id)
    navigate('/builds')
  }

  function addConsumable() {
    if (!newConsumable.trim()) return
    patch({ consumables: [...build!.consumables, newConsumable.trim()] })
    setNewConsumable('')
  }

  function removeConsumable(i: number) {
    patch({ consumables: build!.consumables.filter((_, idx) => idx !== i) })
  }

  function clearSingleGear(slot: 'hand1' | 'hand2' | 'armor' | 'core') {
    patch({ gear: { ...build!.gear, [slot]: null } })
  }

  function clearRelic(index: number) {
    const relics = [...build!.gear.relics]
    relics[index] = null
    patch({ gear: { ...build!.gear, relics } })
  }

  function clearAccessory(index: number) {
    const accessories = [...build!.gear.accessories]
    accessories[index] = null
    patch({ gear: { ...build!.gear, accessories } })
  }

  function addRelicSlot() {
    patch({ gear: { ...build!.gear, relics: [...build!.gear.relics, null] } })
  }

  function addAccessorySlot() {
    patch({ gear: { ...build!.gear, accessories: [...build!.gear.accessories, null] } })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Input
          className="text-xl font-bold border-none shadow-none px-0 text-foreground max-w-sm focus-visible:ring-0"
          value={build.name}
          onChange={(e) => patch({ name: e.target.value })}
        />
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/builds/${build.id}/test`}>Open Tester</Link>
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Character */}
        <Card>
          <CardHeader><CardTitle>Character</CardTitle></CardHeader>
          <CardContent>
            <Select
              value={build.characterCardId}
              onValueChange={(v) => patch({ characterCardId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a character..." />
              </SelectTrigger>
              <SelectContent>
                {characters.map((c) => (
                  <SelectItem key={c.cardId} value={c.cardId}>
                    {c.name} ({c.cardId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Consumables */}
        <Card>
          <CardHeader><CardTitle>Consumables</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {build.consumables.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-sm">{item}</span>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeConsumable(i)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add consumable..."
                value={newConsumable}
                onChange={(e) => setNewConsumable(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addConsumable()}
              />
              <Button size="icon" onClick={addConsumable}><Plus className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gear */}
      <Card>
        <CardHeader><CardTitle>Gear</CardTitle></CardHeader>
        <CardContent>
          <GearSlotGrid
            gear={build.gear}
            onClearSingle={clearSingleGear}
            onClearRelic={clearRelic}
            onClearAccessory={clearAccessory}
            onAddRelicSlot={addRelicSlot}
            onAddAccessorySlot={addAccessorySlot}
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
        <CardContent>
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            value={build.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="Build notes..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
