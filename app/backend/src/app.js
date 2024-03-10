require('dotenv').config();
const express = require('express');
const multer = require("multer");
const cors = require('cors');
const { uploadDataToS3 } = require('./upload/s3Service');
const { analyzeDocument } = require('./upload/textractService');
const { callChatGPTAPI } = require('./upload/chatGPTService');
const { uploadDataToHealthLake, retrieveDataFromHealthLake } = require('./epicIntegration/HealthLakeService');

const app = express();
app.use(cors());
const upload = multer();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const extractedText = await analyzeDocument(req.file.buffer);
    const chatGPTResponse = await callChatGPTAPI(extractedText);
    await uploadDataToS3(chatGPTResponse, req.file);
    res.send({message: 'Successfully uploaded and analyzed PDF -> JSON'});
  } catch (err) {
    console.error("Error during upload, analysis, or ChatGPT query:", err);
    res.status(500).send("Error processing file.");
  }
});

app.post('/upload-epic-fhir', async (req, res) => {
  try {
    const key = await uploadDataToS3(req.body, { originalname: 'anthony-fhir-data.json' });
    // await uploadDataToHealthLake(key);
    res.send({ message: 'Data uploaded successfully to HealthLake' });
  } catch (error) {
    console.error('Failed to upload data to HealthLake:', error);
    res.status(500).send({ message: 'Failed to upload data to HealthLake', error: error.toString() });
  }
});

// app.post('/display-epic-fhir', async (req, res) => {
//   try {
//     const data = await retrieveDataFromHealthLake()
//     res.json(data)
//   } catch (error) {
//     console.error('Failed to retrieve data from HealthLake:', error);
//     res.status(500).send({ message: 'Failed to retrieve data from HealthLake', error: error.toString() });
//   }
// });

module.exports = app;
