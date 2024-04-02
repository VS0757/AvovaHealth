require("dotenv").config();
const { OpenAI } = require("openai");
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
  retrieveTrendDataFromDynamo,
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
    const prompt =
      "Listed below is a patient's blood work. The JSON format will include an array of entries, called 'testsbydate' (could have only one), where entries each include and are split up by a unique 'effectiveDateTime' key associated with a value of the date that the blood test was conducted of the form YYYY-MM-DD. Each entry should contain an array of sub-entries, called 'test' (may only have one) for each and that contains 'bloodtestname' and 'value' (required), that also contains 'range' and 'unit' if it's there, otherwise just set the value to string, 'None'. Your output should be a JSON string only and nothing else" +
      extractedText;
    let response = await callChatGPTAPI(prompt, "gpt-4-turbo-preview");

    response = response.choices[0].message.content;
    response = response.replace(/```json|```/g, "").trim();
    const chatGPTResponse = JSON.parse(response);

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

app.get("/summarize", async (req, res) => {
  const { prompt } = req.query;

  const response = await callChatGPTAPI(prompt, "gpt-3.5-turbo-0125");

  res.send({ choices: response.choices });
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
    const { uniqueUserId, birthday, sex, preconditions, medications } =
      req.body;
    await storeUserDataInDynamo(
      uniqueUserId,
      birthday,
      sex,
      preconditions,
      medications,
    );
    res.status(200).send({ message: "Data uploaded successfully." });
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
    let data = await retrieveUserDataFromDynamo(id);
    if (!data) {
      return res
        .status(404)
        .send({ message: "No data found for the provided userID." });
    }
    data = {
      ...data,
      preconditions: [...data.preconditions],
      medications: [...data.medications],
    };
    res.send({ message: "Data retrieved successfully.", data: data });
  } catch (error) {
    console.error("Failed to retrieve user data from Dynamo:", error);
    res.status(500).send({
      message: "Failed to retrieve user data from Dynamo",
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

app.get("/retrieve-trend-data", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .send({ message: "id query parameter is required." });
    }

    const data = await retrieveTrendDataFromDynamo(id);
    if (data.length === 0) {
      return res
        .status(404)
        .send({ message: "No data found provided userId and test. " });
    }
    res.send({ message: "Data retrieved.", data: data });
  } catch (error) {
    console.error("Failed to retrieve Trend data from dynamo: ", error);
    res
      .status(500)
      .send({ message: "Failed to retrieve Trend data from dynamo: ", error });
  }
});

module.exports = app;
