import { GoogleGenerativeAI } from "@google/generative-ai";

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
    console.log("DEBUG: fetchCompetitorAnalysis called");

    if (!productDescription) return { competitors: [], source: 'cached' };

    try {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

        if (!apiKey) {
            throw new Error("Google API Key is not configured");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = analysisPrompt || productDescription;
        const result = await model.generateContent(prompt);
        const analysis = result.response.text();

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