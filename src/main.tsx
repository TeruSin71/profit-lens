import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider.tsx'

import { GoogleGenerativeAI } from "@google/generative-ai";

// Expose Debug Tool for Console
(window as any).debugGemini = async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    console.log(`[Debug] Checking API Key: ${apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING'}`);

    if (!apiKey) return;

    const genAI = new GoogleGenerativeAI(apiKey);

    // 1. Try a simple "models/gemini-pro" ping
    try {
        console.log("[Debug] Pinging gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello?");
        console.log("[Debug] Success! Response:", result.response.text());
    } catch (e: any) {
        console.error("[Debug] Flash Failed:", e.message);
    }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider storageKey="profit-lens-theme">
            <App />
        </ThemeProvider>
    </React.StrictMode>,
)
