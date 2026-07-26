import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import MetaPixelInit from './components/MetaPixelInit';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetaPixelInit />
    <App />
  </StrictMode>,
);
