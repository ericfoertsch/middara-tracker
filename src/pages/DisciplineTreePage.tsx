import { useEffect } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { DisciplineCard } from "@/components/discipline/DisciplineCard"
import { useDisciplineStore } from "@/stores/discipline"

export default function DisciplineTreePage() {
  const { exp, disciplineTrees, spendExp, loadDisciplineTrees } = useDisciplineStore()

  useEffect(() => {
    loadDisciplineTrees()
  }, [loadDisciplineTrees])

  if (!disciplineTrees || disciplineTrees.length === 0) {
    return (
      <div className="container mx-auto py-6 text-center text-muted-foreground">
        No discipline trees available.
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Discipline Trees</h1>

      <div className="mb-6">
        <p className="font-semibold">EXP Pool: {exp}</p>
      </div>

      <Tabs defaultValue={disciplineTrees[0].id} className="w-full">
        <TabsList className="mb-6 flex flex-wrap gap-2">
          {disciplineTrees.map((tree) => (
            <TabsTrigger key={tree.id} value={tree.id}>
              {tree.discipline}
            </TabsTrigger>
          ))}
        </TabsList>

        {disciplineTrees.map((tree) => (
          <TabsContent key={tree.id} value={tree.id}>
            <div className="space-y-8">
              {tree.abilities.map((level, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold mb-4">Level {idx + 1}</h3>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {level.map((node) => (
                      <DisciplineCard
                        key={node.id}
                        node={node}
                        exp={exp}
                        spendExp={spendExp} // store function
                        treeId={tree.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
