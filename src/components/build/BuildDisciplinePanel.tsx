// src/components/build/BuildDisciplinePanel.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDisciplineStore } from '@/stores/discipline'
import type { AbilityNode } from '@/types/discipline'
import { cn } from '@/lib/utils'

interface BuildDisciplinePanelProps {
  unlockedNodes: string[]
  onToggleNode: (nodeId: string) => void
}

export function BuildDisciplinePanel({ unlockedNodes, onToggleNode }: BuildDisciplinePanelProps) {
  const { disciplineTrees } = useDisciplineStore()

  if (disciplineTrees.length === 0) return null

  return (
    <Tabs defaultValue={disciplineTrees[0].id} className="w-full">
      <TabsList className="flex flex-wrap gap-2 mb-4">
        {disciplineTrees.map((tree) => (
          <TabsTrigger key={tree.id} value={tree.id}>
            {tree.discipline}
          </TabsTrigger>
        ))}
      </TabsList>

      {disciplineTrees.map((tree) => (
        <TabsContent key={tree.id} value={tree.id}>
          <div className="space-y-6">
            {tree.abilities.map((level, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Level {idx + 1}
                </h3>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {level.map((node) => (
                    <BuildDisciplineNode
                      key={node.id}
                      node={node}
                      isUnlocked={unlockedNodes.includes(node.id)}
                      onToggle={() => onToggleNode(node.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

interface BuildDisciplineNodeProps {
  node: AbilityNode
  isUnlocked: boolean
  onToggle: () => void
}

function BuildDisciplineNode({ node, isUnlocked, onToggle }: BuildDisciplineNodeProps) {
  return (
    <Card className={cn('transition-colors', isUnlocked && 'border-primary bg-primary/5')}>
      <CardHeader className="pb-1 pt-3 px-3">
        <div className="flex items-start justify-between gap-1">
          <CardTitle className="text-sm leading-tight">{node.name}</CardTitle>
          <Badge variant="outline" className="text-xs shrink-0">{node.baseCost} EXP</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-2">
        <p className="text-xs text-muted-foreground line-clamp-3">{node.description}</p>
        <Button
          size="sm"
          variant={isUnlocked ? 'default' : 'outline'}
          className="w-full"
          onClick={onToggle}
        >
          {isUnlocked ? 'Unlocked' : 'Unlock'}
        </Button>
      </CardContent>
    </Card>
  )
}
