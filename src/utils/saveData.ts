// src/utils/saveData.ts
import type { SaveFile } from '@/types/save'
import type { Build } from '@/types/build'
import type { Campaign } from '@/types/campaign'

export function exportSaveFile(builds: Build[], campaigns: Campaign[]): void {
  const save: SaveFile = {
    version: '1',
    exportedAt: new Date().toISOString(),
    builds,
    campaigns,
  }
  const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'middara-save.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function parseSaveFile(json: string): SaveFile | null {
  try {
    const data = JSON.parse(json)
    if (data?.version !== '1') return null
    return data as SaveFile
  } catch {
    return null
  }
}
