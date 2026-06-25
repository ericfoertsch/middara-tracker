import type { Tag } from "@/types/rule"
import { create } from "zustand"
import tagsData from "@/assets/data/Tags.json"

type RuleState = {
  tags: Tag[]
  filter: string
  setTagFilter: (filter: string) => void
  filteredTags: () => Tag[]
}

export const useRuleStore = create<RuleState>((set, get) => ({
  tags: tagsData as Tag[],
  filter: "",

  setTagFilter: (filter) => set({ filter }),

  filteredTags: () => {
    const { filter, tags } = get()
    return tags.filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()))
  },
}))
