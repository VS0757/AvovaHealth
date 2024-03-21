// Import the necessary AWS SDK v3 modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { awsConfig } = require('../config/awsConfig');
const { executeWithExponentialBackoff } = require('./dynamoUtils');

// Initialize the DynamoDB Client
const dynamoDBClient = new DynamoDBClient(awsConfig);

// Create a DynamoDB Document Client
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

const storeFhirDataInDynamo = async (uniqueUserId, fhirData) => {
    const TableName = 'avovahealthdatabase';

    for (const entry of fhirData.entry) {
        const effectiveDateTime = entry.resource.effectiveDateTime;
        const Item = {
            uniqueUserId,
            dateTimeType: `${effectiveDateTime}#FHIR#${entry.resource.id}`,
            data: entry.resource,
        };

        console.log(JSON.stringify(Item, null, 2));

        try {
            await executeWithExponentialBackoff(() => docClient.send(new PutCommand({ TableName, Item })));
            console.log(`Stored FHIR entry for ${uniqueUserId}`);
        } catch (error) {
            console.error("Error storing FHIR data:", error);
        }
    }
};

const storeManualDataInDynamo = async (uniqueUserId, manualData, fileName) => {
    const TableName = 'avovahealthdatabase';

    for (const entry of manualData) {
        const effectiveDateTime = entry.resource.effectiveDateTime;
        const Item = {
            uniqueUserId,
            dateTimeType: `${effectiveDateTime}#MANUAL#${fileName}`,
            data: entry.resource,
        };

        console.log(JSON.stringify(Item, null, 2));

        try {
            await executeWithExponentialBackoff(() => docClient.send(new PutCommand({ TableName, Item })));
            console.log(`Stored MANUAL entry for ${uniqueUserId}`);
        } catch (error) {
            console.error("Error storing MANUAL data:", error);
        }
    }
};

module.exports = { storeFhirDataInDynamo, storeManualDataInDynamo };
