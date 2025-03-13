import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='40371258979-h64808qgjfgng3ring8uug02orbj6sf9.apps.googleusercontent.com'>
  <React.StrictMode>
   
    <App />
  </React.StrictMode>
  </GoogleOAuthProvider>
)
