require('dotenv').config();
const express = require('express');
const multer = require("multer");
const cors = require('cors');
const { uploadDataToS3 } = require('./upload/s3Service');
const { analyzeDocument } = require('./upload/textractService');
const { callChatGPTAPI } = require('./upload/chatGPTService');
const { storeFhirDataInDynamo, storeManualDataInDynamo, retrieveFhirDataFromDynamo } = require('./upload/dynamoService');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
const upload = multer();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const extractedText = await analyzeDocument(req.file.buffer);
    const chatGPTResponse = await callChatGPTAPI(extractedText);
    await uploadDataToS3(chatGPTResponse, 'MANUAL', req.body.uniqueUserId, req.file.originalname);
    await storeManualDataInDynamo(req.body.uniqueUserId, chatGPTResponse, req.file.originalname);
    res.send({message: 'Successfully uploaded and analyzed PDF -> JSON'});
  } catch (err) {
    console.error("Error during upload, analysis, or ChatGPT query:", err);
    res.status(500).send("Error processing file.");
  }
});

app.post('/upload-epic-fhir', async (req, res) => {
  try {
    const {fhirData, uniqueUserId} = req.body;
    await uploadDataToS3(fhirData, 'FHIR', uniqueUserId, "EpicSystems");
    await storeFhirDataInDynamo(uniqueUserId, fhirData);
    res.send({ message: 'Epic data uploaded successfully to Dynamo' });
  } catch (error) {
    console.error('Failed to upload epic data to Dynamo:', error);
    res.status(500).send({ message: 'Failed to upload epic data to Dynamo', error: error.toString() });
  }
});

module.exports = app;
