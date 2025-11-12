import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <GoogleOAuthProvider
                clientId="462745267781-5btj2aavqgvj064jlcu7kpdj6uojvfvp.apps.googleusercontent.com">
                <App />
            </GoogleOAuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);