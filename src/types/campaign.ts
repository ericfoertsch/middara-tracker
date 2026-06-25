// src/types/campaign.ts
import type { BuildGear } from './gear'
import type { GearItem } from './gear'

export interface CampaignPosition {
  chapter: string
  page: number
  mission: string
}

export interface LogEntry {
  id: string
  timestamp: string
  text: string
  type: 'auto' | 'note'
}

export interface PartyMember {
  characterCardId: string
  buildId: string | null
  gear: BuildGear
  unlockedDisciplineNodes: string[]
  currentHealth: number
  maxHealth: number
  status: 'active' | 'injured' | 'missing'
  notes: string
}

export interface Campaign {
  id: string
  name: string
  position: CampaignPosition
  party: PartyMember[]
  loot: GearItem[]
  log: LogEntry[]
  createdAt: string
  updatedAt: string
}

export function newCampaign(overrides?: Partial<Campaign>): Campaign {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: 'New Campaign',
    position: { chapter: '', page: 1, mission: '' },
    party: [],
    loot: [],
    log: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
