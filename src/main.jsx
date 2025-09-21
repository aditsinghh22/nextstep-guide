// File: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import NextStepGuideApp from './app.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="218821531889-uq913c745ggh6mt65se6d3jg97i53jhd.apps.googleusercontent.com">
      <NextStepGuideApp />
    </GoogleOAuthProvider>
  </React.StrictMode> 
);