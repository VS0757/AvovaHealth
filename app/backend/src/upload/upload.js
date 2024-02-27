require('dotenv').config(); // Load environment variables
const AWS = require('../config/awsConfig'); // Make sure this path is correct relative to app.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const { env } = require('process');

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  }),
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
