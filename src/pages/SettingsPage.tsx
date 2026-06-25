import { useRef } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useRootStore } from '@/stores/root'
import { useBuildStore } from '@/stores/build'
import { useCampaignStore } from '@/stores/campaign'
import { exportSaveFile, parseSaveFile } from '@/utils/saveData'
import { toast } from 'sonner'

export default function SettingPage() {
  const { theme, toggleTheme } = useRootStore()
  const { builds, addBuild } = useBuildStore()
  const { campaigns, addCampaign } = useCampaignStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    exportSaveFile(builds, campaigns)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const json = ev.target?.result as string
      const save = parseSaveFile(json)
      if (!save) {
        toast.error('Invalid save file.')
        return
      }
      save.builds.forEach(addBuild)
      save.campaigns.forEach(addCampaign)
      toast.success(`Imported ${save.builds.length} builds and ${save.campaigns.length} campaigns.`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="p-4 space-y-6 max-w-sm">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">Dark Mode</span>
        <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold">Save Data</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            Import JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>
    </div>
  )
}
