export interface Character {
    id: number
    name: string
    locked: boolean
    baseStats: CharacterBaseStats
    skillStats: CharacterSkillStats
}

export interface CharacterBaseStats {
    health: number
    defense: number
    movement: number
}

export interface CharacterSkillStats {
    presence: number
    lore: number
    agility: number
    perception: number
    strength: number
}