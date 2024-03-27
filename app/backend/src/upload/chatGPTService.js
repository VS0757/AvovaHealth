require('dotenv').config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});

const callChatGPTAPI = async (extractedText) => {
    try {
        const prompt = "Listed below is a patient's blood work. The JSON format will include an array of entries, called 'testsbydate' (could have only one), where entries each include and are split up by a unique 'effectiveDateTime' key associated with a value of the date that the blood test was conducted of the form YYYY-MM-DD. Each entry should contain an array of sub-entries, called 'test' (may only have one) for each and that contains 'bloodtestname' and 'value' (required), that also contains 'range' and 'unit' if it's there, otherwise just set the value to string, 'None'. Your output should be a JSON string only and nothing else";
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
