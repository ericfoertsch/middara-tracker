import type { DisciplineTree } from "@/types/discipline";
import { create } from "zustand";
import rawDisciplines from "@/assets/data/DisciplineTrees.json";

type DisciplineState = {
  exp: number
  disciplineTrees: DisciplineTree[]
  loading: boolean
  error: string | null

  loadDisciplineTrees: () => Promise<void>
  spendExp: (treeId: string, nodeId: string) => void
}

export const useDisciplineStore = create<DisciplineState>((set, get) => ({
  exp: 10,
  disciplineTrees: [],
  loading: false,
  error: null,

  loadDisciplineTrees: async () => {
    const disciplines = rawDisciplines as DisciplineTree[];
    set({ loading: true, error: null })
    try {
      const data: DisciplineTree[] = disciplines
      set({ disciplineTrees: data })
    } catch (err) {
      set({ error: `Failed to fetch abilities: ${err}` })
    } finally {
      set({ loading: false })
    }
  },

  spendExp: (treeId, nodeId) => {
    const { exp, disciplineTrees } = get()

    const updatedTrees = disciplineTrees.map((tree) => {
      if (tree.id !== treeId) return tree
      return {
        ...tree,
        abilities: tree.abilities.map((level) =>
          level.map((node) =>
            node.id === nodeId && !node.unlocked && exp >= node.baseCost
              ? { ...node, unlocked: true }
              : node
          )
        ),
      }
    })

    const nodeCost =
      disciplineTrees
        .flatMap((t) => t.abilities.flat())
        .find((n) => n.id === nodeId)?.baseCost ?? 0

    set({
      exp: exp - nodeCost,
      disciplineTrees: updatedTrees,
    })
  },
}))
