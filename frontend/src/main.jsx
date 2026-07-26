import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VisitorProvider } from './context/VisitorContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
<<<<<<< HEAD
import './i18n'
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <VisitorProvider>
          <App />
        </VisitorProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
