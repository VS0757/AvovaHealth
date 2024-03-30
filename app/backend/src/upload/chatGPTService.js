require('dotenv').config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});

const callChatGPTAPI = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
        });

        console.log(response)
        return response
    } catch (error) {
        throw error;
    }
};

module.exports = { callChatGPTAPI };
