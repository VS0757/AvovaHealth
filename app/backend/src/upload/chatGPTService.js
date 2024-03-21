require('dotenv').config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});

const callChatGPTAPI = async (extractedText) => {
    try {
        const prompt = "Listed below is a patient's blood work. Please parse the output, making sure to keep relevant information in a FHIR format such as values for tests and dates (no need for extra information not found in the text). The FHIR format can include multiple entries if need be, but each entry must include only one 'resource', which contains an 'effectiveDateTime' key associated with a value of the date that the blood test was conducted. The resource for each entry should also contain the rest of the information for the blood test that occurred on the effectiveDateTime, all in FHIR format. Your output should be a JSON string in FHIR format only and nothing else";
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
