import { useParams } from "react-router-dom";
import { useCharacterStore } from "@/stores/character";
import { useEffect, useState } from "react";
import type { Character } from "@/types/character";

export default function CharacterDetailsPage() {
    const {
        error,
        characters,
        selectCharacter
    } = useCharacterStore();

  const { name } = useParams<{ name: string }>();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (name) {
      const c = selectCharacter(name);
      setCharacter(c);
    }
  }, [name, selectCharacter]);

  if (!character && characters) {
    return <div>{error}</div>;
  }

  const primary = character?.primaryColor || "#4B5563";
  const secondary = character?.secondaryColor || "#9CA3AF";

  return (
    <div 
        className="p-4"
        style={{ 
            background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        }}>
      <h1 className="text-2xl font-bold border-4">{character?.name}</h1>
      {character && 
        <div className="border-4">{
            <span>LOL</span>
        }</div>}
    </div>
  );
}
