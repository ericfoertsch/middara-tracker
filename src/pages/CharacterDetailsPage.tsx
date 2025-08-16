import { useParams } from "react-router-dom";
import type { Character } from "@/types/character";

interface CharacterDetailsPageProps {
  characters?: Character[];
}

export default function CharacterDetailsPage({ characters }: CharacterDetailsPageProps) {
  const { name } = useParams<{ name: string }>();

  const characterName = name?.replace(/-/g, " ") ?? "";

  const character = characters?.find(c => c.name === characterName);

  if (!character && characters) return <div>Character not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{characterName}</h1>
      {character && <div>{}</div>}
    </div>
  );
}
