import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setLocales } from '../main/setLocales';
import { App } from './components/App';
import { GalleryContextProvider, KeyBindContextProvider } from './providers';

const initLocale = async () => {
  const locale = await window.myAPI.getLocale();
  setLocales(locale);
};

initLocale();

createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <GalleryContextProvider>
      <KeyBindContextProvider>
        <App />
      </KeyBindContextProvider>
    </GalleryContextProvider>
  </StrictMode>,
);
