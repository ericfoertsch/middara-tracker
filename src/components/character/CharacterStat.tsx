import type { StatDefinition } from "@/types/stats"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CharacterStatProps {
    stat: StatDefinition
    value: number
}

export function CharacterStat({ stat, value }: CharacterStatProps) {
    const Icon = stat.icon
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{value}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <span className="text-lg font-medium">{stat.name}</span>
                    </div>
                    <hr className="border-t border-muted"/>
                    <div className="text-sm text-muted-foreground">{stat.tooltipText}</div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}