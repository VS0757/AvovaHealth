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
  const TableName = "avovahealthdatabase";

  for (const entry of fhirData.entry) {
    const effectiveDateTime = entry.resource.effectiveDateTime;
    const Item = {
      uniqueUserId,
      dateTimeType: `${effectiveDateTime}#FHIR#${entry.resource.id}`,
      data: entry.resource,
    };

    console.log(JSON.stringify(Item, null, 2));

    try {
      await executeWithExponentialBackoff(() =>
        docClient.send(new PutCommand({ TableName, Item })),
      );
      console.log(`Stored FHIR entry for ${uniqueUserId}`);
    } catch (error) {
      console.error("Error storing FHIR data:", error);
    }
  }
};

const storeManualDataInDynamo = async (uniqueUserId, manualData, fileName) => {
  const TableName = "avovahealthdatabase";

  for (const entry of manualData) {
    const effectiveDateTime = entry.resource.effectiveDateTime;
    const Item = {
      uniqueUserId,
      dateTimeType: `${effectiveDateTime}#MANUAL#${fileName}`,
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
  retrieveFhirDataFromDynamo,
};
