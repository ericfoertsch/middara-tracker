import type { RouteObject } from 'react-router-dom';
import TestPage from "@/pages/TestPage";
import SettingPage from '@/pages/SettingsPage';
import CharacterDetailsPage from '@/pages/CharacterDetailsPage';

export const routes: RouteObject[] = [
  { path: "/characters", element: <TestPage /> },
  { path: "/settings", element: <SettingPage /> },
  { path: "/characters/:name", element: <CharacterDetailsPage /> }
];
