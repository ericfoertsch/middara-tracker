import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { MainLayout } from "@/components/layout/MainLayout";

function App() {
  const element = useRoutes(routes);

  return (
    <MainLayout breadcrumb="Builder > Example">
      {element}
    </MainLayout>
  );
}

export default App