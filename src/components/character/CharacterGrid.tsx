import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCharacterStore } from "@/stores/character";
import CharacterCard from "@/components/character/CharacterCard";
import CharacterGridFilter from "@/components/character/CharacterGridFilter";
import type { Character } from "@/types/character";

export default function CharacterGrid() {
    const {
        loading,
        error,
        loadCharacters,
        filteredCharacters
    } = useCharacterStore()

    useEffect(() => {
        loadCharacters()
    }, [loadCharacters])

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-500">{error}</div>

    return (
        <div className="flex flex-col h-screen">
            <CharacterGridFilter />
            <ScrollArea className="flex-1 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {filteredCharacters().map((char:Character) => (
                        <CharacterCard key={char.cardId} character={char} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}