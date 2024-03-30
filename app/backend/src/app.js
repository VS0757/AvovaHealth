require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { uploadDataToS3 } = require("./upload/s3Service");
const { analyzeDocument } = require("./upload/textractService");
const { callChatGPTAPI } = require("./upload/chatGPTService");
const {
  storeFhirDataInDynamo,
  storeUserDataInDynamo,
  storeManualDataInDynamo,
  retrieveFhirDataFromDynamo,
  retrieveUserDataFromDynamo,
} = require("./upload/dynamoService");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
const upload = multer();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const extractedText = await analyzeDocument(req.file.buffer);
    const chatGPTResponse = await callChatGPTAPI(extractedText);
    await uploadDataToS3(
      chatGPTResponse,
      "MANUAL",
      req.body.uniqueUserId,
      req.file.originalname,
    );
    await storeManualDataInDynamo(
      req.body.uniqueUserId,
      chatGPTResponse,
      req.file.originalname,
    );
    res.send({ message: "Successfully uploaded and analyzed PDF -> JSON" });
  } catch (err) {
    console.error("Error during upload, analysis, or ChatGPT query:", err);
    res.status(500).send("Error processing file.");
  }
});

app.post("/upload-epic-fhir", async (req, res) => {
  try {
    const { fhirData, uniqueUserId } = req.body;
    await uploadDataToS3(fhirData, "FHIR", uniqueUserId, "EpicSystems");
    await storeFhirDataInDynamo(uniqueUserId, fhirData);
    res.send({ message: "Epic data uploaded successfully to Dynamo" });
  } catch (error) {
    console.error("Failed to upload epic data to Dynamo:", error);
    res.status(500).send({
      message: "Failed to upload epic data to Dynamo",
      error: error.toString(),
    });
  }
});

app.post("/upload-user-data", async (req, res) => {
  try {
    const { uniqueUserId, age, sex, preconditions, medications } = req.body;
    await storeUserDataInDynamo(uniqueUserId, age, sex, preconditions, medications);
  } catch (error) {
    console.error("Failed to upload user data to Dynamo:", error);
    res.status(500).send({
      message: "Failed to upload user data to Dynamo",
      error: error.toString(),
    });
  }
});

app.get("/retrieve-user-data", async (req, res) => {
  try {
    const { id } = req.query;
    const data = await retrieveUserDataFromDynamo(id);
    if (!data) {
      return res
        .status(404)
        .send({ message: "No data found for the provided userID." });
    }
    res.send({ message: "Data retrieved successfully.", data: data });
  } catch (error) {
    console.error("Failed to retrieve user data to Dynamo:", error);
    res.status(500).send({
      message: "Failed to retrieve user data to Dynamo",
      error: error.toString(),
    });
  }
});

app.get("/retrieve-fhir-data", async (req, res) => {
  try {
    const { id, date } = req.query;

    if (!id) {
      return res
        .status(400)
        .send({ message: "id query parameter is required." });
    }

    const data = await retrieveFhirDataFromDynamo(id, date);

    if (data.length === 0) {
      return res
        .status(404)
        .send({ message: "No data found for the provided userID." });
    }

    res.send({ message: "Data retrieved successfully.", data: data });
  } catch (error) {
    console.error("Failed to retrieve FHIR data from dynamo: ", error);
    res
      .status(500)
      .send({ message: "Failed to retrieve FHIR data from dynamo: ", error });
  }
});

module.exports = app;
