// Import the necessary AWS SDK v3 modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { awsConfig } = require("../config/awsConfig");
const { executeWithExponentialBackoff } = require("./dynamoUtils");

// Initialize the DynamoDB Client
const dynamoDBClient = new DynamoDBClient(awsConfig);

// Create a DynamoDB Document Client
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

const storeFhirDataInDynamo = async (uniqueUserId, fhirData) => {
  const TableNameSingleEntry = "avovahealthdatabase";
  const TableNameBloodEntry = "avovahealthbloodtests";
  var counter = 0;
  for (const entry of fhirData.entry) {
    const resource = entry.resource;
    const bloodTestName = resource?.code?.coding[0]?.display || resource?.code?.text || "Unknown Test";
    const testValue = resource?.valueQuantity?.value || "Unknown Value";
    if (bloodTestName === "Unknown Test" || testValue === "Unknown Value") {
      continue;
    }

    if (counter == 5) {
      break;
    }

    if (bloodTestName === "Glucose") {
      counter++;
      await storeFHIRBasedOnEntry(TableNameSingleEntry, uniqueUserId, entry);
      await storeFHIRBasedOnTest(TableNameBloodEntry, uniqueUserId, entry);
    }
  }
};

const storeFHIRBasedOnEntry = async (TableName, uniqueUserId, entry) => {
  const effectiveDateTime = entry.resource.effectiveDateTime.split('T')[0];
  const entryResourceId = entry.resource.id.replace(/\s+/g, '_');
  const Item = {
    uniqueUserId: uniqueUserId,
    dateTimeType: `${effectiveDateTime}$FHIR$${entryResourceId}`,
    data: entry.resource,
  };

  try {
    await executeWithExponentialBackoff(() =>
      docClient.send(new PutCommand({ TableName, Item }))
    );
  } catch (error) {
    console.error("Error storing FHIR data:", error);
  }
}

const storeFHIRBasedOnTest = async (TableName, uniqueUserId, entry) => {
  const resource = entry.resource;
  const effectiveDateTime = resource.effectiveDateTime.split('T')[0];
  const bloodTestName = resource.code?.coding[0]?.display || resource.code?.text;
  const testValue = resource.valueQuantity?.value;
  const testRange = [resource?.referenceRange?.[0]?.low?.value || "NONE", resource?.referenceRange?.[0]?.high?.value || "NONE"];

  const Item = {
    uniqueUserId: uniqueUserId,
    bloodTest: `${bloodTestName}$${effectiveDateTime}`,
    uploadType: "FHIR",
    testValue: testValue,
    testUnit: resource.valueQuantity?.unit,
    testRange: testRange,
    data: entry.resource,
  };


  try {
    await executeWithExponentialBackoff(() =>
      docClient.send(new PutCommand({ TableName, Item })),
    );
  } catch (error) {
    console.error("Error storing FHIR data:", error);
  }
}

const storeManualDataInDynamo = async (uniqueUserId, manualData, fileName) => {
  const TableNameSingleEntry = "avovahealthdatabase";
  const TableNameBloodEntry = "avovahealthbloodtests";
  const fileNameSanitized = fileName.replace(/\s+/g, '');
  for (const entry of manualData.testsbydate) {
    const effectiveDateTime = entry.effectiveDateTime;
    await storeManualBasedOnEntry(TableNameSingleEntry, uniqueUserId, entry, fileNameSanitized, effectiveDateTime);
    for (const testEntry of entry.test) {
      if (isNaN(testEntry.value)) {
        break;
      }
      await storeManualBasedOnTest(TableNameBloodEntry, uniqueUserId, testEntry, effectiveDateTime);
    }
  }

};

const storeManualBasedOnEntry = async (TableName, uniqueUserId, entry, fileName, effectiveDateTime) => {
  const Item = {
    uniqueUserId,
    dateTimeType: `${effectiveDateTime}$MANUAL$${fileName}`,
    data: entry,
  };

  try {
    await executeWithExponentialBackoff(() =>
      docClient.send(new PutCommand({ TableName, Item })),
    );
  } catch (error) {
    console.error("Error storing MANUAL (per entry) data:", error);
  }
}

const storeManualBasedOnTest = async (TableName, uniqueUserId, entry, effectiveDateTime) => {
  const Item = {
    uniqueUserId: uniqueUserId,
    bloodTest: `${entry.bloodtestname}$${effectiveDateTime}`,
    data: entry,
    testRange: entry.range,
    testUnit: entry.unit,
    testValue: entry.value,
    uploadType: "MANUAL"
  };

  try {
    await executeWithExponentialBackoff(() =>
      docClient.send(new PutCommand({ TableName, Item })),
    );
  } catch (error) {
    console.error("Error storing MANUAL (per entry) data:", error);
  }
}

const storeUserDataInDynamo = async (uniqueUserId, birthday, sex, preconditions, medications) => {
  const TableName = "avovahealthuserdata";

  const Item = {
    uniqueUserId,
    birthday: birthday,
    sex: sex,
    preconditions: preconditions,
    medications: medications,
  };

  try {
    docClient.send(new PutCommand({ TableName, Item }));
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

const retrieveUserDataFromDynamo = async (
  uniqueUserId,
) => {
  const TableName = "avovahealthuserdata";

  let KeyConditionExpression = "uniqueUserId = :uniqueUserId";
  let ExpressionAttributeValues = {
    ":uniqueUserId": uniqueUserId,
  };

  const commandParams = {
    TableName,
    KeyConditionExpression,
    ExpressionAttributeValues,
  };

  const command = new QueryCommand(commandParams);
  try {
    const { Items } = await docClient.send(command);
    return Items[0];
  } catch (error) {
    console.error("Error retrieving FHIR Data from DynamoDB:", error);
    throw error;
  }
};

const deleteUserDataFromDynamo = async (uniqueUserId, dateTimeType) => {
  const command = new DeleteCommand({
    TableName: "avovahealthdatabase",
    Key: {
      uniqueUserId: uniqueUserId,
      dateTimeType: dateTimeType,
    },
  });

  try {
    const data = await docClient.send(command);
    return;
  } catch (error) {
    console.error("Error deleting data from DynamoDB:", error);
    throw error;
  }
};

const retrieveFhirDataFromDynamo = async (
  uniqueUserId,
  specificDate = null,
) => {
  const TableName = "avovahealthdatabase";

  let KeyConditionExpression = "uniqueUserId = :uniqueUserId";
  let ExpressionAttributeValues = {
    ":uniqueUserId": uniqueUserId,
  };

  if (specificDate) {
    KeyConditionExpression =
      "uniqueUserId = :uniqueUserId AND begins_with(dateTimeType, :specificDate)";
    ExpressionAttributeValues = {
      ":uniqueUserId": uniqueUserId,
      ":specificDate": specificDate,
    };
  }

  const commandParams = {
    TableName,
    KeyConditionExpression,
    ExpressionAttributeValues,
  };

  const command = new QueryCommand(commandParams);
  try {
    const { Items } = await docClient.send(command);
    return Items;
  } catch (error) {
    console.error("Error retrieving FHIR Data from DynamoDB:", error);
    throw error;
  }
};

module.exports = {
  storeFhirDataInDynamo,
  storeManualDataInDynamo,
  storeUserDataInDynamo,
  retrieveFhirDataFromDynamo,
  retrieveUserDataFromDynamo,
  deleteUserDataFromDynamo,
};
