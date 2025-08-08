import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Character } from "@/types/character";

interface CharacterCardProps {
    character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{ character.name }</CardTitle>
                <CardDescription>This is a character.</CardDescription>
            </CardHeader>
            <CardContent>
                <Label>{ character.id }</Label>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Button 1</Button>
                <Button>Button 2</Button>
            </CardFooter>
        </Card>
    );
}

export default CharacterCard