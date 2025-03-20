import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppDataProvider } from './context/app-data.tsx'
import "./index.css"
import { ThemeProvider } from './providers/theme.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <AppDataProvider>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </AppDataProvider>
  // </StrictMode>,
)
