// src/pages/SessionPage.tsx
import { useParams, Link } from 'react-router-dom'
import { useCampaignStore } from '@/stores/campaign'
import { useCharacterStore } from '@/stores/character'
import { PositionBar } from '@/components/campaign/PositionBar'
import { PartyMemberCard } from '@/components/campaign/PartyMemberCard'
import { SessionLog } from '@/components/campaign/SessionLog'
import { LootPanel } from '@/components/campaign/LootPanel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

export default function SessionPage() {
  const { campaignId } = useParams<{ campaignId: string }>()
  const { getCampaign, updatePosition, adjustHealth, addNote, addLoot, equipSingleItem } = useCampaignStore()
  const { characters } = useCharacterStore()

  const campaign = getCampaign(campaignId ?? '')
  if (!campaign) return <div className="p-6 text-muted-foreground">Campaign not found.</div>

  return (
    <div className="container mx-auto py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold truncate">{campaign.name}</h1>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/campaigns/${campaign.id}`}><Settings className="w-4 h-4 mr-1" /> Setup</Link>
        </Button>
      </div>

      {/* Position bar */}
      <PositionBar
        position={campaign.position}
        onChange={(pos) => updatePosition(campaign.id, pos)}
      />

      {/* Party */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {campaign.party.map((member, i) => (
          <PartyMemberCard
            key={i}
            member={member}
            character={characters.find((c) => c.cardId === member.characterCardId)}
            onAdjustHealth={(amount) => adjustHealth(campaign.id, i, amount)}
          />
        ))}
      </div>

      {/* Loot */}
      <Card>
        <CardHeader className="pb-2"><CardTitle>Party Loot</CardTitle></CardHeader>
        <CardContent>
          <LootPanel
            loot={campaign.loot}
            party={campaign.party}
            characters={characters}
            onAddLoot={(item) => addLoot(campaign.id, item)}
            onEquipSingle={(memberIndex, slot, item) =>
              equipSingleItem(campaign.id, memberIndex, slot, item)
            }
          />
        </CardContent>
      </Card>

      {/* Log */}
      <Card>
        <CardHeader className="pb-2"><CardTitle>Session Log</CardTitle></CardHeader>
        <CardContent>
          <SessionLog
            log={campaign.log}
            onAddNote={(text) => addNote(campaign.id, text)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
