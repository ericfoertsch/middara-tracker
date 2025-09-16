import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDisciplineStore } from "@/stores/discipline"
import { useEffect } from "react"

export default function DisciplineTreePage() {
  const { exp, disciplineTrees, spendExp, loadDisciplineTrees } = useDisciplineStore()

    useEffect(() => {
        loadDisciplineTrees()
    }, [loadDisciplineTrees])

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Discipline Trees</h1>

      <div className="mb-6">
        <p className="font-semibold">EXP Pool: {exp}</p>
      </div>

      <Tabs defaultValue={disciplineTrees[0]?.id || ""} className="w-full">
        <TabsList>
          {disciplineTrees.map((tree) => (
            <TabsTrigger key={tree.id} value={tree.id}>
              {tree.discipline}
            </TabsTrigger>
          ))}
        </TabsList>

        {disciplineTrees.map((tree) => (
          <TabsContent key={tree.id} value={tree.id}>
            <div className="grid grid-cols-4 gap-6">
              {tree.abilities.map((level, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-lg font-semibold">Level {idx + 1}</h3>
                  {level.map((node) => (
                    <Card
                      key={node.id}
                      className={`h-full ${
                        node.unlocked ? "border-green-500" : ""
                      }`}
                    >
                      <CardHeader>
                        <CardTitle className="text-base">{node.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {node.description}
                        </p>
                        <p className="text-sm mt-2">Cost: {node.baseCost}</p>
                        <Button
                          className="mt-2"
                          size="sm"
                          disabled={node.unlocked || exp < node.baseCost}
                          onClick={() => spendExp(tree.id, node.id)}
                        >
                          {node.unlocked ? "Unlocked" : "Unlock"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
