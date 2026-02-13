// Client-side API key usage removed in favor of server-side API call

export interface Competitor {
    name: string;
    price: string;
    features: string;
    audience: string;
}

export async function fetchCompetitorAnalysis(productDescription: string): Promise<Competitor[]> {
    console.log("DEBUG: fetchCompetitorAnalysis called via Server API");

    if (!productDescription) return [];

    try {
        const response = await fetch('/api/market-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: productDescription }),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API Error: ${response.status}`);
            } else {
                if (response.status === 404) {
                    console.warn("API route not found (404). If running locally with Vite, this is expected.");
                    throw new Error("API_ROUTE_NOT_FOUND");
                }
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();

        if (data.analysis) {
            console.log("Gemini Analysis:", data.analysis);
            return [{ name: "Analysis", price: "", features: data.analysis, audience: "" }];
        } else if (Array.isArray(data)) {
            return data;
        } else {
            console.error("Invalid data format received:", data);
            throw new Error("Invalid data format from API");
        }

    } catch (error: any) {
        console.error("Market Analysis Service Error:", error);
        throw error;
    }
}