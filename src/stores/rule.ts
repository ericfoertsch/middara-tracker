import type { Tag } from "@/types/rule";
import { create } from "zustand";
import tags from "@/assets/data/Tags.json";

type RuleState = {
    tags: Tag[]
    loading: boolean
    error: string | null
    filter: string

    setTagFilter: (filter: string) => void
    loadTags: () => Promise<void>
    filteredTags: () => Tag[]
}

export const useRuleStore = create<RuleState>((set, get) => ({
    tags: [],
    loading: false,
    error: null,
    filter: "",

    setTagFilter: (filter) => set({ filter}),

    loadTags: async () => {
        set({ loading: true, error: null })
        try {
        // Simulated async load (can be replaced with fetch)
        const data: Tag[] = tags
        set({ tags: data })
        } catch (err) {
        set({ error: `Failed to fetch tags: ${err}` })
        } finally {
        set({ loading: false })
        }
    },

    filteredTags: () => {
        const { filter, tags } = get()
        return tags.filter((c) =>
            c.name.toLowerCase().includes(filter.toLowerCase())
        )
    }
}))