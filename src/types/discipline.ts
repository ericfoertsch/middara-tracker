export interface AbilityNode {
    id: string
    name: string
    description: string
    discipline: "Assemblage" | "Cruor" | "Martial" | "Sanctus" | "Subterfuge"
    baseCost: number
    unlocked: boolean
    spCost: number
    stock: number
    flavorText: string | null
    level: 1 | 2 | 3 | 4
    relatedCards: string[] | null
    version: string
}

export interface DisciplineTree {
    id: string
    discipline: "Assemblage" | "Cruor" | "Martial" | "Sanctus" | "Subterfuge"
    abilities: AbilityNode[][]
}