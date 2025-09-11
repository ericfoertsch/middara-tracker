import { useRuleStore } from "@/stores/rule"
import { TagCard } from "@/components/rule/TagCard"
import { useEffect } from "react"

export function TagGrid() {
  const { tags, loading, loadTags, error } = useRuleStore()

      useEffect(() => {
          loadTags()
      }, [loadTags])

  if (loading) {
    return <div className="text-center py-10">Loading tags…</div>
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>
  }

  if (!tags || tags.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No tags found</div>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      {tags.map((tag) => (
        <TagCard key={tag.tagId} tag={tag} />
      ))}
    </div>
  )
}
