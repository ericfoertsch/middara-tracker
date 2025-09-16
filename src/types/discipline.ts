export interface AbilityNode {
    id: string
    name: string
    description: string
    discipline: "Assemblage" | "Cruor" | "Martial" | "Sanctus" | "Subterfuge"
    baseCost: number
    unlocked: boolean
    level: 1 | 2 | 3 | 4
}

export interface DisciplineTree {
    id: string
    discipline: "Assemblage" | "Cruor" | "Martial" | "Sanctus" | "Subterfuge"
    abilities: AbilityNode[][]
}