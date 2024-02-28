const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require('../config/awsConfig');

const uploadPdfToS3 = async (file) => {
  const key = `${Date.now().toString()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
  });

  await s3Client.send(command);

  return key; // Return the key of the uploaded file for further processing or response.
};

module.exports = { uploadPdfToS3 };
