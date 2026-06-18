# MiddaraTracker Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize MiddaraTracker with foundation cleanup, JSON persistence, a build system, a live campaign tracker, and a dice/stat sandbox.

**Architecture:** Static game data (adventurers, disciplines, tags) stays as read-only JSON imports; user data (builds, campaigns) lives in Zustand stores with `persist` middleware backed by localStorage, exportable as `middara-save.json`. New features are added as independent pages behind new routes, reusing existing shadcn/ui components.

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, Tailwind CSS v4, shadcn/ui (Radix UI), Zustand 5, React Router v7, Vitest, React Testing Library

## Global Constraints

- All entity IDs are `string`; new entities use `crypto.randomUUID()`
- Game data files in `src/assets/data/` are read-only — never written to
- Zustand persist keys: `middara-builds`, `middara-campaigns`
- Save file version string is `"1"`
- `DiceColor` values: `"black" | "purple" | "white" | "orange" | "teal" | "red" | "green" | "grey" | "blue"`
- Conviction ratings map: `{ black:0, purple:1, white:2, orange:3, teal:4, red:5, green:6, grey:7, blue:8 }`
- Path alias `@/` maps to `src/`

---

## Phase 1: Foundation Cleanup

### Task 1: Test infrastructure + rename CharactersPage + home route

**Files:**
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`
- Modify: `package.json`
- Create: `src/test/setup.ts`
- Rename: `src/pages/TestPage.tsx` → `src/pages/CharactersPage.tsx`
- Create: `src/pages/HomePage.tsx`
- Modify: `src/routes/routes.tsx`
- Modify: `src/components/layout/MainLayout.tsx`

**Interfaces:**
- Produces: `HomePage` default export, `CharactersPage` default export, updated routes with `/` and `/characters`

- [ ] **Step 1: Install test dependencies**

```bash
cd middara-tracker
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Expected: packages added to `devDependencies` with no errors.

- [ ] **Step 2: Add Vitest config to `vite.config.ts`**

Replace the entire file with:

```typescript
/// <reference types="vitest" />
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    alias: {
      "@/": path.resolve(__dirname, "./src/"),
    },
  },
})
```

- [ ] **Step 3: Create test setup file**

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add vitest types to `tsconfig.app.json`**

In `compilerOptions`, add `"types": ["vitest/globals"]`. The full `compilerOptions` object should include it alongside existing settings.

- [ ] **Step 5: Add test scripts to `package.json`**

Add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 6: Write failing test for HomePage**

```typescript
// src/test/HomePage.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'

test('renders MiddaraTracker heading', () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>)
  expect(screen.getByRole('heading', { name: /middara tracker/i })).toBeInTheDocument()
})
```

- [ ] **Step 7: Run test to verify it fails**

```bash
npm run test:run -- src/test/HomePage.test.tsx
```

Expected: FAIL — `Cannot find module '@/pages/HomePage'`

- [ ] **Step 8: Create `HomePage`**

```tsx
// src/pages/HomePage.tsx
export default function HomePage() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold">Middara Tracker</h1>
      <p className="text-muted-foreground">
        Track your builds, campaigns, and sessions.
      </p>
    </div>
  )
}
```

- [ ] **Step 9: Create `CharactersPage` (renamed from TestPage)**

```tsx
// src/pages/CharactersPage.tsx
import CharacterGrid from "@/components/character/CharacterGrid"

export default function CharactersPage() {
  return (
    <div>
      <CharacterGrid />
    </div>
  )
}
```

- [ ] **Step 10: Delete `src/pages/TestPage.tsx`**

```bash
rm src/pages/TestPage.tsx
```

- [ ] **Step 11: Update routes**

```typescript
// src/routes/routes.tsx
import type { RouteObject } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import CharactersPage from '@/pages/CharactersPage'
import SettingPage from '@/pages/SettingsPage'
import CharacterDetailsPage from '@/pages/CharacterDetailsPage'
import TagLookupPage from '@/pages/TagLookupPage'
import DisciplineTreePage from '@/pages/DisciplineTreePage'

export const routes: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  { path: "/characters", element: <CharactersPage /> },
  { path: "/characters/:cardId", element: <CharacterDetailsPage /> },
  { path: "/tags", element: <TagLookupPage /> },
  { path: "/settings", element: <SettingPage /> },
  { path: "/disciplines", element: <DisciplineTreePage /> },
]
```

- [ ] **Step 12: Update MainLayout sidebar — fix dead link, remove unused prop**

```tsx
// src/components/layout/MainLayout.tsx
import { Separator } from "@/components/ui/separator"
import { SidebarLink } from "@/components/general/SidebarLink"
import type { ReactNode } from "react"
import { BreadcrumbNav } from "../general/BreadcrumbNav"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center bg-header text-header-foreground border-b px-4 h-14">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-primary rounded" />
          <Separator orientation="vertical" className="h-6" />
          <BreadcrumbNav />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 bg-muted/40 border-r p-4 space-y-2">
          <nav className="flex flex-col space-y-1">
            <SidebarLink href="/">Home</SidebarLink>
            <SidebarLink href="/characters">Characters</SidebarLink>
            <SidebarLink href="/disciplines">Disciplines</SidebarLink>
            <SidebarLink href="/tags">Tags</SidebarLink>
            <SidebarLink href="/settings">Settings</SidebarLink>
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 13: Fix App.tsx — remove unused breadcrumb prop**

```tsx
// src/App.tsx
import { useRoutes } from "react-router-dom"
import { routes } from "./routes/routes"
import { MainLayout } from "@/components/layout/MainLayout"
import ThemeProvider from "./components/layout/ThemeProvider"

function App() {
  const element = useRoutes(routes)

  return (
    <ThemeProvider>
      <MainLayout>
        {element}
      </MainLayout>
    </ThemeProvider>
  )
}

export default App
```

- [ ] **Step 14: Run tests to verify pass**

```bash
npm run test:run
```

Expected: PASS

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "feat: add test infra, rename CharactersPage, add home route"
```

---

### Task 2: Fix BreadcrumbNav + upgrade SidebarLink to NavLink

**Files:**
- Modify: `src/components/general/BreadcrumbNav.tsx`
- Modify: `src/components/general/SidebarLink.tsx`
- Create: `src/test/BreadcrumbNav.test.tsx`

**Interfaces:**
- Produces: `BreadcrumbNav` showing "Home" at root, readable labels for known segments; `SidebarLink` with active-state highlight

- [ ] **Step 1: Write failing BreadcrumbNav tests**

```typescript
// src/test/BreadcrumbNav.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BreadcrumbNav } from '@/components/general/BreadcrumbNav'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <BreadcrumbNav />
    </MemoryRouter>
  )
}

test('shows Home at root path', () => {
  renderAt('/')
  expect(screen.getByText('Home')).toBeInTheDocument()
})

test('shows Home and Characters at /characters', () => {
  renderAt('/characters')
  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(screen.getByText('Characters')).toBeInTheDocument()
})

test('shows Builds label at /builds', () => {
  renderAt('/builds')
  expect(screen.getByText('Builds')).toBeInTheDocument()
})

test('shows Campaigns label at /campaigns', () => {
  renderAt('/campaigns')
  expect(screen.getByText('Campaigns')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/test/BreadcrumbNav.test.tsx
```

Expected: FAIL — "Home" not found at root.

- [ ] **Step 3: Rewrite BreadcrumbNav**

```tsx
// src/components/general/BreadcrumbNav.tsx
import { Link, useLocation } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

const SEGMENT_LABELS: Record<string, string> = {
  characters: "Characters",
  builds: "Builds",
  campaigns: "Campaigns",
  disciplines: "Disciplines",
  tags: "Tags",
  settings: "Settings",
  test: "Build Tester",
  session: "Session",
}

function buildSegments(pathname: string) {
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean)
  const home = { label: "Home", path: "/" }
  if (parts.length === 0) return [home]

  const rest = parts.map((part, idx) => ({
    label: SEGMENT_LABELS[part] ?? part.charAt(0).toUpperCase() + part.slice(1),
    path: "/" + parts.slice(0, idx + 1).join("/"),
  }))

  return [home, ...rest]
}

export function BreadcrumbNav() {
  const location = useLocation()
  const segments = buildSegments(location.pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, idx) => (
          <React.Fragment key={seg.path}>
            <BreadcrumbItem>
              {idx < segments.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={seg.path}>{seg.label}</Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-header-foreground">{seg.label}</span>
              )}
            </BreadcrumbItem>
            {idx < segments.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

- [ ] **Step 4: Upgrade SidebarLink to NavLink**

```tsx
// src/components/general/SidebarLink.tsx
import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

export function SidebarLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <NavLink
      to={href}
      end={href === "/"}
      className={({ isActive }) =>
        cn(
          "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      {children}
    </NavLink>
  )
}
```

- [ ] **Step 5: Run tests to verify pass**

```bash
npm run test:run -- src/test/BreadcrumbNav.test.tsx
```

Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: dynamic breadcrumbs, NavLink active state in sidebar"
```

---

### Task 3: Fix dice display + simplify store loaders

**Files:**
- Create: `src/utils/diceUtils.ts`
- Create: `src/test/diceUtils.test.ts`
- Modify: `src/pages/CharacterDetailsPage.tsx`
- Modify: `src/stores/character.ts`
- Modify: `src/stores/discipline.ts`
- Modify: `src/stores/rule.ts`

**Interfaces:**
- Produces: `ratingToColor(rating: number): DiceColor | null` exported from `src/utils/diceUtils.ts`

- [ ] **Step 1: Write failing dice util tests**

```typescript
// src/test/diceUtils.test.ts
import { ratingToColor } from '@/utils/diceUtils'

test('maps rating 0 to black', () => {
  expect(ratingToColor(0)).toBe('black')
})
test('maps rating 1 to purple', () => {
  expect(ratingToColor(1)).toBe('purple')
})
test('maps rating 8 to blue', () => {
  expect(ratingToColor(8)).toBe('blue')
})
test('returns null for unknown rating', () => {
  expect(ratingToColor(99)).toBeNull()
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/test/diceUtils.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/utils/diceUtils.ts`**

```typescript
// src/utils/diceUtils.ts
import { convictionRatings } from "@/types/dice"
import type { DiceColor } from "@/types/dice"

const ratingToColorMap: Record<number, DiceColor> = Object.entries(convictionRatings).reduce(
  (acc, [color, rating]) => ({ ...acc, [rating]: color as DiceColor }),
  {} as Record<number, DiceColor>
)

export function ratingToColor(rating: number): DiceColor | null {
  return ratingToColorMap[rating] ?? null
}
```

- [ ] **Step 4: Run tests to verify pass**

```bash
npm run test:run -- src/test/diceUtils.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 5: Fix CharacterDetailsPage dice — replace hardcoded dice with character data**

In `src/pages/CharacterDetailsPage.tsx`, add the import and replace the Dice section:

```tsx
import { ratingToColor } from "@/utils/diceUtils"
```

Replace the Dice Card content (lines ~73–87 of the original) with:

```tsx
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
```

- [ ] **Step 6: Simplify character store loader**

```typescript
// src/stores/character.ts
import { create } from "zustand"
import type { Character } from "@/types/character"
import adventurers from "@/assets/data/Adventurers.json"

type CharacterState = {
  characters: Character[]
  selectedCharacter: Character | null
  error: string | null
  filter: string
  setFilter: (filter: string) => void
  selectCharacter: (cardId: string | undefined) => Character | null
  filteredCharacters: () => Character[]
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: adventurers as Character[],
  selectedCharacter: null,
  error: null,
  filter: "",

  setFilter: (filter) => set({ filter }),

  selectCharacter: (cardId) => {
    set({ error: null })
    const character = get().characters.find((c) => c.cardId === cardId) ?? null
    if (!character) set({ error: "Character not found." })
    else set({ selectedCharacter: character })
    return character
  },

  filteredCharacters: () => {
    const { filter, characters } = get()
    return characters.filter((c) =>
      c.name.toLowerCase().includes(filter.toLowerCase())
    )
  },
}))
```

- [ ] **Step 7: Simplify discipline store loader**

```typescript
// src/stores/discipline.ts
import type { DisciplineTree } from "@/types/discipline"
import { create } from "zustand"
import rawDisciplines from "@/assets/data/DisciplineTrees.json"

type DisciplineState = {
  exp: number
  disciplineTrees: DisciplineTree[]
  spendExp: (treeId: string, nodeId: string) => void
}

export const useDisciplineStore = create<DisciplineState>((set, get) => ({
  exp: 10,
  disciplineTrees: rawDisciplines as DisciplineTree[],

  spendExp: (treeId, nodeId) => {
    const { exp, disciplineTrees } = get()
    const node = disciplineTrees.flatMap((t) => t.abilities.flat()).find((n) => n.id === nodeId)
    if (!node || node.unlocked || exp < node.baseCost) return

    set({
      exp: exp - node.baseCost,
      disciplineTrees: disciplineTrees.map((tree) => {
        if (tree.id !== treeId) return tree
        return {
          ...tree,
          abilities: tree.abilities.map((level) =>
            level.map((n) => (n.id === nodeId ? { ...n, unlocked: true } : n))
          ),
        }
      }),
    })
  },
}))
```

- [ ] **Step 8: Simplify rule store loader**

```typescript
// src/stores/rule.ts
import type { Tag } from "@/types/rule"
import { create } from "zustand"
import tagsData from "@/assets/data/Tags.json"

type RuleState = {
  tags: Tag[]
  filter: string
  setTagFilter: (filter: string) => void
  filteredTags: () => Tag[]
}

export const useRuleStore = create<RuleState>((set, get) => ({
  tags: tagsData as Tag[],
  filter: "",

  setTagFilter: (filter) => set({ filter }),

  filteredTags: () => {
    const { filter, tags } = get()
    return tags.filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()))
  },
}))
```

- [ ] **Step 9: Update pages that called loadCharacters / loadTags / loadDisciplineTrees**

In `src/components/character/CharacterGrid.tsx` (and any other component calling `loadCharacters`), remove the `useEffect` that calls `loadCharacters()` — data is already in the store on initialization.

In `src/pages/TagLookupPage.tsx`, remove any `loadTags` call.

In `src/pages/DisciplineTreePage.tsx`, remove the `loadDisciplineTrees` call and update the guard — `disciplineTrees` is always populated now:

```tsx
// src/pages/DisciplineTreePage.tsx — remove the useEffect import and loadDisciplineTrees useEffect
// Keep the rest of the page unchanged; disciplineTrees.length === 0 case can remain as a safety fallback
```

- [ ] **Step 10: Run all tests**

```bash
npm run test:run
```

Expected: PASS (all existing tests)

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: fix conviction/casting dice display, simplify store loaders"
```

---

## Phase 2: Persistence Layer

### Task 4: Define shared types

**Files:**
- Create: `src/types/gear.ts`
- Create: `src/types/build.ts`
- Create: `src/types/campaign.ts`
- Create: `src/types/save.ts`

**Interfaces:**
- Produces: `GearItem`, `BuildGear`, `Build`, `PartyMember`, `CampaignPosition`, `LogEntry`, `Campaign`, `SaveFile` — all exported from their respective files

- [ ] **Step 1: Create `src/types/gear.ts`**

```typescript
// src/types/gear.ts
export type GearCategory = 'weapon' | 'armor' | 'core' | 'relic' | 'accessory' | 'consumable'

export interface GearItem {
  id: string
  name: string
  category: GearCategory
}

export interface BuildGear {
  hand1: GearItem | null
  hand2: GearItem | null
  armor: GearItem | null
  core: GearItem | null
  relics: (GearItem | null)[]
  accessories: (GearItem | null)[]
}

export function emptyBuildGear(): BuildGear {
  return {
    hand1: null,
    hand2: null,
    armor: null,
    core: null,
    relics: [null, null, null],
    accessories: [null],
  }
}
```

- [ ] **Step 2: Create `src/types/build.ts`**

```typescript
// src/types/build.ts
import type { BuildGear } from './gear'

export interface Build {
  id: string
  name: string
  characterCardId: string
  gear: BuildGear
  unlockedDisciplineNodes: string[]
  consumables: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

export function newBuild(overrides?: Partial<Build>): Build {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: 'New Build',
    characterCardId: '',
    gear: {
      hand1: null, hand2: null, armor: null, core: null,
      relics: [null, null, null], accessories: [null],
    },
    unlockedDisciplineNodes: [],
    consumables: [],
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
```

- [ ] **Step 3: Create `src/types/campaign.ts`**

```typescript
// src/types/campaign.ts
import type { BuildGear } from './gear'
import type { GearItem } from './gear'

export interface CampaignPosition {
  chapter: string
  page: number
  mission: string
}

export interface LogEntry {
  id: string
  timestamp: string
  text: string
  type: 'auto' | 'note'
}

export interface PartyMember {
  characterCardId: string
  buildId: string | null
  gear: BuildGear
  unlockedDisciplineNodes: string[]
  currentHealth: number
  maxHealth: number
  status: 'active' | 'injured' | 'missing'
  notes: string
}

export interface Campaign {
  id: string
  name: string
  position: CampaignPosition
  party: PartyMember[]
  loot: GearItem[]
  log: LogEntry[]
  createdAt: string
  updatedAt: string
}

export function newCampaign(overrides?: Partial<Campaign>): Campaign {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: 'New Campaign',
    position: { chapter: '', page: 1, mission: '' },
    party: [],
    loot: [],
    log: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
```

- [ ] **Step 4: Create `src/types/save.ts`**

```typescript
// src/types/save.ts
import type { Build } from './build'
import type { Campaign } from './campaign'

export interface SaveFile {
  version: "1"
  exportedAt: string
  builds: Build[]
  campaigns: Campaign[]
}
```

- [ ] **Step 5: Commit**

```bash
git add src/types/gear.ts src/types/build.ts src/types/campaign.ts src/types/save.ts
git commit -m "feat: add shared types for gear, build, campaign, save file"
```

---

### Task 5: Build and Campaign Zustand stores

**Files:**
- Create: `src/stores/build.ts`
- Create: `src/stores/campaign.ts`
- Create: `src/test/buildStore.test.ts`
- Create: `src/test/campaignStore.test.ts`

**Interfaces:**
- Consumes: `Build` from `@/types/build`, `Campaign`, `PartyMember`, `LogEntry`, `CampaignPosition` from `@/types/campaign`, `GearItem` from `@/types/gear`
- Produces: `useBuildStore`, `useCampaignStore`

- [ ] **Step 1: Write failing build store tests**

```typescript
// src/test/buildStore.test.ts
import { useBuildStore } from '@/stores/build'
import type { Build } from '@/types/build'

const mockBuild: Build = {
  id: 'test-id',
  name: 'Test Build',
  characterCardId: 'AB-001',
  gear: { hand1: null, hand2: null, armor: null, core: null, relics: [null, null, null], accessories: [null] },
  unlockedDisciplineNodes: [],
  consumables: [],
  notes: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  useBuildStore.setState({ builds: [] })
})

test('starts empty', () => {
  expect(useBuildStore.getState().builds).toHaveLength(0)
})

test('addBuild adds a build', () => {
  useBuildStore.getState().addBuild(mockBuild)
  expect(useBuildStore.getState().builds).toHaveLength(1)
  expect(useBuildStore.getState().builds[0].name).toBe('Test Build')
})

test('deleteBuild removes a build', () => {
  useBuildStore.getState().addBuild(mockBuild)
  useBuildStore.getState().deleteBuild('test-id')
  expect(useBuildStore.getState().builds).toHaveLength(0)
})

test('updateBuild changes build fields', () => {
  useBuildStore.getState().addBuild(mockBuild)
  useBuildStore.getState().updateBuild('test-id', { name: 'Renamed' })
  expect(useBuildStore.getState().builds[0].name).toBe('Renamed')
})

test('getBuild returns build by id', () => {
  useBuildStore.getState().addBuild(mockBuild)
  expect(useBuildStore.getState().getBuild('test-id')?.name).toBe('Test Build')
})

test('getBuild returns undefined for unknown id', () => {
  expect(useBuildStore.getState().getBuild('missing')).toBeUndefined()
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/test/buildStore.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/stores/build.ts`**

```typescript
// src/stores/build.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Build } from '@/types/build'

type BuildState = {
  builds: Build[]
  addBuild: (build: Build) => void
  updateBuild: (id: string, updates: Partial<Omit<Build, 'id' | 'createdAt'>>) => void
  deleteBuild: (id: string) => void
  getBuild: (id: string) => Build | undefined
}

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      builds: [],

      addBuild: (build) =>
        set((state) => ({ builds: [...state.builds, build] })),

      updateBuild: (id, updates) =>
        set((state) => ({
          builds: state.builds.map((b) =>
            b.id === id
              ? { ...b, ...updates, updatedAt: new Date().toISOString() }
              : b
          ),
        })),

      deleteBuild: (id) =>
        set((state) => ({ builds: state.builds.filter((b) => b.id !== id) })),

      getBuild: (id) => get().builds.find((b) => b.id === id),
    }),
    { name: 'middara-builds' }
  )
)
```

- [ ] **Step 4: Write failing campaign store tests**

```typescript
// src/test/campaignStore.test.ts
import { useCampaignStore } from '@/stores/campaign'
import type { Campaign } from '@/types/campaign'
import type { GearItem } from '@/types/gear'

const mockCampaign: Campaign = {
  id: 'camp-1',
  name: 'Test Campaign',
  position: { chapter: 'Chapter 1', page: 1, mission: 'Opening' },
  party: [
    {
      characterCardId: '3-25-1.0-BS23',
      buildId: null,
      gear: { hand1: null, hand2: null, armor: null, core: null, relics: [null, null, null], accessories: [null] },
      unlockedDisciplineNodes: [],
      currentHealth: 14,
      maxHealth: 14,
      status: 'active',
      notes: '',
    }
  ],
  loot: [],
  log: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const mockItem: GearItem = { id: 'sword-1', name: 'Iron Sword', category: 'weapon' }

beforeEach(() => {
  useCampaignStore.setState({ campaigns: [] })
})

test('addCampaign adds a campaign', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  expect(useCampaignStore.getState().campaigns).toHaveLength(1)
})

test('deleteCampaign removes a campaign', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().deleteCampaign('camp-1')
  expect(useCampaignStore.getState().campaigns).toHaveLength(0)
})

test('adjustHealth decreases currentHealth and creates auto log', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().adjustHealth('camp-1', 0, -3)
  const camp = useCampaignStore.getState().campaigns[0]
  expect(camp.party[0].currentHealth).toBe(11)
  expect(camp.log).toHaveLength(1)
  expect(camp.log[0].type).toBe('auto')
  expect(camp.log[0].text).toContain('3')
})

test('adjustHealth does not go below 0', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().adjustHealth('camp-1', 0, -999)
  expect(useCampaignStore.getState().campaigns[0].party[0].currentHealth).toBe(0)
})

test('addLoot adds item to loot pool and creates auto log', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().addLoot('camp-1', mockItem)
  const camp = useCampaignStore.getState().campaigns[0]
  expect(camp.loot).toHaveLength(1)
  expect(camp.loot[0].name).toBe('Iron Sword')
  expect(camp.log[0].type).toBe('auto')
  expect(camp.log[0].text).toContain('Iron Sword')
})

test('addNote creates note log entry', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().addNote('camp-1', 'Party rested here')
  const camp = useCampaignStore.getState().campaigns[0]
  expect(camp.log[0].type).toBe('note')
  expect(camp.log[0].text).toBe('Party rested here')
})

test('updatePosition creates auto log', () => {
  useCampaignStore.getState().addCampaign(mockCampaign)
  useCampaignStore.getState().updatePosition('camp-1', { chapter: 'Chapter 2', page: 15, mission: 'The Depths' })
  const camp = useCampaignStore.getState().campaigns[0]
  expect(camp.position.page).toBe(15)
  expect(camp.log[0].type).toBe('auto')
})
```

- [ ] **Step 5: Run campaign store tests to verify they fail**

```bash
npm run test:run -- src/test/campaignStore.test.ts
```

Expected: FAIL

- [ ] **Step 6: Create `src/stores/campaign.ts`**

```typescript
// src/stores/campaign.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Campaign, CampaignPosition, LogEntry, PartyMember } from '@/types/campaign'
import type { GearItem } from '@/types/gear'

function autoLog(text: string): LogEntry {
  return { id: crypto.randomUUID(), timestamp: new Date().toISOString(), text, type: 'auto' }
}

function noteLog(text: string): LogEntry {
  return { id: crypto.randomUUID(), timestamp: new Date().toISOString(), text, type: 'note' }
}

function updateCampaign(
  campaigns: Campaign[],
  id: string,
  updater: (c: Campaign) => Campaign
): Campaign[] {
  return campaigns.map((c) => (c.id === id ? updater(c) : c))
}

type CampaignState = {
  campaigns: Campaign[]
  addCampaign: (campaign: Campaign) => void
  updateCampaign: (id: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => void
  deleteCampaign: (id: string) => void
  getCampaign: (id: string) => Campaign | undefined
  updatePosition: (campaignId: string, position: CampaignPosition) => void
  adjustHealth: (campaignId: string, memberIndex: number, amount: number) => void
  addLoot: (campaignId: string, item: GearItem) => void
  equipSingleItem: (campaignId: string, memberIndex: number, slot: 'hand1' | 'hand2' | 'armor' | 'core', item: GearItem | null) => void
  equipRelicItem: (campaignId: string, memberIndex: number, relicIndex: number, item: GearItem | null) => void
  equipAccessoryItem: (campaignId: string, memberIndex: number, accessoryIndex: number, item: GearItem | null) => void
  addPartyMember: (campaignId: string, member: PartyMember) => void
  removePartyMember: (campaignId: string, memberIndex: number) => void
  addNote: (campaignId: string, text: string) => void
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [],

      addCampaign: (campaign) =>
        set((state) => ({ campaigns: [...state.campaigns, campaign] })),

      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, id, (c) => ({
            ...c,
            ...updates,
            updatedAt: new Date().toISOString(),
          })),
        })),

      deleteCampaign: (id) =>
        set((state) => ({ campaigns: state.campaigns.filter((c) => c.id !== id) })),

      getCampaign: (id) => get().campaigns.find((c) => c.id === id),

      updatePosition: (campaignId, position) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => ({
            ...c,
            position,
            log: [...c.log, autoLog(`Position: ${position.chapter}, page ${position.page}, mission: ${position.mission}`)],
            updatedAt: new Date().toISOString(),
          })),
        })),

      adjustHealth: (campaignId, memberIndex, amount) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => {
            const member = c.party[memberIndex]
            if (!member) return c
            const newHealth = Math.max(0, Math.min(member.maxHealth, member.currentHealth + amount))
            const verb = amount < 0 ? `took ${Math.abs(amount)} damage` : `healed ${amount}`
            const entry = autoLog(`${member.characterCardId} ${verb} (${newHealth}/${member.maxHealth} HP)`)
            return {
              ...c,
              party: c.party.map((m, i) => (i === memberIndex ? { ...m, currentHealth: newHealth } : m)),
              log: [...c.log, entry],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      addLoot: (campaignId, item) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => ({
            ...c,
            loot: [...c.loot, item],
            log: [...c.log, autoLog(`Loot found: ${item.name}`)],
            updatedAt: new Date().toISOString(),
          })),
        })),

      equipSingleItem: (campaignId, memberIndex, slot, item) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => {
            const member = c.party[memberIndex]
            if (!member) return c
            const entry = autoLog(`${member.characterCardId} equipped ${item?.name ?? 'nothing'} in ${slot}`)
            return {
              ...c,
              party: c.party.map((m, i) =>
                i === memberIndex ? { ...m, gear: { ...m.gear, [slot]: item } } : m
              ),
              log: [...c.log, entry],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      equipRelicItem: (campaignId, memberIndex, relicIndex, item) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => {
            const member = c.party[memberIndex]
            if (!member) return c
            const newRelics = [...member.gear.relics]
            newRelics[relicIndex] = item
            const entry = autoLog(`${member.characterCardId} equipped ${item?.name ?? 'nothing'} in relic slot ${relicIndex + 1}`)
            return {
              ...c,
              party: c.party.map((m, i) =>
                i === memberIndex ? { ...m, gear: { ...m.gear, relics: newRelics } } : m
              ),
              log: [...c.log, entry],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      equipAccessoryItem: (campaignId, memberIndex, accessoryIndex, item) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => {
            const member = c.party[memberIndex]
            if (!member) return c
            const newAccessories = [...member.gear.accessories]
            newAccessories[accessoryIndex] = item
            const entry = autoLog(`${member.characterCardId} equipped ${item?.name ?? 'nothing'} in accessory slot ${accessoryIndex + 1}`)
            return {
              ...c,
              party: c.party.map((m, i) =>
                i === memberIndex ? { ...m, gear: { ...m.gear, accessories: newAccessories } } : m
              ),
              log: [...c.log, entry],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      addPartyMember: (campaignId, member) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => ({
            ...c,
            party: [...c.party, member],
            log: [...c.log, autoLog(`${member.characterCardId} joined the party`)],
            updatedAt: new Date().toISOString(),
          })),
        })),

      removePartyMember: (campaignId, memberIndex) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => {
            const member = c.party[memberIndex]
            return {
              ...c,
              party: c.party.filter((_, i) => i !== memberIndex),
              log: member ? [...c.log, autoLog(`${member.characterCardId} left the party`)] : c.log,
              updatedAt: new Date().toISOString(),
            }
          }),
        })),

      addNote: (campaignId, text) =>
        set((state) => ({
          campaigns: updateCampaign(state.campaigns, campaignId, (c) => ({
            ...c,
            log: [...c.log, noteLog(text)],
            updatedAt: new Date().toISOString(),
          })),
        })),
    }),
    { name: 'middara-campaigns' }
  )
)
```

- [ ] **Step 7: Run all store tests**

```bash
npm run test:run -- src/test/buildStore.test.ts src/test/campaignStore.test.ts
```

Expected: PASS (all 11 tests)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add useBuildStore and useCampaignStore with localStorage persistence"
```

---

### Task 6: Save export/import + Settings page

**Files:**
- Create: `src/utils/saveData.ts`
- Create: `src/test/saveData.test.ts`
- Modify: `src/pages/SettingsPage.tsx`

**Interfaces:**
- Consumes: `SaveFile` from `@/types/save`, `Build`, `Campaign`
- Produces: `exportSaveFile(builds, campaigns): void`, `parseSaveFile(json: string): SaveFile | null`

- [ ] **Step 1: Write failing save data tests**

```typescript
// src/test/saveData.test.ts
import { parseSaveFile } from '@/utils/saveData'

test('returns null for invalid JSON', () => {
  expect(parseSaveFile('not json')).toBeNull()
})

test('returns null for wrong version', () => {
  expect(parseSaveFile(JSON.stringify({ version: '2', builds: [], campaigns: [] }))).toBeNull()
})

test('parses valid save file', () => {
  const input = JSON.stringify({ version: '1', exportedAt: '2026-01-01', builds: [], campaigns: [] })
  const result = parseSaveFile(input)
  expect(result).not.toBeNull()
  expect(result?.version).toBe('1')
  expect(result?.builds).toHaveLength(0)
})

test('parses save file with build data', () => {
  const build = { id: 'b1', name: 'Build 1', characterCardId: 'c1' }
  const input = JSON.stringify({ version: '1', exportedAt: '2026-01-01', builds: [build], campaigns: [] })
  const result = parseSaveFile(input)
  expect(result?.builds[0].name).toBe('Build 1')
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/test/saveData.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create `src/utils/saveData.ts`**

```typescript
// src/utils/saveData.ts
import type { SaveFile } from '@/types/save'
import type { Build } from '@/types/build'
import type { Campaign } from '@/types/campaign'

export function exportSaveFile(builds: Build[], campaigns: Campaign[]): void {
  const save: SaveFile = {
    version: '1',
    exportedAt: new Date().toISOString(),
    builds,
    campaigns,
  }
  const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'middara-save.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function parseSaveFile(json: string): SaveFile | null {
  try {
    const data = JSON.parse(json)
    if (data?.version !== '1') return null
    return data as SaveFile
  } catch {
    return null
  }
}
```

- [ ] **Step 4: Run tests to verify pass**

```bash
npm run test:run -- src/test/saveData.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 5: Update SettingsPage with export/import**

```tsx
// src/pages/SettingsPage.tsx
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
```

- [ ] **Step 6: Run all tests**

```bash
npm run test:run
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: save export/import JSON, update Settings page"
```

---

## Phase 3: Build System

### Task 7: Builds list page + routes

**Files:**
- Create: `src/pages/BuildsPage.tsx`
- Modify: `src/routes/routes.tsx`
- Modify: `src/components/layout/MainLayout.tsx`

**Interfaces:**
- Consumes: `useBuildStore`, `newBuild` from `@/types/build`
- Produces: `/builds` route rendering `BuildsPage`

- [ ] **Step 1: Create `BuildsPage`**

```tsx
// src/pages/BuildsPage.tsx
import { useNavigate } from 'react-router-dom'
import { useBuildStore } from '@/stores/build'
import { newBuild } from '@/types/build'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Trash2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

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
```

- [ ] **Step 2: Add Builds + Campaigns to sidebar and routes**

Update `src/routes/routes.tsx`:

```typescript
// src/routes/routes.tsx
import type { RouteObject } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import CharactersPage from '@/pages/CharactersPage'
import SettingPage from '@/pages/SettingsPage'
import CharacterDetailsPage from '@/pages/CharacterDetailsPage'
import TagLookupPage from '@/pages/TagLookupPage'
import DisciplineTreePage from '@/pages/DisciplineTreePage'
import BuildsPage from '@/pages/BuildsPage'

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/characters', element: <CharactersPage /> },
  { path: '/characters/:cardId', element: <CharacterDetailsPage /> },
  { path: '/tags', element: <TagLookupPage /> },
  { path: '/settings', element: <SettingPage /> },
  { path: '/disciplines', element: <DisciplineTreePage /> },
  { path: '/builds', element: <BuildsPage /> },
]
```

Update sidebar in `src/components/layout/MainLayout.tsx` — add Builds and Campaigns links:

```tsx
<SidebarLink href="/">Home</SidebarLink>
<SidebarLink href="/campaigns">Campaigns</SidebarLink>
<SidebarLink href="/builds">Builds</SidebarLink>
<SidebarLink href="/characters">Characters</SidebarLink>
<SidebarLink href="/disciplines">Disciplines</SidebarLink>
<SidebarLink href="/tags">Tags</SidebarLink>
<SidebarLink href="/settings">Settings</SidebarLink>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add BuildsPage with create/delete, update sidebar and routes"
```

---

### Task 8: Build editor — gear slots

**Files:**
- Create: `src/pages/BuildEditorPage.tsx`
- Create: `src/components/build/GearSlotGrid.tsx`
- Create: `src/components/build/GearSlot.tsx`
- Modify: `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `useBuildStore`, `Build`, `BuildGear`, `GearItem` from `@/types/gear`
- Produces: `/builds/:buildId` route rendering `BuildEditorPage`

- [ ] **Step 1: Create `GearSlot` component**

```tsx
// src/components/build/GearSlot.tsx
import type { GearItem } from '@/types/gear'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface GearSlotProps {
  label: string
  item: GearItem | null
  onClear?: () => void
}

export function GearSlot({ label, item, onClear }: GearSlotProps) {
  return (
    <div className={cn(
      'rounded-lg border-2 border-dashed p-3 flex flex-col gap-1 min-h-[72px]',
      item ? 'border-muted bg-muted/20' : 'border-muted/40'
    )}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      {item ? (
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate">{item.name}</span>
          {onClear && (
            <Button size="icon" variant="ghost" className="h-5 w-5 shrink-0" onClick={onClear}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Empty</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `GearSlotGrid` component**

```tsx
// src/components/build/GearSlotGrid.tsx
import type { BuildGear, GearItem } from '@/types/gear'
import { GearSlot } from './GearSlot'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface GearSlotGridProps {
  gear: BuildGear
  onClearSingle: (slot: 'hand1' | 'hand2' | 'armor' | 'core') => void
  onClearRelic: (index: number) => void
  onClearAccessory: (index: number) => void
  onAddRelicSlot: () => void
  onAddAccessorySlot: () => void
}

export function GearSlotGrid({
  gear,
  onClearSingle,
  onClearRelic,
  onClearAccessory,
  onAddRelicSlot,
  onAddAccessorySlot,
}: GearSlotGridProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <GearSlot label="Hand 1" item={gear.hand1} onClear={gear.hand1 ? () => onClearSingle('hand1') : undefined} />
        <GearSlot label="Hand 2" item={gear.hand2} onClear={gear.hand2 ? () => onClearSingle('hand2') : undefined} />
        <GearSlot label="Armor" item={gear.armor} onClear={gear.armor ? () => onClearSingle('armor') : undefined} />
        <GearSlot label="Core" item={gear.core} onClear={gear.core ? () => onClearSingle('core') : undefined} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Relics</p>
          <Button size="sm" variant="outline" onClick={onAddRelicSlot}>
            <Plus className="h-3 w-3 mr-1" /> Add Slot
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {gear.relics.map((relic, i) => (
            <GearSlot
              key={i}
              label={`Relic ${i + 1}`}
              item={relic}
              onClear={relic ? () => onClearRelic(i) : undefined}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Accessories</p>
          <Button size="sm" variant="outline" onClick={onAddAccessorySlot}>
            <Plus className="h-3 w-3 mr-1" /> Add Slot
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {gear.accessories.map((acc, i) => (
            <GearSlot
              key={i}
              label={`Accessory ${i + 1}`}
              item={acc}
              onClear={acc ? () => onClearAccessory(i) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `BuildEditorPage`**

```tsx
// src/pages/BuildEditorPage.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useBuildStore } from '@/stores/build'
import { useCharacterStore } from '@/stores/character'
import { GearSlotGrid } from '@/components/build/GearSlotGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function BuildEditorPage() {
  const { buildId } = useParams<{ buildId: string }>()
  const { getBuild, updateBuild, deleteBuild } = useBuildStore()
  const { characters } = useCharacterStore()
  const navigate = useNavigate()
  const [newConsumable, setNewConsumable] = useState('')

  const build = getBuild(buildId ?? '')

  if (!build) {
    return <div className="p-6 text-muted-foreground">Build not found.</div>
  }

  function patch(updates: Parameters<typeof updateBuild>[1]) {
    updateBuild(build!.id, updates)
  }

  function handleDelete() {
    deleteBuild(build!.id)
    navigate('/builds')
  }

  function addConsumable() {
    if (!newConsumable.trim()) return
    patch({ consumables: [...build!.consumables, newConsumable.trim()] })
    setNewConsumable('')
  }

  function removeConsumable(i: number) {
    patch({ consumables: build!.consumables.filter((_, idx) => idx !== i) })
  }

  function clearSingleGear(slot: 'hand1' | 'hand2' | 'armor' | 'core') {
    patch({ gear: { ...build!.gear, [slot]: null } })
  }

  function clearRelic(index: number) {
    const relics = [...build!.gear.relics]
    relics[index] = null
    patch({ gear: { ...build!.gear, relics } })
  }

  function clearAccessory(index: number) {
    const accessories = [...build!.gear.accessories]
    accessories[index] = null
    patch({ gear: { ...build!.gear, accessories } })
  }

  function addRelicSlot() {
    patch({ gear: { ...build!.gear, relics: [...build!.gear.relics, null] } })
  }

  function addAccessorySlot() {
    patch({ gear: { ...build!.gear, accessories: [...build!.gear.accessories, null] } })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Input
          className="text-xl font-bold border-none shadow-none px-0 text-foreground max-w-sm focus-visible:ring-0"
          value={build.name}
          onChange={(e) => patch({ name: e.target.value })}
        />
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/builds/${build.id}/test`}>Open Tester</Link>
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Character */}
        <Card>
          <CardHeader><CardTitle>Character</CardTitle></CardHeader>
          <CardContent>
            <Select
              value={build.characterCardId}
              onValueChange={(v) => patch({ characterCardId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a character..." />
              </SelectTrigger>
              <SelectContent>
                {characters.map((c) => (
                  <SelectItem key={c.cardId} value={c.cardId}>
                    {c.name} ({c.cardId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Consumables */}
        <Card>
          <CardHeader><CardTitle>Consumables</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {build.consumables.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-sm">{item}</span>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeConsumable(i)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add consumable..."
                value={newConsumable}
                onChange={(e) => setNewConsumable(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addConsumable()}
              />
              <Button size="icon" onClick={addConsumable}><Plus className="w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gear */}
      <Card>
        <CardHeader><CardTitle>Gear</CardTitle></CardHeader>
        <CardContent>
          <GearSlotGrid
            gear={build.gear}
            onClearSingle={clearSingleGear}
            onClearRelic={clearRelic}
            onClearAccessory={clearAccessory}
            onAddRelicSlot={addRelicSlot}
            onAddAccessorySlot={addAccessorySlot}
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
        <CardContent>
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            value={build.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="Build notes..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4: Add build editor route**

In `src/routes/routes.tsx`, add:

```typescript
import BuildEditorPage from '@/pages/BuildEditorPage'
// ...
{ path: '/builds/:buildId', element: <BuildEditorPage /> },
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add BuildEditorPage with gear slots, character picker, consumables"
```

---

### Task 9: Discipline panel in build editor

**Files:**
- Create: `src/components/build/BuildDisciplinePanel.tsx`
- Modify: `src/pages/BuildEditorPage.tsx`

**Interfaces:**
- Consumes: `useDisciplineStore`, `DisciplineTree`, `AbilityNode` from `@/types/discipline`; `unlockedDisciplineNodes: string[]`, `onToggleNode: (nodeId: string) => void` props
- Produces: `BuildDisciplinePanel` component

- [ ] **Step 1: Create `BuildDisciplinePanel`**

```tsx
// src/components/build/BuildDisciplinePanel.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDisciplineStore } from '@/stores/discipline'
import type { AbilityNode } from '@/types/discipline'
import { cn } from '@/lib/utils'

interface BuildDisciplinePanelProps {
  unlockedNodes: string[]
  onToggleNode: (nodeId: string) => void
}

export function BuildDisciplinePanel({ unlockedNodes, onToggleNode }: BuildDisciplinePanelProps) {
  const { disciplineTrees } = useDisciplineStore()

  if (disciplineTrees.length === 0) return null

  return (
    <Tabs defaultValue={disciplineTrees[0].id} className="w-full">
      <TabsList className="flex flex-wrap gap-2 mb-4">
        {disciplineTrees.map((tree) => (
          <TabsTrigger key={tree.id} value={tree.id}>
            {tree.discipline}
          </TabsTrigger>
        ))}
      </TabsList>

      {disciplineTrees.map((tree) => (
        <TabsContent key={tree.id} value={tree.id}>
          <div className="space-y-6">
            {tree.abilities.map((level, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Level {idx + 1}
                </h3>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {level.map((node) => (
                    <BuildDisciplineNode
                      key={node.id}
                      node={node}
                      isUnlocked={unlockedNodes.includes(node.id)}
                      onToggle={() => onToggleNode(node.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

interface BuildDisciplineNodeProps {
  node: AbilityNode
  isUnlocked: boolean
  onToggle: () => void
}

function BuildDisciplineNode({ node, isUnlocked, onToggle }: BuildDisciplineNodeProps) {
  return (
    <Card className={cn('transition-colors', isUnlocked && 'border-primary bg-primary/5')}>
      <CardHeader className="pb-1 pt-3 px-3">
        <div className="flex items-start justify-between gap-1">
          <CardTitle className="text-sm leading-tight">{node.name}</CardTitle>
          <Badge variant="outline" className="text-xs shrink-0">{node.baseCost} EXP</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-2">
        <p className="text-xs text-muted-foreground line-clamp-3">{node.description}</p>
        <Button
          size="sm"
          variant={isUnlocked ? 'default' : 'outline'}
          className="w-full"
          onClick={onToggle}
        >
          {isUnlocked ? 'Unlocked' : 'Unlock'}
        </Button>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Add discipline panel to BuildEditorPage**

Add this import to `BuildEditorPage.tsx`:

```tsx
import { BuildDisciplinePanel } from '@/components/build/BuildDisciplinePanel'
```

Add this Card after the Notes Card:

```tsx
{/* Disciplines */}
<Card>
  <CardHeader><CardTitle>Disciplines</CardTitle></CardHeader>
  <CardContent>
    <BuildDisciplinePanel
      unlockedNodes={build.unlockedDisciplineNodes}
      onToggleNode={(nodeId) => {
        const current = build.unlockedDisciplineNodes
        const updated = current.includes(nodeId)
          ? current.filter((id) => id !== nodeId)
          : [...current, nodeId]
        patch({ unlockedDisciplineNodes: updated })
      }}
    />
  </CardContent>
</Card>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add BuildDisciplinePanel to build editor"
```

---

## Phase 4: Campaign Tracker

### Task 10: Campaigns list + setup pages

**Files:**
- Create: `src/pages/CampaignsPage.tsx`
- Create: `src/pages/CampaignSetupPage.tsx`
- Modify: `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `useCampaignStore`, `newCampaign` from `@/types/campaign`, `useCharacterStore`
- Produces: `/campaigns` and `/campaigns/:campaignId` routes

- [ ] **Step 1: Create `CampaignsPage`**

```tsx
// src/pages/CampaignsPage.tsx
import { useNavigate, Link } from 'react-router-dom'
import { useCampaignStore } from '@/stores/campaign'
import { newCampaign } from '@/types/campaign'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Trash2, Eye, Swords } from 'lucide-react'

export default function CampaignsPage() {
  const { campaigns, addCampaign, deleteCampaign } = useCampaignStore()
  const navigate = useNavigate()

  function handleCreate() {
    const campaign = newCampaign()
    addCampaign(campaign)
    navigate(`/campaigns/${campaign.id}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Button onClick={handleCreate}>New Campaign</Button>
      </div>

      {campaigns.length === 0 && (
        <p className="text-muted-foreground">No campaigns yet. Create one to get started.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardContent className="pt-4 space-y-1">
              <CardTitle className="text-base truncate">{campaign.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {campaign.position.chapter || 'No chapter set'} · {campaign.party.length} members
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-3">
              <Button size="icon" variant="outline" asChild>
                <Link to={`/campaigns/${campaign.id}`}><Eye className="w-4 h-4" /></Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link to={`/campaigns/${campaign.id}/session`}><Swords className="w-4 h-4" /></Link>
              </Button>
              <Button size="icon" variant="destructive" onClick={() => deleteCampaign(campaign.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `CampaignSetupPage`**

```tsx
// src/pages/CampaignSetupPage.tsx
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCampaignStore } from '@/stores/campaign'
import { useCharacterStore } from '@/stores/character'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, Swords } from 'lucide-react'
import type { PartyMember } from '@/types/campaign'
import { emptyBuildGear } from '@/types/gear'

export default function CampaignSetupPage() {
  const { campaignId } = useParams<{ campaignId: string }>()
  const { getCampaign, updateCampaign, addPartyMember, removePartyMember, deleteCampaign, updatePosition } = useCampaignStore()
  const { characters } = useCharacterStore()
  const navigate = useNavigate()

  const campaign = getCampaign(campaignId ?? '')

  if (!campaign) return <div className="p-6 text-muted-foreground">Campaign not found.</div>

  function handleDelete() {
    deleteCampaign(campaign!.id)
    navigate('/campaigns')
  }

  function handleAddMember(cardId: string) {
    const character = characters.find((c) => c.cardId === cardId)
    if (!character) return
    const member: PartyMember = {
      characterCardId: cardId,
      buildId: null,
      gear: emptyBuildGear(),
      unlockedDisciplineNodes: [],
      currentHealth: character.baseStats.health,
      maxHealth: character.baseStats.health,
      status: 'active',
      notes: '',
    }
    addPartyMember(campaign!.id, member)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Input
          className="text-xl font-bold border-none shadow-none px-0 max-w-sm focus-visible:ring-0"
          value={campaign.name}
          onChange={(e) => updateCampaign(campaign.id, { name: e.target.value })}
        />
        <div className="flex gap-2">
          <Button asChild>
            <Link to={`/campaigns/${campaign.id}/session`}>
              <Swords className="w-4 h-4 mr-2" /> Start Session
            </Link>
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Position */}
      <Card>
        <CardHeader><CardTitle>Campaign Position</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Chapter</label>
            <Input
              value={campaign.position.chapter}
              onChange={(e) => updatePosition(campaign.id, { ...campaign.position, chapter: e.target.value })}
              placeholder="Chapter 1"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Page</label>
            <Input
              type="number"
              value={campaign.position.page}
              onChange={(e) => updatePosition(campaign.id, { ...campaign.position, page: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Mission</label>
            <Input
              value={campaign.position.mission}
              onChange={(e) => updatePosition(campaign.id, { ...campaign.position, mission: e.target.value })}
              placeholder="The Opening..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Party */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Party</CardTitle>
            <Select onValueChange={handleAddMember}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Add character..." />
              </SelectTrigger>
              <SelectContent>
                {characters.map((c) => (
                  <SelectItem key={c.cardId} value={c.cardId}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {campaign.party.length === 0 && (
            <p className="text-sm text-muted-foreground">No party members yet.</p>
          )}
          {campaign.party.map((member, i) => {
            const char = characters.find((c) => c.cardId === member.characterCardId)
            return (
              <div key={i} className="flex items-center justify-between border rounded-md px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{char?.name ?? member.characterCardId}</p>
                  <p className="text-xs text-muted-foreground">{member.currentHealth}/{member.maxHealth} HP · {member.status}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => removePartyMember(campaign.id, i)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Add campaign routes**

```typescript
// src/routes/routes.tsx — add these two routes:
import CampaignsPage from '@/pages/CampaignsPage'
import CampaignSetupPage from '@/pages/CampaignSetupPage'

// In routes array:
{ path: '/campaigns', element: <CampaignsPage /> },
{ path: '/campaigns/:campaignId', element: <CampaignSetupPage /> },
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add CampaignsPage and CampaignSetupPage with party management"
```

---

### Task 11: Session HUD — health, position, log

**Files:**
- Create: `src/pages/SessionPage.tsx`
- Create: `src/components/campaign/PositionBar.tsx`
- Create: `src/components/campaign/PartyMemberCard.tsx`
- Create: `src/components/campaign/SessionLog.tsx`
- Modify: `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `useCampaignStore`, `Campaign`, `PartyMember`, `LogEntry`; `useCharacterStore`
- Produces: `/campaigns/:campaignId/session` route

- [ ] **Step 1: Create `PositionBar`**

```tsx
// src/components/campaign/PositionBar.tsx
import type { CampaignPosition } from '@/types/campaign'
import { Input } from '@/components/ui/input'

interface PositionBarProps {
  position: CampaignPosition
  onChange: (position: CampaignPosition) => void
}

export function PositionBar({ position, onChange }: PositionBarProps) {
  return (
    <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-2 border">
      <div className="flex items-center gap-1.5 flex-1">
        <span className="text-xs font-medium text-muted-foreground shrink-0">Chapter</span>
        <Input
          className="h-7 text-sm border-none shadow-none bg-transparent focus-visible:ring-0 px-1"
          value={position.chapter}
          onChange={(e) => onChange({ ...position, chapter: e.target.value })}
          placeholder="—"
        />
      </div>
      <div className="flex items-center gap-1.5 w-24">
        <span className="text-xs font-medium text-muted-foreground shrink-0">Pg</span>
        <Input
          className="h-7 text-sm border-none shadow-none bg-transparent focus-visible:ring-0 px-1"
          type="number"
          value={position.page}
          onChange={(e) => onChange({ ...position, page: parseInt(e.target.value) || 1 })}
        />
      </div>
      <div className="flex items-center gap-1.5 flex-1">
        <span className="text-xs font-medium text-muted-foreground shrink-0">Mission</span>
        <Input
          className="h-7 text-sm border-none shadow-none bg-transparent focus-visible:ring-0 px-1"
          value={position.mission}
          onChange={(e) => onChange({ ...position, mission: e.target.value })}
          placeholder="—"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `PartyMemberCard`**

```tsx
// src/components/campaign/PartyMemberCard.tsx
import type { PartyMember } from '@/types/campaign'
import type { Character } from '@/types/character'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'

interface PartyMemberCardProps {
  member: PartyMember
  character: Character | undefined
  onAdjustHealth: (amount: number) => void
}

const STATUS_COLORS: Record<PartyMember['status'], string> = {
  active: 'bg-green-500/20 text-green-700 dark:text-green-400',
  injured: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  missing: 'bg-red-500/20 text-red-700 dark:text-red-400',
}

export function PartyMemberCard({ member, character, onAdjustHealth }: PartyMemberCardProps) {
  const healthPct = member.maxHealth > 0 ? member.currentHealth / member.maxHealth : 0
  const barColor = healthPct > 0.5 ? 'bg-green-500' : healthPct > 0.25 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base truncate">
            {character?.name ?? member.characterCardId}
          </CardTitle>
          <Badge className={cn('text-xs shrink-0', STATUS_COLORS[member.status])}>
            {member.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Health bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={cn('h-2 rounded-full transition-all', barColor)}
            style={{ width: `${Math.round(healthPct * 100)}%` }}
          />
        </div>

        {/* Health controls */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono">
            {member.currentHealth} / {member.maxHealth}
          </span>
          <div className="flex gap-1">
            {[-5, -3, -1].map((v) => (
              <Button
                key={v}
                size="icon"
                variant="outline"
                className="h-8 w-8 text-destructive border-destructive/30"
                onClick={() => onAdjustHealth(v)}
              >
                <span className="text-xs font-bold">{v}</span>
              </Button>
            ))}
            {[1, 3, 5].map((v) => (
              <Button
                key={v}
                size="icon"
                variant="outline"
                className="h-8 w-8 text-green-600 border-green-600/30"
                onClick={() => onAdjustHealth(v)}
              >
                <span className="text-xs font-bold">+{v}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Create `SessionLog`**

```tsx
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
```

- [ ] **Step 4: Create `SessionPage`**

```tsx
// src/pages/SessionPage.tsx
import { useParams, Link } from 'react-router-dom'
import { useCampaignStore } from '@/stores/campaign'
import { useCharacterStore } from '@/stores/character'
import { PositionBar } from '@/components/campaign/PositionBar'
import { PartyMemberCard } from '@/components/campaign/PartyMemberCard'
import { SessionLog } from '@/components/campaign/SessionLog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

export default function SessionPage() {
  const { campaignId } = useParams<{ campaignId: string }>()
  const { getCampaign, updatePosition, adjustHealth, addNote } = useCampaignStore()
  const { characters } = useCharacterStore()

  const campaign = getCampaign(campaignId ?? '')
  if (!campaign) return <div className="p-6 text-muted-foreground">Campaign not found.</div>

  return (
    <div className="container mx-auto py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold truncate">{campaign.name}</h1>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/campaigns/${campaign.id}`}><Settings className="w-4 h-4 mr-1" /> Setup</Link>
        </Button>
      </div>

      {/* Position bar */}
      <PositionBar
        position={campaign.position}
        onChange={(pos) => updatePosition(campaign.id, pos)}
      />

      {/* Party */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {campaign.party.map((member, i) => (
          <PartyMemberCard
            key={i}
            member={member}
            character={characters.find((c) => c.cardId === member.characterCardId)}
            onAdjustHealth={(amount) => adjustHealth(campaign.id, i, amount)}
          />
        ))}
      </div>

      {/* Log */}
      <Card>
        <CardHeader className="pb-2"><CardTitle>Session Log</CardTitle></CardHeader>
        <CardContent>
          <SessionLog
            log={campaign.log}
            onAddNote={(text) => addNote(campaign.id, text)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 5: Add session route**

```typescript
// src/routes/routes.tsx — add:
import SessionPage from '@/pages/SessionPage'

{ path: '/campaigns/:campaignId/session', element: <SessionPage /> },
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add SessionPage with health controls, position bar, and session log"
```

---

### Task 12: Loot panel in session HUD

**Files:**
- Create: `src/components/campaign/LootPanel.tsx`
- Modify: `src/pages/SessionPage.tsx`

**Interfaces:**
- Consumes: `useCampaignStore` (`addLoot`, `equipSingleItem`), `GearItem`, `PartyMember`
- Produces: `LootPanel` component embedded in `SessionPage`

- [ ] **Step 1: Create `LootPanel`**

```tsx
// src/components/campaign/LootPanel.tsx
import { useState } from 'react'
import type { GearItem, GearCategory } from '@/types/gear'
import type { PartyMember } from '@/types/campaign'
import type { Character } from '@/types/character'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Package, Plus } from 'lucide-react'

const CATEGORIES: GearCategory[] = ['weapon', 'armor', 'core', 'relic', 'accessory', 'consumable']
const SINGLE_SLOTS = ['hand1', 'hand2', 'armor', 'core'] as const

interface LootPanelProps {
  loot: GearItem[]
  party: PartyMember[]
  characters: Character[]
  onAddLoot: (item: GearItem) => void
  onEquipSingle: (memberIndex: number, slot: typeof SINGLE_SLOTS[number], item: GearItem | null) => void
}

export function LootPanel({ loot, party, characters, onAddLoot, onEquipSingle }: LootPanelProps) {
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<GearCategory>('weapon')

  function handleAdd() {
    if (!newName.trim()) return
    onAddLoot({ id: crypto.randomUUID(), name: newName.trim(), category: newCategory })
    setNewName('')
  }

  return (
    <div className="space-y-3">
      {/* Add loot form */}
      <div className="flex gap-2">
        <Input
          placeholder="Item name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <Select value={newCategory} onValueChange={(v) => setNewCategory(v as GearCategory)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="icon" onClick={handleAdd}><Plus className="w-4 h-4" /></Button>
      </div>

      {/* Loot list */}
      {loot.length === 0 && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Package className="w-4 h-4" /> No loot found yet.
        </p>
      )}
      <div className="space-y-2">
        {loot.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2 border rounded-md px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium truncate">{item.name}</span>
              <Badge variant="outline" className="text-xs shrink-0">{item.category}</Badge>
            </div>
            {/* Quick equip to single slots only for now */}
            {SINGLE_SLOTS.includes(item.category as typeof SINGLE_SLOTS[number]) && party.length > 0 && (
              <Select
                onValueChange={(v) => {
                  const [memberIdx, slot] = v.split('|')
                  onEquipSingle(parseInt(memberIdx), slot as typeof SINGLE_SLOTS[number], item)
                }}
              >
                <SelectTrigger className="w-40 h-7 text-xs">
                  <SelectValue placeholder="Equip to..." />
                </SelectTrigger>
                <SelectContent>
                  {party.map((m, i) => {
                    const char = characters.find((c) => c.cardId === m.characterCardId)
                    return SINGLE_SLOTS.map((slot) => (
                      <SelectItem key={`${i}|${slot}`} value={`${i}|${slot}`}>
                        {char?.name ?? m.characterCardId} — {slot}
                      </SelectItem>
                    ))
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add LootPanel to SessionPage**

Add import to `SessionPage.tsx`:

```tsx
import { LootPanel } from '@/components/campaign/LootPanel'
```

Add this Card after the party grid, before the Session Log Card:

```tsx
{/* Loot */}
<Card>
  <CardHeader className="pb-2"><CardTitle>Party Loot</CardTitle></CardHeader>
  <CardContent>
    <LootPanel
      loot={campaign.loot}
      party={campaign.party}
      characters={characters}
      onAddLoot={(item) => addLoot(campaign.id, item)}
      onEquipSingle={(memberIndex, slot, item) =>
        equipSingleItem(campaign.id, memberIndex, slot, item)
      }
    />
  </CardContent>
</Card>
```

Also add `addLoot` and `equipSingleItem` to the destructure from `useCampaignStore()`:

```tsx
const { getCampaign, updatePosition, adjustHealth, addNote, addLoot, equipSingleItem } = useCampaignStore()
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add LootPanel to session HUD with add-loot and quick-equip"
```

---

## Phase 5: Build Tester

### Task 13: Dice calculation utility + Build Tester page

**Files:**
- Create: `src/utils/diceCalculations.ts`
- Create: `src/test/diceCalculations.test.ts`
- Create: `src/pages/BuildTesterPage.tsx`
- Create: `src/components/tester/StatSummary.tsx`
- Create: `src/components/tester/DiceSimulator.tsx`
- Modify: `src/routes/routes.tsx`

**Interfaces:**
- Consumes: `dice` from `@/assets/data/diceData`, `DiceColor`, `DiceFace`, `DiceSymbol` from `@/types/dice`; `useBuildStore`; `useCharacterStore`
- Produces: `averageDie(faces: DiceFace[]): DieAverage`, `calculatePool(colors: DiceColor[]): PoolResult`; `/builds/:buildId/test` route

- [ ] **Step 1: Write failing dice calculation tests**

```typescript
// src/test/diceCalculations.test.ts
import { averageDie, calculatePool } from '@/utils/diceCalculations'
import { dice } from '@/assets/data/diceData'

test('averageDie calculates correct mean value for purple', () => {
  // purple: [1, 2, 3, 5, 6, 7] → mean = 24/6 = 4
  const result = averageDie(dice.purple)
  expect(result.averageValue).toBeCloseTo(4, 5)
})

test('averageDie calculates symbol probabilities for purple', () => {
  // purple: shield on face 4, burst on face 5, book on face 6 → each 1/6
  const result = averageDie(dice.purple)
  expect(result.symbolProbs.shield).toBeCloseTo(1 / 6, 5)
  expect(result.symbolProbs.burst).toBeCloseTo(1 / 6, 5)
  expect(result.symbolProbs.book).toBeCloseTo(1 / 6, 5)
  expect(result.symbolProbs.skull).toBe(0)
})

test('calculatePool sums values from multiple dice', () => {
  // two purple dice: expected value = 2 × 4 = 8
  const result = calculatePool(['purple', 'purple'])
  expect(result.averageTotal).toBeCloseTo(8, 5)
})

test('calculatePool returns min and max values', () => {
  // purple: min face value = 1, max = 7
  const result = calculatePool(['purple'])
  expect(result.minTotal).toBe(1)
  expect(result.maxTotal).toBe(7)
})

test('averageDie handles dice with no value faces (black)', () => {
  // black die has no numeric values — just symbols
  const result = averageDie(dice.black)
  expect(result.averageValue).toBe(0)
  expect(result.symbolProbs.skull).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/test/diceCalculations.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create `src/utils/diceCalculations.ts`**

```typescript
// src/utils/diceCalculations.ts
import { dice as diceData } from '@/assets/data/diceData'
import type { DiceColor, DiceFace, DiceSymbol } from '@/types/dice'

export interface DieAverage {
  averageValue: number
  symbolProbs: Record<DiceSymbol, number>
}

export interface PoolResult {
  averageTotal: number
  symbolProbs: Record<DiceSymbol, number>
  minTotal: number
  maxTotal: number
}

export function averageDie(faces: DiceFace[]): DieAverage {
  const count = faces.length
  const symbolProbs: Record<DiceSymbol, number> = { book: 0, shield: 0, burst: 0, skull: 0 }

  let totalValue = 0
  for (const face of faces) {
    totalValue += face.value ?? 0
    if (face.symbols) {
      for (const sym of face.symbols) {
        symbolProbs[sym] += 1 / count
      }
    }
  }

  return { averageValue: totalValue / count, symbolProbs }
}

export function calculatePool(colors: DiceColor[]): PoolResult {
  const symbolProbs: Record<DiceSymbol, number> = { book: 0, shield: 0, burst: 0, skull: 0 }
  let averageTotal = 0
  let minTotal = 0
  let maxTotal = 0

  for (const color of colors) {
    const faces = diceData[color]
    const avg = averageDie(faces)
    averageTotal += avg.averageValue

    const faceValues = faces.map((f) => f.value ?? 0)
    minTotal += Math.min(...faceValues)
    maxTotal += Math.max(...faceValues)

    for (const sym of Object.keys(symbolProbs) as DiceSymbol[]) {
      symbolProbs[sym] += avg.symbolProbs[sym]
    }
  }

  return { averageTotal, symbolProbs, minTotal, maxTotal }
}
```

- [ ] **Step 4: Run tests to verify pass**

```bash
npm run test:run -- src/test/diceCalculations.test.ts
```

Expected: PASS (5 tests)

- [ ] **Step 5: Create `StatSummary` component**

```tsx
// src/components/tester/StatSummary.tsx
import type { Character } from '@/types/character'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatSummaryProps {
  character: Character | undefined
}

export function StatSummary({ character }: StatSummaryProps) {
  if (!character) {
    return (
      <Card>
        <CardContent className="pt-4 text-sm text-muted-foreground">
          Select a character to see stats.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Stats — {character.name}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Health', value: character.baseStats.health },
            { label: 'Defense', value: character.baseStats.defense },
            { label: 'Movement', value: character.baseStats.movement },
            { label: 'SP', value: character.sp },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border p-3 bg-muted/20">
              <p className="text-base font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2 text-center">
          {Object.entries(character.skillStats).map(([key, value]) => (
            <div key={key} className="rounded-lg border p-3 bg-muted/20">
              <p className="text-base font-bold">{value}</p>
              <p className="text-xs text-muted-foreground capitalize">{key}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 6: Create `DiceSimulator` component**

```tsx
// src/components/tester/DiceSimulator.tsx
import { useState } from 'react'
import type { DiceColor, DiceSymbol } from '@/types/dice'
import { calculatePool } from '@/utils/diceCalculations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Die } from '@/components/dice/Die'
import { X } from 'lucide-react'

const AVAILABLE_COLORS: DiceColor[] = ['purple', 'white', 'orange', 'teal', 'red', 'green', 'grey', 'blue', 'black']

const SYMBOL_LABELS: Record<DiceSymbol, string> = {
  shield: 'Shield',
  burst: 'Burst',
  book: 'Book',
  skull: 'Skull',
}

interface DiceSimulatorProps {
  initialDice?: DiceColor[]
}

export function DiceSimulator({ initialDice = [] }: DiceSimulatorProps) {
  const [pool, setPool] = useState<DiceColor[]>(initialDice)

  const result = pool.length > 0 ? calculatePool(pool) : null

  function addDie(color: DiceColor) {
    setPool((prev) => [...prev, color])
  }

  function removeDie(index: number) {
    setPool((prev) => prev.filter((_, i) => i !== index))
  }

  function clearPool() {
    setPool([])
  }

  return (
    <Card>
      <CardHeader><CardTitle>Dice Simulator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {/* Palette */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Add dice to pool:</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => addDie(color)}
                title={`Add ${color} die`}
                className="hover:scale-110 transition-transform"
              >
                <Die color={color} />
              </button>
            ))}
          </div>
        </div>

        {/* Pool */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">Current pool ({pool.length} dice):</p>
            {pool.length > 0 && (
              <Button size="sm" variant="ghost" onClick={clearPool}>Clear</Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 min-h-[48px]">
            {pool.map((color, i) => (
              <button
                key={i}
                onClick={() => removeDie(i)}
                title="Remove die"
                className="relative group"
              >
                <Die color={color} />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded text-white">
                  <X className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="rounded-lg border p-4 space-y-3 bg-muted/20">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold">{result.averageTotal.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Average</p>
              </div>
              <div>
                <p className="text-xl font-bold">{result.minTotal}</p>
                <p className="text-xs text-muted-foreground">Min</p>
              </div>
              <div>
                <p className="text-xl font-bold">{result.maxTotal}</p>
                <p className="text-xs text-muted-foreground">Max</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(SYMBOL_LABELS) as DiceSymbol[]).map((sym) => {
                const prob = result.symbolProbs[sym]
                if (prob === 0) return null
                return (
                  <Badge key={sym} variant="outline">
                    {SYMBOL_LABELS[sym]}: {(prob * 100).toFixed(0)}% avg {prob.toFixed(2)}/roll
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 7: Create `BuildTesterPage`**

```tsx
// src/pages/BuildTesterPage.tsx
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useBuildStore } from '@/stores/build'
import { useCharacterStore } from '@/stores/character'
import { StatSummary } from '@/components/tester/StatSummary'
import { DiceSimulator } from '@/components/tester/DiceSimulator'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ratingToColor } from '@/utils/diceUtils'
import type { DiceColor } from '@/types/dice'

export default function BuildTesterPage() {
  const { buildId } = useParams<{ buildId: string }>()
  const { getBuild } = useBuildStore()
  const { characters } = useCharacterStore()

  const build = getBuild(buildId ?? '')
  const character = characters.find((c) => c.cardId === build?.characterCardId)

  // Pre-seed the dice simulator with the character's conviction dice
  const initialDice: DiceColor[] = character
    ? character.conviction.map(ratingToColor).filter((d): d is DiceColor => d !== null)
    : []

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        {build && (
          <Button size="sm" variant="outline" asChild>
            <Link to={`/builds/${build.id}`}><ArrowLeft className="w-4 h-4 mr-1" /> Back to Build</Link>
          </Button>
        )}
        <h1 className="text-2xl font-bold">
          {build ? `${build.name} — Tester` : 'Build Tester'}
        </h1>
      </div>

      <StatSummary character={character} />
      <DiceSimulator initialDice={initialDice} />
    </div>
  )
}
```

- [ ] **Step 8: Add tester route**

```typescript
// src/routes/routes.tsx — add:
import BuildTesterPage from '@/pages/BuildTesterPage'

{ path: '/builds/:buildId/test', element: <BuildTesterPage /> },
```

- [ ] **Step 9: Run all tests**

```bash
npm run test:run
```

Expected: PASS (all tests)

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add BuildTesterPage with dice simulator and stat summary"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Foundation cleanup — Tasks 1–3
- ✅ Persistence (localStorage + JSON export/import) — Tasks 4–6
- ✅ Build system (gear slots, disciplines, consumables, notes) — Tasks 7–9
- ✅ Campaign tracker (party, health, position, loot pool, auto log, manual notes) — Tasks 10–12
- ✅ Build tester (stat summary, dice simulator, pre-seeded from build) — Task 13
- ✅ IDs via `crypto.randomUUID()` — used in `newBuild`, `newCampaign`, `autoLog`, `noteLog`, `LootPanel`
- ✅ Save file version `"1"` — `SaveFile` type and `parseSaveFile`
- ✅ Dynamic breadcrumbs — Task 2
- ✅ NavLink active state — Task 2
- ✅ Conviction/casting dice fix — Task 3

**Type consistency check:**
- `BuildGear` defined in `src/types/gear.ts`, used in `Build` (build.ts), `PartyMember` (campaign.ts), `GearSlotGrid`, `CampaignSetupPage`, `LootPanel`
- `emptyBuildGear()` used in `CampaignSetupPage` — exported from `src/types/gear.ts`
- `ratingToColor` used in `CharacterDetailsPage` and `BuildTesterPage` — both import from `@/utils/diceUtils`
- `useCampaignStore` methods referenced in `SessionPage`: `getCampaign`, `updatePosition`, `adjustHealth`, `addNote`, `addLoot`, `equipSingleItem` — all defined in `src/stores/campaign.ts`

**No placeholder scan:** No TBD, TODO, or "implement later" found.
