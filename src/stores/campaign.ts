// src/stores/campaign.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Campaign, CampaignPosition, LogEntry, PartyMember } from '@/types/campaign'
import type { GearItem } from '@/types/gear'

function autoLog(text: string): LogEntry {
  return { id: crypto.randomUUID(), timestamp: new Date().toISOString(), text, type: 'auto' }
}

function noteLog(text: string): LogEntry {
  return { id: crypto.randomUUID(), timestamp: new Date().toISOString(), text, type: 'note' }
}

function updateCampaign(
  campaigns: Campaign[],
  id: string,
  updater: (c: Campaign) => Campaign
): Campaign[] {
  return campaigns.map((c) => (c.id === id ? updater(c) : c))
}

type CampaignState = {
  campaigns: Campaign[]
  addCampaign: (campaign: Campaign) => void
  updateCampaign: (id: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => void
  deleteCampaign: (id: string) => void
  getCampaign: (id: string) => Campaign | undefined
  updatePosition: (campaignId: string, position: CampaignPosition) => void
  adjustHealth: (campaignId: string, memberIndex: number, amount: number) => void
  addLoot: (campaignId: string, item: GearItem) => void
  equipSingleItem: (campaignId: string, memberIndex: number, slot: 'hand1' | 'hand2' | 'armor' | 'core', item: GearItem | null) => void
  equipRelicItem: (campaignId: string, memberIndex: number, relicIndex: number, item: GearItem | null) => void
  equipAccessoryItem: (campaignId: string, memberIndex: number, accessoryIndex: number, item: GearItem | null) => void
  addPartyMember: (campaignId: string, member: PartyMember) => void
  removePartyMember: (campaignId: string, memberIndex: number) => void
  addNote: (campaignId: string, text: string) => void
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [],

      addCampaign: (campaign) =>
        set((state) => ({ campaigns: [...state.campaigns, campaign] })),

      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, id, (c) => ({
            ...c,
            ...updates,
            updatedAt: new Date().toISOString(),
          })),
        })),

      deleteCampaign: (id) =>
        set((state) => ({ campaigns: state.campaigns.filter((c) => c.id !== id) })),

      getCampaign: (id) => get().campaigns.find((c) => c.id === id),

      updatePosition: (campaignId, position) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => ({
            ...c,
            position,
            log: [...c.log, autoLog(`Position: ${position.chapter}, page ${position.page}, mission: ${position.mission}`)],
            updatedAt: new Date().toISOString(),
          })),
        })),

      adjustHealth: (campaignId, memberIndex, amount) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => {
            const member = c.party[memberIndex]
            if (!member) return c
            const newHealth = Math.max(0, Math.min(member.maxHealth, member.currentHealth + amount))
            const verb = amount < 0 ? `took ${Math.abs(amount)} damage` : `healed ${amount}`
            const entry = autoLog(`${member.characterCardId} ${verb} (${newHealth}/${member.maxHealth} HP)`)
            return {
              ...c,
              party: c.party.map((m, i) => (i === memberIndex ? { ...m, currentHealth: newHealth } : m)),
              log: [...c.log, entry],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      addLoot: (campaignId, item) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => ({
            ...c,
            loot: [...c.loot, item],
            log: [...c.log, autoLog(`Loot found: ${item.name}`)],
            updatedAt: new Date().toISOString(),
          })),
        })),

      equipSingleItem: (campaignId, memberIndex, slot, item) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => {
            const member = c.party[memberIndex]
            if (!member) return c
            const entry = autoLog(`${member.characterCardId} equipped ${item?.name ?? 'nothing'} in ${slot}`)
            return {
              ...c,
              party: c.party.map((m, i) =>
                i === memberIndex ? { ...m, gear: { ...m.gear, [slot]: item } } : m
              ),
              log: [...c.log, entry],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      equipRelicItem: (campaignId, memberIndex, relicIndex, item) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => {
            const member = c.party[memberIndex]
            if (!member) return c
            const newRelics = [...member.gear.relics]
            newRelics[relicIndex] = item
            const entry = autoLog(`${member.characterCardId} equipped ${item?.name ?? 'nothing'} in relic slot ${relicIndex + 1}`)
            return {
              ...c,
              party: c.party.map((m, i) =>
                i === memberIndex ? { ...m, gear: { ...m.gear, relics: newRelics } } : m
              ),
              log: [...c.log, entry],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      equipAccessoryItem: (campaignId, memberIndex, accessoryIndex, item) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => {
            const member = c.party[memberIndex]
            if (!member) return c
            const newAccessories = [...member.gear.accessories]
            newAccessories[accessoryIndex] = item
            const entry = autoLog(`${member.characterCardId} equipped ${item?.name ?? 'nothing'} in accessory slot ${accessoryIndex + 1}`)
            return {
              ...c,
              party: c.party.map((m, i) =>
                i === memberIndex ? { ...m, gear: { ...m.gear, accessories: newAccessories } } : m
              ),
              log: [...c.log, entry],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      addPartyMember: (campaignId, member) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => ({
            ...c,
            party: [...c.party, member],
            log: [...c.log, autoLog(`${member.characterCardId} joined the party`)],
            updatedAt: new Date().toISOString(),
          })),
        })),

      removePartyMember: (campaignId, memberIndex) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => {
            const member = c.party[memberIndex]
            return {
              ...c,
              party: c.party.filter((_, i) => i !== memberIndex),
              log: member ? [...c.log, autoLog(`${member.characterCardId} left the party`)] : c.log,
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      addNote: (campaignId, text) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => ({
            ...c,
            log: [...c.log, noteLog(text)],
            updatedAt: new Date().toISOString(),
          })),
        })),
    }),
    { name: 'middara-campaigns' }
  )
)
