// src/pages/CampaignsPage.tsx
import { useNavigate, Link } from 'react-router-dom'
import { useCampaignStore } from '@/stores/campaign'
import { newCampaign } from '@/types/campaign'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Trash2, Eye, Swords } from 'lucide-react'

export default function CampaignsPage() {
  const { campaigns, addCampaign, deleteCampaign } = useCampaignStore()
  const navigate = useNavigate()

  function handleCreate() {
    const campaign = newCampaign()
    addCampaign(campaign)
    navigate(`/campaigns/${campaign.id}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Button onClick={handleCreate}>New Campaign</Button>
      </div>

      {campaigns.length === 0 && (
        <p className="text-muted-foreground">No campaigns yet. Create one to get started.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardContent className="pt-4 space-y-1">
              <CardTitle className="text-base truncate">{campaign.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {campaign.position.chapter || 'No chapter set'} · {campaign.party.length} members
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-3">
              <Button size="icon" variant="outline" asChild>
                <Link to={`/campaigns/${campaign.id}`}><Eye className="w-4 h-4" /></Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link to={`/campaigns/${campaign.id}/session`}><Swords className="w-4 h-4" /></Link>
              </Button>
              <Button size="icon" variant="destructive" onClick={() => deleteCampaign(campaign.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
