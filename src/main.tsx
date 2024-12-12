import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useLanguageStore } from './store/languageStore';
import App from './App.tsx';
import './index.css';

// Initialize the language store
const initializeApp = () => {
  const { isLoaded } = useLanguageStore.getState();
  
  if (!isLoaded) {
    useLanguageStore.setState({ isLoaded: true });
  }
  
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

initializeApp();