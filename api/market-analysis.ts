import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
    req: any,
    res: any
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // 1. Authenticate with Google SDK (Installed: @google/generative-ai)
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GOOGLE_API_KEY;
        console.log(`API Key configured: ${apiKey ? (apiKey.substring(0, 4) + '...') : 'MISSING'}`);

        if (!apiKey) {
            throw new Error("Server API Key missing. Set GOOGLE_GENERATIVE_AI_API_KEY or VITE_GOOGLE_API_KEY.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // 2. Simplified Logic: Use 'gemini-2.0-flash' (Confirmed Available)
        const modelName = "gemini-2.0-flash";

        try {
            console.log(`Server API attempting model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);

            const text = result.response.text();
            if (text) {
                return res.status(200).json({ analysis: text });
            } else {
                throw new Error("Empty response from AI");
            }
        } catch (e: any) {
            console.warn(`Server API failed with ${modelName}:`, e.message);
            throw e;
        }

    } catch (error: any) {
        console.error('Error calling Gemini (Server):', error);
        return res.status(500).json({ error: `Failed to analyze: ${error.message}` });
    }
}