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
