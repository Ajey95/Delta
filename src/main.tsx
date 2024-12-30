import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './pages/app1.tsx';  // Import the App component
//import Dashboard from './pages/dashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

