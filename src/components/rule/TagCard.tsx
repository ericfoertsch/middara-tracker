import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Tag } from "@/types/rule"

interface TagCardProps {
  tag: Tag
}

export function TagCard({ tag }: TagCardProps) {
  return (
    <Card className="w-full max-w-xl shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{tag.name}</span>
          <Badge variant="secondary" className="text-xs">
            v{tag.version}
          </Badge>
        </CardTitle>
        {tag.description && (
          <CardDescription className="text-sm text-muted-foreground">
            {tag.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {tag.example && (
          <div>
            <h4 className="font-semibold text-sm text-foreground">Example</h4>
            <p className="text-sm">{tag.example}</p>
          </div>
        )}

        {tag.rulebookPages.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-foreground">Rulebook Pages</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {tag.rulebookPages.map((page) => (
                <Badge key={page} variant="outline">
                  p.{page}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {tag.relatedRules.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-foreground">Related Rules</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {tag.relatedRules.map((rule) => (
                <Badge key={rule} variant="default">
                  {rule}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {tag.relatedTags.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-foreground">Related Tags</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {tag.relatedTags.map((related) => (
                <Badge key={related} variant="secondary">
                  {related}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
