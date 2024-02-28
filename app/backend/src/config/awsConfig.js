const { AWS } = require("@aws-sdk/client-s3");

// Initialize and export the S3 client
const awsConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

module.exports = { awsConfig };
