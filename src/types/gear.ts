// src/types/gear.ts
export type GearCategory = 'weapon' | 'armor' | 'core' | 'relic' | 'accessory' | 'consumable'

export interface GearItem {
  id: string
  name: string
  category: GearCategory
}

export interface BuildGear {
  hand1: GearItem | null
  hand2: GearItem | null
  armor: GearItem | null
  core: GearItem | null
  relics: (GearItem | null)[]
  accessories: (GearItem | null)[]
}

export function emptyBuildGear(): BuildGear {
  return {
    hand1: null,
    hand2: null,
    armor: null,
    core: null,
    relics: [null, null, null],
    accessories: [null],
  }
}
