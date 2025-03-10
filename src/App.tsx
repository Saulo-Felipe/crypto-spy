import { useEffect } from "react";
import { Header } from "./components/header";
import { TableContent } from "./components/table-content";
import { useTheme } from "./providers/theme";

export default function App() {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme("dark")
  }, [])

  return (
    <main className="w-[400px] h-[500px] border">
      <Header />
      <TableContent />
    </main>
  )
}
