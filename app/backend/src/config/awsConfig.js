const AWS = require('aws-sdk');
require('dotenv').config(); // Ensure you have dotenv installed

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

module.exports = AWS;