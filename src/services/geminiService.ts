// Client-side API key usage removed in favor of server-side API call

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



async function fetchWithTimeout(url: string, options: RequestInit, timeout = 15000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

export async function fetchCompetitorAnalysis(productDescription: string, prompt?: string): Promise<AnalysisResult> {
    if (!productDescription) return { competitors: [], source: 'live' };

    const effectivePrompt = prompt || productDescription;
    const MAX_RETRIES = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Attempt ${attempt} to fetch market analysis...`);

            const response = await fetchWithTimeout('/api/market-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: effectivePrompt, productDescription })
            }, 30000); // 30s Timeout

            if (!response.ok) {
                // Handle 404 specially (Local Dev fallback)
                if (response.status === 404) {
                    console.warn("Backend API not found (404). Switching to Client-Side Fallback.");
                    const clientData = await fetchCompetitorAnalysisClientSide(effectivePrompt, productDescription);
                    return { competitors: clientData, source: 'live' };
                }

                // Handle 503/504 for Retry
                if (response.status === 503 || response.status === 504 || response.status === 502) {
                    console.warn(`Attempt ${attempt} failed with ${response.status}. Retrying...`);
                    if (attempt < MAX_RETRIES) {
                        await new Promise(res => setTimeout(res, 1000 * attempt)); // Exponential backoff-ish
                        continue;
                    }
                }

                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API Error: ${response.status}`);
            }

            const data = await response.json();
            return { competitors: parseGeminiResponse(data), source: 'live' };

        } catch (error: any) {
            console.error(`Attempt ${attempt} error:`, error);
            lastError = error;

            if (error.name === 'AbortError') {
                console.warn("Request timed out.");
            }

            // If local client key exists, try that before giving up entirely (even if not 404)
            // But valid backend error should probably retry.
            // If we are out of retries, we break.
            if (attempt < MAX_RETRIES) {
                await new Promise(res => setTimeout(res, 1000 * attempt));
            }
        }
    }

    // specific fallback for Client Side if backend is completely unreachable (e.g. network error, not just 404)
    if (import.meta.env.VITE_GEMINI_API_KEY) {
        try {
            console.log("All backend retries failed. Attempting Client-Side Fallback...");
            const clientData = await fetchCompetitorAnalysisClientSide(effectivePrompt, productDescription);
            return { competitors: clientData, source: 'live' };
        } catch (clientError) {
            console.error("Client fallback also failed:", clientError);
        }
    }

    // Final Fallback: Throw Error if all else fails
    console.error("All attempts failed. Service unavailable.");
    throw new Error(lastError?.message || "Service Unavailable. Please check your connection or API key.");
}

// --- Client-Side Fallback Implementation ---
import { GoogleGenerativeAI } from '@google/generative-ai';

async function fetchCompetitorAnalysisClientSide(prompt: string, productDescription: string): Promise<Competitor[]> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Missing VITE_GEMINI_API_KEY for client-side fallback.");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You are a market research expert. Analyze the product description and return a list of 3 real-world competitors. 
            Return ONLY a raw JSON array of objects. Do not use Markdown code blocks. 
            Each object must have:
            - name: string
            - price: string (monthly price with currency)
            - features: string (comma-separated key features)
            - audience: string (target user segment)`
        });

        const userContent = `Product: ${productDescription}\n\nUser Request: ${prompt || "Analyze top 3 competitors"}`;

        // Client side might not support signal directly easily without wrapper, 
        // but let's assume standard fetch inside SDK uses it or just rely on default.
        const result = await model.generateContent(userContent);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        return parseGeminiResponse(JSON.parse(text));
    } catch (error) {
        console.error("Client-Side Gemini Error:", error);
        throw error;
    }
}

function parseGeminiResponse(data: any): Competitor[] {
    if (data.analysis) {
        return [{ name: "Analysis", price: "", features: typeof data.analysis === 'string' ? data.analysis : JSON.stringify(data.analysis), audience: "" }];
    } else if (Array.isArray(data)) {
        return data;
    }
    throw new Error("Invalid data format received from Gemini");
}