export interface Rule {
    ruleId: string
    name: string
}

export interface Tag {
    tagId: string
    name: string
    description: string
    example: string | null,
    version: string,
    rulebookPages: number[],
    relatedRules: string[],
    relatedTags: string[]
}