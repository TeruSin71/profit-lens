export interface Competitor {
    name: string;
    price: string;
    features: string;
    audience: string;
}

export interface AnalysisResult {
    competitors: Competitor[];
    source: 'live' | 'cached';
    cachedAt?: string;
    error?: string;
}

export async function fetchCompetitorAnalysis(
    productDescription: string,
    analysisPrompt?: string
): Promise<AnalysisResult> {
    console.log("DEBUG: fetchCompetitorAnalysis called via AI Gateway");

    if (!productDescription) return { competitors: [], source: 'cached' };

    try {
        const apiKey = import.meta.env.VITE_AI_GATEWAY_API_KEY;

        if (!apiKey) {
            throw new Error("AI Gateway API Key is not configured");
        }

        const prompt = analysisPrompt || productDescription;

        const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash',
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`AI Gateway error: ${response.statusText}`);
        }

        const data = await response.json();
        const analysis = data.choices[0].message.content;

        console.log("Gemini Analysis:", analysis);

        return {
            competitors: [{ name: "Market Analysis", price: "", features: analysis, audience: "" }],
            source: 'live',
            cachedAt: new Date().toISOString()
        };

    } catch (error: any) {
        console.error("Market Analysis Service Error:", error);
        return {
            competitors: [],
            source: 'cached',
            error: error.message || "Failed to fetch analysis"
        };
    }
}