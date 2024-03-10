require('dotenv').config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});

const callChatGPTAPI = async (extractedText) => {
    try {
        const prompt = "Listed below is a patient's blood work. Please parse the output, making sure to keep relevant information such as values for tests and dates. If a number has a H or L associated with it, that means that the status is high or low respectively. Make sure to keep track of this status in new nested variable in the JSON output and not with the original value. Your output should a JSON string only and nothing else";
        const response = await openai.chat.completions.create({
            model: "gpt-4-0125-preview",
            messages: [{ role: "user", content: prompt + extractedText }],
            temperature: 0,
        });

        let chatResponse = response.choices[0].message.content;
        chatResponse = chatResponse.replace(/```json|```/g, '').trim()
        const chatGPTResponseJson = JSON.parse(chatResponse);
        return chatGPTResponseJson;
    } catch (error) {
        throw error;
    }
};

module.exports = { callChatGPTAPI };
