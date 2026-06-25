// src/components/campaign/SessionLog.tsx
import type { LogEntry } from '@/types/campaign'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Send } from 'lucide-react'

interface SessionLogProps {
  log: LogEntry[]
  onAddNote: (text: string) => void
}

export function SessionLog({ log, onAddNote }: SessionLogProps) {
  const [note, setNote] = useState('')

  function handleSubmit() {
    if (!note.trim()) return
    onAddNote(note.trim())
    setNote('')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button size="icon" onClick={handleSubmit}><Send className="w-4 h-4" /></Button>
      </div>

      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
        {[...log].reverse().map((entry) => (
          <div
            key={entry.id}
            className={cn(
              'flex gap-2 text-sm rounded-md px-2 py-1',
              entry.type === 'note'
                ? 'bg-muted/60 font-medium'
                : 'text-muted-foreground'
            )}
          >
            <span className="shrink-0 text-xs mt-0.5 text-muted-foreground/60">
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>{entry.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
