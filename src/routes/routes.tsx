import type { RouteObject } from 'react-router-dom';
import TestPage from "@/pages/TestPage";
import SettingPage from '@/pages/SettingsPage';

export const routes: RouteObject[] = [
  { path: "/builder", element: <TestPage /> },
  { path: "/settings", element: <SettingPage /> }
];
