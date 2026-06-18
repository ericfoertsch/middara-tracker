# MiddaraTracker Modernization Design

**Date:** 2026-06-18  
**Status:** Approved  
**Scope:** Foundation cleanup, persistence layer, build system, campaign tracker, build tester

---

## Overview

MiddaraTracker is a personal companion app for the Middara board game. The current state has a working character browser, discipline tree viewer, and tag lookup, but lacks persistence, a home route, proper breadcrumbs, and the three core features needed to use the app at the table: builds, campaign tracking, and a build testing sandbox.

This design covers:
1. Cleaning up existing rough edges
2. Adding a persistence layer (localStorage + JSON export/import)
3. A build system (character + gear + disciplines)
4. A campaign tracker (party health, campaign position, loot pool, event log)
5. A build tester (dice math sandbox)

---

## Section 1: Foundation Cleanup

Fix existing issues before adding anything new.

### Changes

| Issue | Fix |
|---|---|
| `TestPage` named incorrectly | Rename file, component, and route to `CharactersPage` |
| Dead sidebar link `/dashboard/dashboard2` | Replace with `/` home route |
| No root route | Add `/` → `HomePage` (dashboard landing) |
| `BreadcrumbNav` hardcoded | Wire to React Router `useMatches` with route `handle.breadcrumb` labels |
| Dice hardcoded on `CharacterDetailsPage` | Read conviction/casting dice from character data |
| Store loaders are fake async | Simplify `loadCharacters`, `loadDisciplineTrees`, `loadTags` to synchronous initialization |
| Unused `breadcrumb` prop on `MainLayout` | Remove the prop |

### Breadcrumb Strategy

Each route object gets a `handle` with a `breadcrumb` label. `BreadcrumbNav` reads `useMatches()` and renders the chain. Dynamic segments (e.g. character name, build name) resolve from store state by matching the URL param.

---

## Section 2: Persistence Layer

### Principles

- **Game data** (adventurers, discipline trees, tags) — static JSON imports, never written to storage
- **User data** (builds, campaigns) — Zustand stores with `persist` middleware, backed by `localStorage`
- **Portability** — export/import via a single `middara-save.json` file

### Save File Shape

```typescript
interface SaveFile {
  version: "1"
  exportedAt: string
  builds: Build[]
  campaigns: Campaign[]
}
```

The `version` field enables future migrations without breaking saved data.

### New Stores

| Store | Purpose | Persisted |
|---|---|---|
| `useBuildStore` | CRUD for builds | Yes — localStorage key `middara-builds` |
| `useCampaignStore` | CRUD for campaigns | Yes — localStorage key `middara-campaigns` |

Existing stores (`useCharacterStore`, `useDisciplineStore`, `useRuleStore`) remain but drop their fake async loaders.

### Export / Import

- **Export:** serializes both stores to `SaveFile`, triggers a browser download of `middara-save.json`
- **Import:** reads a `SaveFile`, validates the version field, merges or replaces store contents
- Both are available from the Settings page

---

## Section 3: Build System

A build is a pre-planned or snapshot character loadout — the reference record for how a character is configured.

### Types

```typescript
interface Build {
  id: string                          // crypto.randomUUID()
  name: string
  characterCardId: string
  gear: BuildGear
  unlockedDisciplineNodes: string[]   // AbilityNode IDs
  consumables: string[]               // item names for now, typed later when gear data is complete
  notes: string
  createdAt: string
  updatedAt: string
}

interface BuildGear {
  hand1: GearItem | null
  hand2: GearItem | null
  armor: GearItem | null
  core: GearItem | null
  relics: (GearItem | null)[]         // minimum 3 slots
  accessories: (GearItem | null)[]    // minimum 1 slot
}

interface GearItem {
  id: string
  name: string
  category: 'weapon' | 'armor' | 'core' | 'relic' | 'accessory' | 'consumable'
}
```

Gear item data (full item catalog) is imported later without requiring changes to the type structure or gear slot layout.

### Routes

| Route | Page | Purpose |
|---|---|---|
| `/builds` | `BuildsPage` | List all builds, create new, delete |
| `/builds/:buildId` | `BuildEditorPage` | Edit character, gear slots, disciplines, consumables, notes |
| `/builds/:buildId/test` | `BuildTesterPage` | Dice math sandbox (see Section 5) |

### Build Editor Layout

- **Header:** build name (editable), character picker
- **Gear section:** visual slot grid (hand1, hand2, armor, core, relics[], accessories[])
- **Disciplines section:** the 5 trees in tabs, nodes selectable per-build
- **Consumables section:** add/remove text entries for now
- **Notes:** free text
- **Actions:** Save, Delete, Open Tester

### Discipline Reference

The existing `/disciplines` route stays as a read-only reference browser. The build editor embeds the same discipline tree UI but with selections bound to the build's `unlockedDisciplineNodes`.

---

## Section 4: Campaign Tracker

The campaign tracker is the live table companion. It tracks party state and campaign progress during play.

### Types

```typescript
interface Campaign {
  id: string                  // crypto.randomUUID()
  name: string
  position: CampaignPosition
  party: PartyMember[]
  loot: GearItem[]            // items found, available to equip
  log: LogEntry[]
  createdAt: string
  updatedAt: string
}

interface CampaignPosition {
  chapter: string
  page: number
  mission: string
}

interface PartyMember {
  characterCardId: string
  buildId: string | null      // optional starting template
  gear: BuildGear             // live equipped state — managed here, not in Build
  unlockedDisciplineNodes: string[]
  currentHealth: number
  maxHealth: number
  status: 'active' | 'injured' | 'missing'
  notes: string
}

interface LogEntry {
  id: string                  // crypto.randomUUID()
  timestamp: string
  text: string
  type: 'auto' | 'note'       // auto = system-generated, note = user-written
}
```

### Routes

| Route | Page | Purpose |
|---|---|---|
| `/campaigns` | `CampaignsPage` | List campaigns, create new |
| `/campaigns/:campaignId` | `CampaignSetupPage` | Configure party, set starting position |
| `/campaigns/:campaignId/session` | `SessionPage` | Live HUD during play |

### Session HUD Layout

Designed for use at the table — large touch targets, minimal clicks to update state.

- **Position bar:** Chapter / Page / Mission — inline editable
- **Party panel:** one card per member showing name, current/max health with +/− buttons, status badge, equipped gear summary
- **Gear management:** equip items from loot pool to party member slots; auto-logs the change
- **Log panel:** scrollable event log at the bottom; auto entries + a quick manual note input at the top of the panel

### Auto Log Triggers

The system writes a log entry automatically when:
- A party member takes damage or heals
- A party member's status changes
- A loot item is added to the campaign pool
- A loot item is equipped to a party member
- Campaign position (chapter/page/mission) changes

Manual notes are free-text, timestamped, and rendered visually distinct from auto entries in the log.

### Gear Flow

```
Loot found → added to Campaign.loot (auto-logged)
    ↓
Equipped to PartyMember.gear (auto-logged)
    ↓
Available in Build Tester when imported from campaign
```

---

## Section 5: Build Tester

A non-persisted sandbox for theorycrafting builds and calculating dice outcomes.

### Entry Modes

| Mode | Source |
|---|---|
| Import from build | Loads a saved build as starting point |
| Import from campaign member | Loads a party member's live gear + disciplines |
| Free mode | Start blank, pick any character |

### Gear Filter

When imported from a campaign, a toggle controls which gear is selectable:
- **Campaign loot only** — only items in `Campaign.loot` (default when imported from campaign)
- **All gear** — full item catalog (available once gear data is imported)

### What It Shows

- **Stat totals** — character base stats + gear bonuses + discipline bonuses
- **Dice simulator** — select a dice pool, shows:
  - Average result per symbol type
  - Symbol probability distribution
  - Expected SP generation
  - Best / worst case ranges
- **SP economy** — SP generated per action vs. SP cost of key discipline abilities

The tester is a scratchpad only — changes are not saved unless the user explicitly exports a snapshot as a new build.

---

## Navigation (Final Sidebar)

```
Home            /
Campaigns       /campaigns
Builds          /builds
Characters      /characters
Disciplines     /disciplines
Tags            /tags
Settings        /settings
```

---

## ID Strategy

| Entity | ID type | Generation |
|---|---|---|
| Build | `string` (GUID) | `crypto.randomUUID()` |
| Campaign | `string` (GUID) | `crypto.randomUUID()` |
| LogEntry | `string` (GUID) | `crypto.randomUUID()` |
| GearItem | `string` | From game data JSON |
| Character | `string` (cardId) | From game data JSON |
| AbilityNode | `string` | From game data JSON |

Share codes are a future extension — the GUID is already the right shape.

---

## Implementation Order

1. Foundation cleanup (Section 1)
2. Persistence layer + new stores (Section 2)
3. Build system — types, store, routes, editor UI (Section 3)
4. Campaign tracker — types, store, routes, session HUD (Section 4)
5. Build tester — sandbox page, dice math (Section 5)

Each phase is independently shippable. Game data (gear catalog) is imported as a separate parallel task that doesn't block any phase.
