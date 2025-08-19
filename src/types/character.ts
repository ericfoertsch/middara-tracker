export interface Character {
    cardId: string
    id: number
    total: number
    name: string
    subtitle: string
    version: string
    set: string
    adventurer: string
    tags: string[]
    sp: number
    conviction: number[]
    casting: number
    locked: boolean
    secretDeckCode: string | null
    baseStats: CharacterBaseStats
    skillStats: CharacterSkillStats
    primaryColor: string
    secondaryColor: string
    images: CharacterImages
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

export interface CharacterImages {
    image: string
    profileImage: string
}