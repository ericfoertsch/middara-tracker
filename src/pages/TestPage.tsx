import CharacterCard from "@/components/character/CharacterCard";
import { useCharacterStore } from '../stores/character';

const TestPage = () => {
    const { characters, loading, error } = useCharacterStore();

    if (loading) {
        return <div className="p-4 text-lg">Loading characters...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Characters</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {characters.map((character) => (
                    <CharacterCard key={character.id} character={character} />
                ))}
            </div>
        </div>
  );
}

export default TestPage