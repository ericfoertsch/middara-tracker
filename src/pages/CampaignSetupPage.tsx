// src/pages/CampaignSetupPage.tsx
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCampaignStore } from '@/stores/campaign'
import { useCharacterStore } from '@/stores/character'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Swords } from 'lucide-react'
import type { PartyMember } from '@/types/campaign'
import { emptyBuildGear } from '@/types/gear'

export default function CampaignSetupPage() {
  const { campaignId } = useParams<{ campaignId: string }>()
  const { getCampaign, updateCampaign, addPartyMember, removePartyMember, deleteCampaign, updatePosition } = useCampaignStore()
  const { characters } = useCharacterStore()
  const navigate = useNavigate()

  const campaign = getCampaign(campaignId ?? '')

  if (!campaign) return <div className="p-6 text-muted-foreground">Campaign not found.</div>

  function handleDelete() {
    deleteCampaign(campaign!.id)
    navigate('/campaigns')
  }

  function handleAddMember(cardId: string) {
    const character = characters.find((c) => c.cardId === cardId)
    if (!character) return
    const member: PartyMember = {
      characterCardId: cardId,
      buildId: null,
      gear: emptyBuildGear(),
      unlockedDisciplineNodes: [],
      currentHealth: character.baseStats.health,
      maxHealth: character.baseStats.health,
      status: 'active',
      notes: '',
    }
    addPartyMember(campaign!.id, member)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Input
          className="text-xl font-bold border-none shadow-none px-0 max-w-sm focus-visible:ring-0"
          value={campaign.name}
          onChange={(e) => updateCampaign(campaign.id, { name: e.target.value })}
        />
        <div className="flex gap-2">
          <Button asChild>
            <Link to={`/campaigns/${campaign.id}/session`}>
              <Swords className="w-4 h-4 mr-2" /> Start Session
            </Link>
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Position */}
      <Card>
        <CardHeader><CardTitle>Campaign Position</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Chapter</label>
            <Input
              value={campaign.position.chapter}
              onChange={(e) => updatePosition(campaign.id, { ...campaign.position, chapter: e.target.value })}
              placeholder="Chapter 1"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Page</label>
            <Input
              type="number"
              value={campaign.position.page}
              onChange={(e) => updatePosition(campaign.id, { ...campaign.position, page: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Mission</label>
            <Input
              value={campaign.position.mission}
              onChange={(e) => updatePosition(campaign.id, { ...campaign.position, mission: e.target.value })}
              placeholder="The Opening..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Party */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Party</CardTitle>
            <Select onValueChange={handleAddMember}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Add character..." />
              </SelectTrigger>
              <SelectContent>
                {characters.map((c) => (
                  <SelectItem key={c.cardId} value={c.cardId}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {campaign.party.length === 0 && (
            <p className="text-sm text-muted-foreground">No party members yet.</p>
          )}
          {campaign.party.map((member, i) => {
            const char = characters.find((c) => c.cardId === member.characterCardId)
            return (
              <div key={i} className="flex items-center justify-between border rounded-md px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{char?.name ?? member.characterCardId}</p>
                  <p className="text-xs text-muted-foreground">{member.currentHealth}/{member.maxHealth} HP · {member.status}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => removePartyMember(campaign.id, i)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
