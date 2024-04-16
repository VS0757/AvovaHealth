const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

const analyzeDocument = async (fileBuffer) => {
    try {
        const data = await pdfExtract.extractBuffer(fileBuffer, {}); // Extract text from the buffer directly
        let extractedText = '';

        // Loop through pages and their content
        data.pages.forEach(page => {
            page.content.forEach(item => {
                extractedText += item.str + ' '; // Concatenate the text with a space
            });
        });
        return extractedText.trim(); // Return the concatenated text string, trimmed to remove any trailing space
    } catch (error) {
        console.error("Error analyzing document with pdf.js-extract:", error);
        throw error;
    }
};

module.exports = { analyzeDocument };