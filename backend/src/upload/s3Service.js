const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { awsConfig } = require('../config/awsConfig');

const s3Client = new S3Client(awsConfig);

const uploadDataToS3 = async (jsonData, typeOfUpload, uniqueUserId, fileName) => {
  const key = `${Date.now().toString()}-${typeOfUpload}-${uniqueUserId}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(jsonData), // Convert JSON object to a string
    ContentType: 'application/json', // Set the content type to application/json
  });

  await s3Client.send(command);
  return key; // Return the key of the uploaded file for further processing or response.
};

module.exports = { uploadDataToS3 }; // Export the new function as well
