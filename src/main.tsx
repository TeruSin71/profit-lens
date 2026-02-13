import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log("Clerk Key Loaded:", !!PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
    console.error("Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables");
    // fail silently or show a better error, but for now strict mode will catch it
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <App />
        </ClerkProvider>
    </React.StrictMode>,
)
