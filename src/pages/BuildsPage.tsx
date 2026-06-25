import { useNavigate, Link } from 'react-router-dom'
import { useBuildStore } from '@/stores/build'
import { newBuild } from '@/types/build'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Trash2, Eye } from 'lucide-react'

export default function BuildsPage() {
  const { builds, addBuild, deleteBuild } = useBuildStore()
  const navigate = useNavigate()

  function handleCreate() {
    const build = newBuild()
    addBuild(build)
    navigate(`/builds/${build.id}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Builds</h1>
        <Button onClick={handleCreate}>New Build</Button>
      </div>

      {builds.length === 0 && (
        <p className="text-muted-foreground">No builds yet. Create one to get started.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {builds.map((build) => (
          <Card key={build.id}>
            <CardContent className="pt-4 space-y-1">
              <CardTitle className="text-base truncate">{build.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{build.characterCardId || 'No character'}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-3">
              <Button size="icon" variant="outline" asChild>
                <Link to={`/builds/${build.id}`}><Eye className="w-4 h-4" /></Link>
              </Button>
              <Button size="icon" variant="destructive" onClick={() => deleteBuild(build.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
