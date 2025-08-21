import { create } from "zustand";
import type { Character } from "@/types/character";
import adventurers from "@/assets/data/AdventurersNew.json";

type CharacterState = {
    characters: Character[]
    selectedCharacter: Character | null
    loading: boolean
    error: string | null
    filter: string

    setFilter: (filter: string) => void
    selectCharacter: (name: string | undefined) => Character | null
    loadCharacters: () => Promise<void>
    filteredCharacters: () => Character[]
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  selectedCharacter: null,
  loading: false,
  error: null,
  filter: "",

  setFilter: (filter) => set({ filter }),

  selectCharacter: (cardId: string | undefined): Character | null => {
    set({ error: null })

    //const characterName = name?.replace(/-/g, " ") ?? "";
    const characters = get().characters;

    const character = characters.find((c) => c.cardId === cardId);

    if (!character) {
      set({ error: "Character not found." });
      return null;
    }

    set({ selectedCharacter: character });
    return character;
  },

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