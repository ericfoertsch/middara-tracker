// src/test/buildStore.test.ts
import { useBuildStore } from '@/stores/build'
import type { Build } from '@/types/build'

const mockBuild: Build = {
  id: 'test-id',
  name: 'Test Build',
  characterCardId: 'AB-001',
  gear: { hand1: null, hand2: null, armor: null, core: null, relics: [null, null, null], accessories: [null] },
  unlockedDisciplineNodes: [],
  consumables: [],
  notes: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  useBuildStore.setState({ builds: [] })
})

test('starts empty', () => {
  expect(useBuildStore.getState().builds).toHaveLength(0)
})

test('addBuild adds a build', () => {
  useBuildStore.getState().addBuild(mockBuild)
  expect(useBuildStore.getState().builds).toHaveLength(1)
  expect(useBuildStore.getState().builds[0].name).toBe('Test Build')
})

test('deleteBuild removes a build', () => {
  useBuildStore.getState().addBuild(mockBuild)
  useBuildStore.getState().deleteBuild('test-id')
  expect(useBuildStore.getState().builds).toHaveLength(0)
})

test('updateBuild changes build fields', () => {
  useBuildStore.getState().addBuild(mockBuild)
  useBuildStore.getState().updateBuild('test-id', { name: 'Renamed' })
  expect(useBuildStore.getState().builds[0].name).toBe('Renamed')
})

test('getBuild returns build by id', () => {
  useBuildStore.getState().addBuild(mockBuild)
  expect(useBuildStore.getState().getBuild('test-id')?.name).toBe('Test Build')
})

test('getBuild returns undefined for unknown id', () => {
  expect(useBuildStore.getState().getBuild('missing')).toBeUndefined()
})
