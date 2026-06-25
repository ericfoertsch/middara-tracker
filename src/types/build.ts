// src/types/build.ts
import type { BuildGear } from './gear'

export interface Build {
  id: string
  name: string
  characterCardId: string
  gear: BuildGear
  unlockedDisciplineNodes: string[]
  consumables: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

export function newBuild(overrides?: Partial<Build>): Build {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: 'New Build',
    characterCardId: '',
    gear: {
      hand1: null, hand2: null, armor: null, core: null,
      relics: [null, null, null], accessories: [null],
    },
    unlockedDisciplineNodes: [],
    consumables: [],
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
