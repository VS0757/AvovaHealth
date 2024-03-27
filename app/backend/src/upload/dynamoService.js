// Import the necessary AWS SDK v3 modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
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
    if (counter == 5) {
      break;
    }
    counter ++;
    await storeBasedOnEntry(TableNameSingleEntry, uniqueUserId, entry);
    await storeBasedOnTest(TableNameBloodEntry, uniqueUserId, entry);
  }
};

const storeBasedOnEntry = async (TableName, uniqueUserId, entry) => {
  const effectiveDateTime = entry.resource.effectiveDateTime.split('T')[0];
  const entryResourceId = entry.resource.id.replace(/\s+/g, '_');
  const Item = {
    uniqueUserId,
    dateTimeType: `${effectiveDateTime}$FHIR$${entryResourceId}`,
    data: entry.resource,
  };

  console.log(JSON.stringify(Item, null, 2));

  try {
    await executeWithExponentialBackoff(() =>
      docClient.send(new PutCommand({ TableName, Item })),
    );
    console.log(`Stored FHIR entry (per entry) for ${uniqueUserId}`);
  } catch (error) {
    console.error("Error storing FHIR data:", error);
  }
}

const storeBasedOnTest = async (TableName, uniqueUserId, entry) => {
  const resource = entry.resource;
  const effectiveDateTime = resource.effectiveDateTime.split('T')[0];
  const bloodTestName = resource.code?.coding[0]?.display || code?.text || "Unknown Test";
  const testValue = resource.valueQuantity?.value || "Unknown Value";
  if (bloodTestName === "Unknown Test" || testValue === "Unknown Value") {
    return;
  }
  const Item = {
    uniqueUserId,
    bloodTest: `${bloodTestName}$${effectiveDateTime}`,
    uploadType: "FHIR",
    testValue: testValue,
    testUnit: resource.valueQuantity?.unit,
    testRange: resource.referenceRange[0]?.low?.value + " - " + resource.referenceRange[0]?.high?.value,
    data: entry.resource,
  };

  console.log(JSON.stringify(Item, null, 2));

  try {
    await executeWithExponentialBackoff(() =>
      docClient.send(new PutCommand({ TableName, Item })),
    );
    console.log(`Stored FHIR entry (per blood test) for ${uniqueUserId}`);
  } catch (error) {
    console.error("Error storing FHIR data:", error);
  }
}

const storeManualDataInDynamo = async (uniqueUserId, manualData, fileName) => {
  const TableName = "avovahealthdatabase";

  for (const entry of manualData) {
    const effectiveDateTime = entry.resource.effectiveDateTime;
    const fileNameSanitized = fileName.replace(/\s+/g, '');
    const Item = {
      uniqueUserId,
      dateTimeType: `${effectiveDateTime}$MANUAL$${fileNameSanitized}`,
      data: entry.resource,
    };

    console.log(JSON.stringify(Item, null, 2));

    try {
      await executeWithExponentialBackoff(() =>
        docClient.send(new PutCommand({ TableName, Item })),
      );
      console.log(`Stored MANUAL entry for ${uniqueUserId}`);
    } catch (error) {
      console.error("Error storing MANUAL data:", error);
    }
  }
};

const storeUserDataInDynamo = async (uniqueUserId, preconditions, medications) => {
  const TableName = "avovahealthuserdata";

    const Item = {
      uniqueUserId,
      preconditions: preconditions,
      medications: medications,
    };

    console.log(JSON.stringify(Item, null, 2));

    try {
      docClient.send(new PutCommand({ TableName, Item })),
      console.log(`Stored user data entry for ${uniqueUserId}`);
    } catch (error) {
      console.error("Error storing user data:", error);
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
};
