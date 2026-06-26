import { useRoutes } from "react-router-dom"
import { routes } from "./routes/routes"
import { MainLayout } from "@/components/layout/MainLayout"
import ThemeProvider from "./components/layout/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"

function App() {
  const element = useRoutes(routes)

  return (
    <ThemeProvider>
      <MainLayout>
        {element}
      </MainLayout>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
