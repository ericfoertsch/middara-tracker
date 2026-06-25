import type { DisciplineTree } from "@/types/discipline"
import { create } from "zustand"
import rawDisciplines from "@/assets/data/DisciplineTrees.json"

type DisciplineState = {
  exp: number
  disciplineTrees: DisciplineTree[]
  spendExp: (treeId: string, nodeId: string) => void
}

export const useDisciplineStore = create<DisciplineState>((set, get) => ({
  exp: 10,
  disciplineTrees: rawDisciplines as DisciplineTree[],

  spendExp: (treeId, nodeId) => {
    const { exp, disciplineTrees } = get()
    const node = disciplineTrees.flatMap((t) => t.abilities.flat()).find((n) => n.id === nodeId)
    if (!node || node.unlocked || exp < node.baseCost) return

    set({
      exp: exp - node.baseCost,
      disciplineTrees: disciplineTrees.map((tree) => {
        if (tree.id !== treeId) return tree
        return {
          ...tree,
          abilities: tree.abilities.map((level) =>
            level.map((n) => (n.id === nodeId ? { ...n, unlocked: true } : n))
          ),
        }
      }),
    })
  },
}))
