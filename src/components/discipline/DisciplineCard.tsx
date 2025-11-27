import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2 } from "lucide-react"
import type { AbilityNode } from "@/types/discipline"
import { renderWithReplacements } from "@/utils/renderWithReplacements"

interface DisciplineCardProps {
  node: AbilityNode
  exp: number
  spendExp: (treeId: string, nodeId: string) => void
  treeId: string
}

export function DisciplineCard({ node, exp, spendExp, treeId }: DisciplineCardProps) {
  const lockedDueToExp = !node.unlocked && exp < node.baseCost

  return (
    <Card
      className={`relative flex flex-col justify-between h-56 transition overflow-hidden
        ${node.unlocked
          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
          : lockedDueToExp
          ? "opacity-60"
          : "hover:shadow-md"
        }`}
    >
      {/* Checkmark badge for unlocked abilities */}
      {node.unlocked && (
        <div className="absolute top-2 right-2 text-green-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      )}

      {/* Header */}
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-bold leading-tight truncate">
          {node.name}
        </CardTitle>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs font-semibold mt-1">
          <span>EXP {node.baseCost}</span>
          <span>SP {node.spCost}</span>
          <span>Stock {node.stock}</span>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 flex flex-col min-h-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="text-xs text-muted-foreground cursor-help overflow-hidden line-clamp-3 hover:overflow-y-auto hover:line-clamp-none"
                style={{ maxHeight: "4.5rem" }}
              >
                {renderWithReplacements(node.description)}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-pre-line">
              {renderWithReplacements(node.description)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Footer section pinned to bottom */}
        <div className="mt-auto pt-2">
          {node.flavorText && (
            <div className="italic text-xs text-muted-foreground mt-1 line-clamp-2">
              “{node.flavorText}”
            </div>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    className="mt-2 w-full"
                    size="sm"
                    disabled={node.unlocked || lockedDueToExp}
                    onClick={() => spendExp(treeId, node.id)}
                  >
                    {node.unlocked
                      ? "Unlocked"
                      : lockedDueToExp
                      ? "Not enough EXP"
                      : "Unlock"}
                  </Button>
                </span>
              </TooltipTrigger>
              {lockedDueToExp && (
                <TooltipContent>
                  Requires {node.baseCost} EXP (you have {exp})
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
