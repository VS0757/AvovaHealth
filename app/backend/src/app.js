require('dotenv').config();
const express = require('express');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const cors = require('cors');
const { uploadPdfToS3 } = require('./upload/s3Service');
const { s3Client } = require('./config/awsConfig');

const app = express();
app.use(cors());

const upload = multer();

app.get('/', (req, res) => {
  res.send('Hello World');
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

app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const key = await uploadPdfToS3(req.file); // Use the service to upload the file
    res.send({
      message: 'Successfully uploaded PDF to S3!',
      fileInfo: key,
    });
  } catch (err) {
    console.error("Error uploading to S3:", err);
    res.status(500).send("Error uploading file.");
  }
});

module.exports = app;
