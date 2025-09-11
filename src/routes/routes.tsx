import type { RouteObject } from 'react-router-dom';
import TestPage from "@/pages/TestPage";
import SettingPage from '@/pages/SettingsPage';
import CharacterDetailsPage from '@/pages/CharacterDetailsPage';
import TagLookupPage from '@/pages/TagLookupPage';

export const routes: RouteObject[] = [
  { path: "/characters", element: <TestPage /> },
  { path: "/tags", element: <TagLookupPage /> },
  { path: "/settings", element: <SettingPage /> },
  { path: "/characters/:cardId", element: <CharacterDetailsPage /> }
];
