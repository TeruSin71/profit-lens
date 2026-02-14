
const apiKey = process.env.VITE_GOOGLE_API_KEY || "AIzaSyCMkRrn25KZhztCcoBuPmK12QwYIL4UuCQ";

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("Error listing models:", data.error);
            return;
        }

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(model => {
                if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${model.name}`);
                }
            });
        } else {
            console.log("No models found or unexpected format:", data);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

listModels();
