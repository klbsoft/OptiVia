import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// import Management from './pages/manager/Manager.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
    {/* <Management /> */}
  </StrictMode>,
)
