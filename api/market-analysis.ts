import { generateText } from 'ai';

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

        // Server-side Logic: Try Specific Flash 001, then generic Flash, then Pro
        const models = ['google:gemini-1.5-flash-001', 'google:gemini-1.5-flash', 'google:gemini-pro'];
        let lastError;

        // Log API Key Prefix (Securely)
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GOOGLE_API_KEY;
        console.log(`API Key configured: ${apiKey ? (apiKey.substring(0, 4) + '...') : 'MISSING'}`);

        for (const modelName of models) {
            try {
                console.log(`Server API attempting model: ${modelName}`);
                const result = await generateText({
                    model: modelName,
                    prompt: prompt,
                });
                return res.status(200).json({ analysis: result.text });
            } catch (e: any) {
                console.warn(`Server API failed with ${modelName}:`, e.message);
                lastError = e;
            }
        }

        throw lastError;
    } catch (error) {
        console.error('Error calling Gemini (Server):', error);
        return res.status(500).json({ error: 'Failed to analyze market. All models failed.' });
    }
}