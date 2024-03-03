require('dotenv').config();
const express = require('express');
const multer = require("multer");
const cors = require('cors');
const { uploadPdfToS3, uploadDataToS3 } = require('./upload/s3Service');
const { analyzeDocument } = require('./upload/textractService');
const { callChatGPTAPI } = require('./upload/chatGPTService');

const app = express();
app.use(cors());
const upload = multer();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const extractedText = await analyzeDocument(req.file.buffer);
    console.log("Extracted Text:", extractedText);
    const chatGPTResponse = await callChatGPTAPI(extractedText);
    console.log("ChatGPT Response:", chatGPTResponse);
    const key = await uploadDataToS3(chatGPTResponse, req.file);
    res.send({
      message: 'Successfully uploaded and analyzed PDF, and got response from ChatGPT!',
      chatGPTResponse,
    });
  } catch (err) {
    console.error("Error during upload, analysis, or ChatGPT query:", err);
    res.status(500).send("Error processing file.");
  }
});

app.get('/test-s3', async (req, res) => {
  try {
    const data = await s3Client.listObjectsV2({
      Bucket: process.env.AWS_BUCKET_NAME
    });
    console.log(data);
    res.send('Successfully connected to S3');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to connect to S3');
  }
});

module.exports = app;
