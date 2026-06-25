// src/test/saveData.test.ts
import { parseSaveFile } from '@/utils/saveData'

test('returns null for invalid JSON', () => {
  expect(parseSaveFile('not json')).toBeNull()
})

test('returns null for wrong version', () => {
  expect(parseSaveFile(JSON.stringify({ version: '2', builds: [], campaigns: [] }))).toBeNull()
})

test('parses valid save file', () => {
  const input = JSON.stringify({ version: '1', exportedAt: '2026-01-01', builds: [], campaigns: [] })
  const result = parseSaveFile(input)
  expect(result).not.toBeNull()
  expect(result?.version).toBe('1')
  expect(result?.builds).toHaveLength(0)
})

test('parses save file with build data', () => {
  const build = { id: 'b1', name: 'Build 1', characterCardId: 'c1' }
  const input = JSON.stringify({ version: '1', exportedAt: '2026-01-01', builds: [build], campaigns: [] })
  const result = parseSaveFile(input)
  expect(result?.builds[0].name).toBe('Build 1')
})
