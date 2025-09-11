import { Input } from "@/components/ui/input"
import { useRuleStore } from "@/stores/rule"
import { TagGrid } from "@/components/rule/TagGrid"
import { useEffect } from "react"

export default function TagLookupPage() {
    const { filter, setTagFilter } = useRuleStore()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [filter])

    return (
        <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Tag Lookup</h1>

        <div className="sticky top-0 z-10 bg-background pb-4">
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
