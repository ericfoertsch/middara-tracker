import { Input } from "@/components/ui/input"
import { useRuleStore } from "@/stores/rule"
import { TagGrid } from "@/components/rule/TagGrid"

export default function TagLookupPage() {
  const { filter, setTagFilter } = useRuleStore()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Tag Lookup</h1>

      <div className="mb-6">
        <Input
          placeholder="Search tags..."
          value={filter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="max-w-md"
        />
      </div>

      <TagGrid />
    </div>
  )
}
