require('dotenv').config(); // Load environment variables
const express = require('express');
const AWS = require('./config/awsConfig'); // Make sure this path is correct relative to app.js
const app = express();
const upload = require('./upload/upload');

// Initialize S3 client here to use it in the test-s3 route
const s3 = new AWS.S3();

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Test S3 connectivity route
app.get('/test-s3', (req, res) => {
    s3.listObjectsV2({ Bucket: process.env.AWS_BUCKET_NAME }, (err, data) => {
      if (err) {
        console.log(err, err.stack); // an error occurred
        return res.status(500).send('Failed to connect to S3');
      }
      console.log(data); // successful response
      res.send('Successfully connected to S3');
    });
});

app.post('/upload-pdf', upload.single('pdf'), (req, res) => {
  res.send({
    message: 'Successfully uploaded PDF to S3!',
    fileInfo: req.file
  });
});

// Additional routes can go here

module.exports = app;
