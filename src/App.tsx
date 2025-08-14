import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { MainLayout } from "@/components/layout/MainLayout";
import ThemeProvider from "./components/layout/ThemeProvider";

function App() {
  const element = useRoutes(routes);

  return (
    <ThemeProvider>
      <MainLayout breadcrumb="Builder > Example">
        {element}
      </MainLayout>
    </ThemeProvider>
  );
}

export default App