// src/types/save.ts
import type { Build } from './build'
import type { Campaign } from './campaign'

export interface SaveFile {
  version: "1"
  exportedAt: string
  builds: Build[]
  campaigns: Campaign[]
}
