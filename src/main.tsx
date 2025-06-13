import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './AuthContext';
import './index.css';
import { LevelProvider } from './LevelContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/lol-matchup-web">
      <AuthProvider>
        <LevelProvider>
          <App />
        </LevelProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);