import type { RouteObject } from 'react-router-dom';
import TestPage from "@/pages/TestPage";

export const routes: RouteObject[] = [
  { path: "/builder", element: <TestPage /> }
];
