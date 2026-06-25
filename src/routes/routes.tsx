import type { RouteObject } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import CharactersPage from '@/pages/CharactersPage'
import SettingPage from '@/pages/SettingsPage'
import CharacterDetailsPage from '@/pages/CharacterDetailsPage'
import TagLookupPage from '@/pages/TagLookupPage'
import DisciplineTreePage from '@/pages/DisciplineTreePage'
import BuildsPage from '@/pages/BuildsPage'
import BuildEditorPage from '@/pages/BuildEditorPage'
import CampaignsPage from '@/pages/CampaignsPage'
import CampaignSetupPage from '@/pages/CampaignSetupPage'

export const routes: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  { path: "/characters", element: <CharactersPage /> },
  { path: "/characters/:cardId", element: <CharacterDetailsPage /> },
  { path: "/tags", element: <TagLookupPage /> },
  { path: "/settings", element: <SettingPage /> },
  { path: "/disciplines", element: <DisciplineTreePage /> },
  { path: "/builds", element: <BuildsPage /> },
  { path: "/builds/:buildId", element: <BuildEditorPage /> },
  { path: "/campaigns", element: <CampaignsPage /> },
  { path: "/campaigns/:campaignId", element: <CampaignSetupPage /> },
]
