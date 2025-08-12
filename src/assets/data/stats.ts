import { Heart, Shield, Move, Eye, BookOpen, Zap, Search, Dumbbell } from "lucide-react";
import type { StatDefinition } from "@/types/stats";

// Mapping for base stats
export const baseStatMap: Record<string, StatDefinition> = {
  health: { id: "health", name: "Health", tooltipText: "This is the Adventurer's base Maximum HP. Damage tokens are added to the Adventurer's card and if an Adventurer's Damage equals their Maximum HP, they are Defeated.", icon: Heart },
  defense: { id: "defense", name: "Defense", tooltipText: "This is the Adventurer's base Defense Value and determines how difficult the Adventurer is to hit.", icon: Shield },
  movement: { id: "movement", name: "Movement", tooltipText: "This is the Adventurer's base Movement Value and determines how many spaes the Adventurer may move when making a Move Action.", icon: Move },
};

// Mapping for skill stats
export const skillStatMap: Record<string, StatDefinition> = {
  presence: { id: "presence", name: "Presence", tooltipText: "Presence is one of the Skills used to make Skill Check when instructed by Adventure Mechanics or Special Encounter Rules.", icon: Eye },
  lore: { id: "lore", name: "Lore", tooltipText: "Lore is one of the Skills used to make Skill Check when instructed by Adventure Mechanics or Special Encounter Rules.", icon: BookOpen },
  agility: { id: "agility", name: "Agility", tooltipText: "Agility is one of the Skills used to make Skill Check when instructed by Adventure Mechanics or Special Encounter Rules.", icon: Zap },
  perception: { id: "perception", name: "Perception", tooltipText: "Perception is one of the Skills used to make Skill Check when instructed by Adventure Mechanics or Special Encounter Rules.", icon: Search },
  strength: { id: "strength", name: "Strength", tooltipText: "Strength is one of the Skills used to make Skill Check when instructed by Adventure Mechanics or Special Encounter Rules.", icon: Dumbbell },
};
