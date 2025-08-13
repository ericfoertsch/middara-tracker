import { create } from "zustand";
import type { Character } from "@/types/character";
import adventurers from "@/assets/data/Adventurers.json";

type CharacterState = {
    characters: Character[]
    loading: boolean
    error: string | null
    filter: string

    setFilter: (filter: string) => void
    loadCharacters: () => Promise<void>
    filteredCharacters: () => Character[]
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
    characters: [],
    loading: false,
    error: null,
    filter: "",

    setFilter: (filter) => set({ filter }),


  loadCharacters: async () => {
    set({ loading: true, error: null })
    try {
      // Simulated async load (can be replaced with fetch)
      const data: Character[] = adventurers
      set({ characters: data })
    } catch (err) {
      set({ error: `Failed to fetch characters: ${err}` })
    } finally {
      set({ loading: false })
    }
  },

  filteredCharacters: () => {
    const { filter, characters } = get()
    return characters.filter((c) =>
      c.name.toLowerCase().includes(filter.toLowerCase())
    )
  },
}))