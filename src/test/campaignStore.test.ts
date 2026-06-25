// src/test/campaignStore.test.ts
import { useCampaignStore } from '@/stores/campaign'
import type { Campaign } from '@/types/campaign'
import type { GearItem } from '@/types/gear'

const mockCampaign: Campaign = {
  id: 'camp-1',
  name: 'Test Campaign',
  position: { chapter: 'Chapter 1', page: 1, mission: 'Opening' },
  party: [
    {
      characterCardId: '3-25-1.0-BS23',
      buildId: null,
      gear: { hand1: null, hand2: null, armor: null, core: null, relics: [null, null, null], accessories: [null] },
      unlockedDisciplineNodes: [],
      currentHealth: 14,
      maxHealth: 14,
      status: 'active',
      notes: '',
    }
  ],
  loot: [],
  log: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const mockItem: GearItem = { id: 'sword-1', name: 'Iron Sword', category: 'weapon' }

beforeEach(() => {
  useCampaignStore.setState({ campaigns: [] })
})

test('addCampaign adds a campaign', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  expect(useCampaignStore.getState().campaigns).toHaveLength(1)
})

test('deleteCampaign removes a campaign', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().deleteCampaign('camp-1')
  expect(useCampaignStore.getState().campaigns).toHaveLength(0)
})

test('adjustHealth decreases currentHealth and creates auto log', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().adjustHealth('camp-1', 0, -3)
  const camp = useCampaignStore.getState().campaigns[0]
  expect(camp.party[0].currentHealth).toBe(11)
  expect(camp.log).toHaveLength(1)
  expect(camp.log[0].type).toBe('auto')
  expect(camp.log[0].text).toContain('3')
})

test('adjustHealth does not go below 0', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().adjustHealth('camp-1', 0, -999)
  expect(useCampaignStore.getState().campaigns[0].party[0].currentHealth).toBe(0)
})

test('addLoot adds item to loot pool and creates auto log', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().addLoot('camp-1', mockItem)
  const camp = useCampaignStore.getState().campaigns[0]
  expect(camp.loot).toHaveLength(1)
  expect(camp.loot[0].name).toBe('Iron Sword')
  expect(camp.log[0].type).toBe('auto')
  expect(camp.log[0].text).toContain('Iron Sword')
})

test('addNote creates note log entry', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().addNote('camp-1', 'Party rested here')
  const camp = useCampaignStore.getState().campaigns[0]
  expect(camp.log[0].type).toBe('note')
  expect(camp.log[0].text).toBe('Party rested here')
})

test('updatePosition creates auto log', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().updatePosition('camp-1', { chapter: 'Chapter 2', page: 15, mission: 'The Depths' })
  const camp = useCampaignStore.getState().campaigns[0]
  expect(camp.position.page).toBe(15)
  expect(camp.log[0].type).toBe('auto')
})
