import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface Competitor {
    name: string;
    price_monthly: string;
    differentiation: string;
}

// Mock data to return if API key is missing or request fails
const MOCK_COMPETITORS: Competitor[] = [
    {
        name: "Competitor A (Mock)",
        price_monthly: "$500/month",
        differentiation: "Established market leader with high brand recognition."
    },
    {
        name: "Competitor B (Mock)",
        price_monthly: "$250/month",
        differentiation: "Low-cost alternative with basic features."
    },
    {
        name: "Competitor C (Mock)",
        price_monthly: "Quote-based",
        differentiation: "Enterprise-focused solution with custom integrations."
    }
];

export async function fetchCompetitorAnalysis(productDescription: string): Promise<Competitor[]> {
    console.log("DEBUG: fetchCompetitorAnalysis called with:", productDescription);

    console.log("DEBUG: Environment Check");
    console.log("- Mode:", import.meta.env.MODE);
    console.log("- API Key Loaded?", !!import.meta.env.VITE_GEMINI_API_KEY);

    const hasKey = !!API_KEY;
    console.log("DEBUG: Gemini API Key Loaded?", hasKey);
    console.log("Current Key Value:", import.meta.env.VITE_GEMINI_API_KEY);

    if (!productDescription) return [];

    if (!API_KEY) {
        console.warn("Gemini API Key missing. Returning mock data.");
        return MOCK_COMPETITORS;
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);

        // Switch to the latest flash model which is faster and cheaper
        // Ensure @google/generative-ai is on the latest version
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-001",
            generationConfig: { responseMimeType: "application/json" }
        });

        // DEBUG: Initialization Diagnostic
        try {
            console.log("Model initialized: gemini-1.5-flash-001");
        } catch (e) { console.error("Initialization Check Failed:", e); }

        // DEBUG: Check available models if 404 persists
        // try {
        //     // Note: listModels might not be available on the client SDK directly depending on version/auth
        //     // This is just a placeholder if we need deep debugging later.
        //     // console.log("Checking model availability...");
        // } catch (e) { console.log("Could not list models", e); }

        const prompt = `Analyze the market for a product described as: '${productDescription}'.
        Identify 3 real-world competitors. For each, strictly provide:
        1. Name
        2. Estimated Selling Price (e.g., '$500/unit', '$50/mo', or 'Quote-based ~5k')
        3. Key Differentiator
        
        Return the result as a strict JSON array with fields: 
        - 'name' (string)
        - 'price_monthly' (string) - Use this field for the 'Estimated Selling Price'
        - 'differentiation' (string)
        
        Do not include markdown formatting like \`\`\`json. Just the raw JSON array.`;

        console.log("DEBUG: Sending request to Gemini...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("DEBUG: Gemini Raw Text Response:", text);

        // Clean up potential markdown code blocks if Gemini adds them despite instructions
        // Even with responseMimeType="application/json", safe parsing is good practice
        const cleanText = text.replace(/```json|```/g, '').trim();

        const competitors = JSON.parse(cleanText) as Competitor[];

        // Basic validation
        if (Array.isArray(competitors) && competitors.length > 0 && competitors[0].name) {
            return competitors.slice(0, 3);
        } else {
            console.error("Invalid response format (not array or empty):", competitors);
            throw new Error("Received invalid JSON data structure from API.");
        }

    } catch (error: any) {
        console.error("DEBUG: Gemini API Error Details:", error);

        // Improve error message for common issues
        let errorMessage = error.message || "Unknown error occurred";

        // Handle 404 specifically by falling back to mock data
        if (errorMessage.includes("404") || errorMessage.includes("not found")) {
            console.warn("Model not found (404). Falling back to mock data.");
            return MOCK_COMPETITORS;
        }

        if (errorMessage.includes("403") || errorMessage.includes("API key")) {
            errorMessage = "Invalid API Key or Permissions Denied (403).";
        } else if (errorMessage.includes("Failed to fetch")) {
            errorMessage = "Network Error: Could not connect to Google API. Check your internet connection.";
        } else if (errorMessage.includes("candidate")) {
            errorMessage = "Safety filter triggered. Please try a different description.";
        }

        throw new Error(errorMessage);
    }
}
