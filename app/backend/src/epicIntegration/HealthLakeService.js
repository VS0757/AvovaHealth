require('dotenv').config();
const { HealthLakeClient, StartFHIRImportJobCommand } = require("@aws-sdk/client-healthlake");
const healthLakeClient = new HealthLakeClient({ region: process.env.AWS_REGION });
const { v4: uuidv4 } = require('uuid');
const clientToken = uuidv4();

const uploadDataToHealthLake = async (s3Key) => {
    const inputS3Uri = `s3://${process.env.AWS_BUCKET_NAME}/${s3Key}`;

    const params = {
        JobName: "ImportFHIRData",
        InputDataConfig: {
            S3Uri: inputS3Uri
        },
        JobOutputDataConfig: { // OutputDataConfig Union: only one key present
            S3Configuration: { // S3Configuration
              S3Uri: inputS3Uri, // required
              KmsKeyId: process.env.HEALTHLAKE_KMS_ID, // required
            },
          },
        DatastoreId: process.env.HEALTHLAKE_DATASTORE_ID,
        DataAccessRoleArn: process.env.HEALTHLAKE_DATAACCESS_ROLE_ARN, // required
        ClientToken: clientToken, // required
    };

    try {
        const command = new StartFHIRImportJobCommand(params);
        const response = await healthLakeClient.send(command);
        console.log("HealthLake Import Job started successfully:", response);
        return response;
    } catch (error) {
        console.error("Error starting HealthLake Import Job:", error);
        throw error;
    }
};

const retrieveDataFromHealthLake = async () => {
    //have to make lambda
};
/*Delete if no healthlake*/