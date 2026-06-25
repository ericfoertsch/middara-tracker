// src/stores/build.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Build } from '@/types/build'

type BuildState = {
  builds: Build[]
  addBuild: (build: Build) => void
  updateBuild: (id: string, updates: Partial<Omit<Build, 'id' | 'createdAt'>>) => void
  deleteBuild: (id: string) => void
  getBuild: (id: string) => Build | undefined
}

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      builds: [],

      addBuild: (build) =>
        set((state) => ({ builds: [...state.builds, build] })),

      updateBuild: (id, updates) =>
        set((state) => ({
          builds: state.builds.map((b) =>
            b.id === id
              ? { ...b, ...updates, updatedAt: new Date().toISOString() }
              : b
          ),
        })),

      deleteBuild: (id) =>
        set((state) => ({ builds: state.builds.filter((b) => b.id !== id) })),

      getBuild: (id) => get().builds.find((b) => b.id === id),
    }),
    { name: 'middara-builds' }
  )
)
