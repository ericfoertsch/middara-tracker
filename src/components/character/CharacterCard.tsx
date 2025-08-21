import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import type { Character } from "@/types/character";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Eye, Lock } from "lucide-react";
import { CharacterTooltip } from "./CharacterTooltip";
import { CategoryBadge } from "../elements/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const primary = character.primaryColor || "#4B5563";
  const secondary = character.secondaryColor || "#9CA3AF";

  return (
    <TooltipProvider>
      <Card className="rounded-2xl overflow-hidden bg-card">
        <div className="relative">
          <img
            src={`/images/Adventurer/${character.adventurer}/${character.images.profileImage}`}
            alt={character.name}
            className="w-full h-44 object-cover"
          />
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between"
            style={{
              backgroundColor: primary,
              borderTop: `3px solid ${secondary}`,
            }}
          >
            <CardTitle className="text-sm font-semibold text-white truncate max-w-[180px] drop-shadow">
              <CharacterTooltip text={character.name}>
                {character.name} {character.cardId}
              </CharacterTooltip>
            </CardTitle>
            {character.locked && (
              <Lock className="w-4 h-4 text-white/80 flex-shrink-0" />
            )}
          </div>
        </div>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2">
            <CategoryBadge
              category="Adventurer"
              subcategory={character.adventurer}
              categoryColor="#12FF45"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end px-3 pb-3 border-t">
          <Button
            asChild
            size="icon"
            variant="outline"
            className="h-9 w-9 rounded-md"
          >
            <Link
              to={`/characters/${character.cardId}`}
              title={`View ${character.cardId}`}
            >
              <Eye className="h-5 w-5" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

export default CharacterCard;
