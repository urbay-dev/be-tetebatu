import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Toaster } from 'react-hot-toast'

for (const [family, file] of [['Libre Franklin', 'libre-franklin'], ['Source Serif 4', 'source-serif-4']]) {
  const font = new FontFace(family, `url(/fonts/${file}.woff2)`, { weight: '100 900', display: 'swap' });
  document.fonts.add(font);
  void font.load().catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-center" />
  </StrictMode>,
)
