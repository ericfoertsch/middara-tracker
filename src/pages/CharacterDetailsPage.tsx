import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Character } from "@/types/character"
import { useCharacterStore } from "@/stores/character";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


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

  if (!character) {
    return <div className="p-6">Character not found</div>
  }

  console.log(character)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="overflow-hidden border-2" style={{ borderColor: character.primaryColor }}>
        <div className="flex gap-6 items-center p-6 bg-muted/30">
          <img
            src={`/images/Adventurer/${character.adventurer}/${character.images.profileImage}`}
            alt={character.name}
            className="w-32 h-32 rounded-xl object-cover border"
            style={{ borderColor: character.secondaryColor }}
          />
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">{character.name}</CardTitle>
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

      <Tabs defaultValue="stats" className="w-full">
        <TabsList>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Base Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
              <StatBox label="Health" value={character.baseStats.health} />
              <StatBox label="Defense" value={character.baseStats.defense} />
              <StatBox label="Movement" value={character.baseStats.movement} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skill Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <StatBox label="Presence" value={character.skillStats.presence} />
              <StatBox label="Lore" value={character.skillStats.lore} />
              <StatBox label="Agility" value={character.skillStats.agility} />
              <StatBox label="Perception" value={character.skillStats.perception} />
              <StatBox label="Strength" value={character.skillStats.strength} />
              <StatBox label="Casting" value={character.casting} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <Card>
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

              <div>
                <span className="font-medium">Conviction:</span>
                <div className="flex gap-2 flex-wrap mt-1">
                  {character.conviction.map((c, i) => (
                    <Badge key={`${c}-${i}`} variant="secondary">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>

              <InfoRow label="Locked" value={character.locked ? "Yes" : "No"} />
              {character.secretDeckCode && (
                <InfoRow label="Secret Deck Code" value={character.secretDeckCode} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-4 bg-muted/20">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}
