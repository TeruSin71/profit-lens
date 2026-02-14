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
        // Using "gemini-2.0-flash" as confirmed available by diagnostics (Step: 2120)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const promptText = analysisPrompt || productDescription;
        console.log("Using gemini-2.0-flash...");

        const result = await model.generateContent(promptText);
        const analysis = result.response.text();

        console.log("Gemini Analysis Result:", analysis.substring(0, 50) + "...");

        return {
            competitors: [{ name: "Market Analysis", price: "Live", features: analysis, audience: "General" }],
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