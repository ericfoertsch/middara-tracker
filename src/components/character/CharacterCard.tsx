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

interface CharacterCardProps {
    value: number
}

export function CharacterCard({ value }: CharacterCardProps) {
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Test</CardTitle>
                <CardDescription>This is a character.</CardDescription>
            </CardHeader>
            <CardContent>
                <Label>{ value }</Label>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Edit</Button>
                <Button>View</Button>
            </CardFooter>
        </Card>
    );
}

export default CharacterCard