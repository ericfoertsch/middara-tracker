import { Input } from "@/components/ui/input";
import { useCharacterStore } from "@/stores/character";

export default function CharacterGridFilter() {
    const {
        filter,
        setFilter,
    } = useCharacterStore()

    return (
        <div className="sticky top-0 z-10 bg-background border-b p-4 flex gap-2 items-center">
                <Input
                    placeholder="Search characters..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-1/3"
                />
            </div>
    )
}