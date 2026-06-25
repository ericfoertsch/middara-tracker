import { useRuleStore } from "@/stores/rule"
import { TagCard } from "@/components/rule/TagCard"

export function TagGrid() {
  const { tags, filteredTags } = useRuleStore()

  if (!tags || tags.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No tags found</div>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 h-full">
      {filteredTags().map((tag) => (
        <TagCard key={tag.tagId} tag={tag} />
      ))}
    </div>
  )
}
