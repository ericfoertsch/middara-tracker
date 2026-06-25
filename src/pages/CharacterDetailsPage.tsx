import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Character } from "@/types/character";
import { useCharacterStore } from "@/stores/character";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DiceDisplay } from "@/components/dice/DiceDisplay";
import { ratingToColor } from "@/utils/diceUtils";

export default function CharacterDetailsPage() {
  const { error, characters, selectCharacter } = useCharacterStore();
  const { cardId } = useParams<{ cardId: string }>();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (cardId) {
      const c = selectCharacter(cardId);
      setCharacter(c);
    }
  }, [cardId, selectCharacter]);

  if (!character && characters) {
    return <div>{error}</div>;
  }
  if (!character) {
    return <div className="p-6">Character not found</div>;
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Character Header */}
      <Card className="overflow-hidden border-2" style={{ borderColor: character.primaryColor }}>
        <div className="flex gap-6 items-center p-6 bg-muted/30">
          <img
            src={`/images/Adventurer/${character.adventurer}/${character.images.profileImage}`}
            alt={character.name}
            className="w-32 h-32 rounded-xl object-cover border"
            style={{ borderColor: character.secondaryColor }}
          />
          <div className="space-y-2 min-w-0">
            <CardTitle className="text-2xl font-bold truncate">{character.name}</CardTitle>
            <p className="text-muted-foreground">{character.subtitle}</p>
            <div className="flex gap-2 flex-wrap">
              {character.tags.map((tag, i) => (
                <Badge key={`${tag}-${i}`} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Responsive Grid for all stats */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Base Stats */}
                <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Base Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-2 text-center">
            <StatBox label="Health" value={character.baseStats.health} />
            <StatBox label="Defense" value={character.baseStats.defense} />
            <StatBox label="Movement" value={character.baseStats.movement} />
            <StatBox label="SP" value={character.sp} />
          </CardContent>
        </Card>
        
        {/* Dice Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Dice</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 items-center justify-evenly">
            <div className="text-center flex flex-col items-center min-w-0">
              <p className="text-sm font-medium mb-2">Conviction</p>
              <DiceDisplay
                mode="conviction"
                dice={character.conviction.map(ratingToColor)}
              />
            </div>
            <div className="text-center flex flex-col items-center min-w-0">
              <p className="text-sm font-medium mb-2">Casting</p>
              {character.casting ? (
                <DiceDisplay mode="casting" dice={[ratingToColor(character.casting)]} />
              ) : (
                <p className="text-xs text-muted-foreground">None</p>
              )}
            </div>
          </CardContent>
        </Card>


        {/* Skill Stats */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Skill Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
            <StatBox label="Presence" value={character.skillStats.presence} />
            <StatBox label="Lore" value={character.skillStats.lore} />
            <StatBox label="Agility" value={character.skillStats.agility} />
            <StatBox label="Perception" value={character.skillStats.perception} />
            <StatBox label="Strength" value={character.skillStats.strength} />
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label="ID" value={character.id} />
            <InfoRow label="Card ID" value={character.cardId} />
            <InfoRow label="Set" value={character.set} />
            <InfoRow label="Version" value={character.version} />
            <InfoRow label="Adventurer" value={character.adventurer} />
            <InfoRow label="SP" value={character.sp} />
            <InfoRow label="Locked" value={character.locked ? "Yes" : "No"} />
            {character.secretDeckCode && (
              <InfoRow label="Secret Deck Code" value={character.secretDeckCode} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-3 bg-muted/20 flex flex-col items-center justify-center min-w-0">
      <p className="text-base font-bold">{value}</p>
      <p className="text-xs text-muted-foreground break-words">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}
