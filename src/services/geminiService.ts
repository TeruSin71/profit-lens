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
        price_monthly: "$55.00",
        differentiation: "Established brand, but legacy tech stack."
    },
    {
        name: "Competitor B (Mock)",
        price_monthly: "$45.00",
        differentiation: "Cheaper initial cost, but higher support fees."
    },
    {
        name: "Competitor C (Mock)",
        price_monthly: "$60.00",
        differentiation: "Premium positioning with extensive features."
    }
];

export async function fetchCompetitors(productDescription: string): Promise<Competitor[]> {
    if (!API_KEY) {
        console.warn("Gemini API Key missing. Returning mock data.");
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return MOCK_COMPETITORS;
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Acting as a pricing analyst, find 3 real-world competitors for this product description: '${productDescription}'. 
        Return ONLY a JSON array with fields: 'name', 'price_monthly' (string example: '$10.00'), and 'differentiation' (short string max 10 words).
        Do not include markdown formatting like \`\`\`json. Just the raw JSON array.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks if Gemini adds them despite instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const competitors = JSON.parse(cleanText) as Competitor[];

        // Basic validation
        if (Array.isArray(competitors) && competitors.length > 0 && competitors[0].name) {
            return competitors.slice(0, 3);
        } else {
            throw new Error("Invalid response format");
        }

    } catch (error) {
        console.error("Error fetching competitors from Gemini:", error);
        return MOCK_COMPETITORS;
    }
}
