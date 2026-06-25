import { create } from "zustand"
import type { Character } from "@/types/character"
import adventurers from "@/assets/data/Adventurers.json"

type CharacterState = {
  characters: Character[]
  selectedCharacter: Character | null
  error: string | null
  filter: string
  setFilter: (filter: string) => void
  selectCharacter: (cardId: string | undefined) => Character | null
  filteredCharacters: () => Character[]
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: adventurers as Character[],
  selectedCharacter: null,
  error: null,
  filter: "",

  setFilter: (filter) => set({ filter }),

  selectCharacter: (cardId) => {
    set({ error: null })
    const character = get().characters.find((c) => c.cardId === cardId) ?? null
    if (!character) set({ error: "Character not found." })
    else set({ selectedCharacter: character })
    return character
  },

  filteredCharacters: () => {
    const { filter, characters } = get()
    return characters.filter((c) =>
      c.name.toLowerCase().includes(filter.toLowerCase())
    )
  },
}))
