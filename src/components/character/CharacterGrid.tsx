import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCharacterStore } from "@/stores/character_new";
import CharacterCard from "@/components/character/CharacterCard";
import type { Character } from "@/types/character";

export default function CharacterGrid() {
    const {
        loading,
        error,
        filter,
        loadCharacters,
        setFilter,
        filteredCharacters
    } = useCharacterStore()

    useEffect(() => {
        loadCharacters()
    }, [loadCharacters])

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-500">{error}</div>

    return (
        <div className="flex flex-col h-full gap-4">
            <Input
                placeholder="Search characters..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-1/3"
            />
            <div className="flex-1 bg-muted rounded-lg shadow-inner p-4">
                <ScrollArea className="h-full pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCharacters().map((char:Character) => (
                            <CharacterCard character={char} />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}