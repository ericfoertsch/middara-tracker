import type { Rule } from "@/types/rule";
import { create } from "zustand";

type RuleState = {
    rules: Rule[]
    loading: boolean
    error: string | null
    filter: string

    setFilter: (filter: string) => void
    loadRules: () => Promise<void>
    filteredRules: () => Rule[]
}

export const useRuleStore = create<RuleState>((set, get) => ({
    rules: [],
    loading: false,
    error: null,
    filter: "",

    setFilter: (filter) => set({ filter}),

    loadRules: async () => {
        set({ loading: true, error: null })
    },

    filteredRules: () => {
        const { filter, rules } = get()
        return rules.filter((c) =>
            c.name.toLowerCase().includes(filter.toLowerCase())
        )
    }
}))