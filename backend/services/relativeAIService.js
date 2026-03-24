const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Service to simulate the "Annoying Indian Relative" persona
 */
const getAnnoyingRelativeResponse = async (judgeInput, relativeType = "aunty") => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            You are an annoying Indian relative (type: ${relativeType}) in a WhatsApp call. 
            The user is at a hackathon, but you don't care. 
            You must respond to the following input from the user/judge in a way that is:
            1. Pestering about marriage, salary, or comparing them to more successful cousins.
            2. Slightly passive-aggressive.
            3. Uses common Indian English phrases or "Beta".
            
            Judge/User Input: "${judgeInput}"
            
            Response (keep it short, max 2 sentences):
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Relative AI error:", error);
        return "Beta, why are you not picking up? Is this how I raised you? My neighbor's son just got married!";
    }
};

module.exports = { getAnnoyingRelativeResponse };
