// api/market-analysis.ts
import { generateText } from 'ai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;

        const result = await generateText({
            model: 'google/gemini-3-flash',
            prompt: prompt,
        });

        return res.status(200).json({ analysis: result.text });
    } catch (error) {
        console.error('Error calling Gemini:', error);
        return res.status(500).json({ error: 'Failed to analyze market' });
    }
}