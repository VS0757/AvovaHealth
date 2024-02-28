const { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } = require("@aws-sdk/client-textract");
const { awsConfig } = require('../config/awsConfig');

const textractClient = new TextractClient(awsConfig);

const startTextDetection = async (bucketName, documentKey) => {
    const startCommand = new StartDocumentTextDetectionCommand({
        DocumentLocation: {
            S3Object: {
                Bucket: bucketName,
                Name: documentKey,
            },
        },
    });

    try {
        const startResponse = await textractClient.send(startCommand);
        return startResponse.JobId; // Return the job ID for polling the results
    } catch (error) {
        console.error("Error starting text detection:", error);
        throw error;
    }
};

const getTextDetectionResult = async (jobId) => {
    const getResultCommand = new GetDocumentTextDetectionCommand({
        JobId: jobId,
    });

    try {
        // Polling logic to wait for the job to complete
        let finished = false;
        let response;
        do {
            response = await textractClient.send(getResultCommand);
            if (response.JobStatus === 'SUCCEEDED') {
                finished = true;
            } else if (response.JobStatus === 'FAILED') {
                throw new Error('Text detection job failed');
            } else {
                // Wait for a short period before polling again
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } while (!finished);

        return response; // This contains the result of the text detection
    } catch (error) {
        console.error("Error getting text detection result:", error);
        throw error;
    }
};

const analyzeDocument = async (bucketName, documentKey) => {
    try {
        const jobId = await startTextDetection(bucketName, documentKey);
        const result = await getTextDetectionResult(jobId);

        // Initialize an empty string to accumulate text
        let extractedText = '';

        // Ensure Blocks are present in the result
        if (result.Blocks) {
            // Filter for 'LINE' block types and concatenate their text
            result.Blocks.forEach(block => {
                if (block.BlockType === 'LINE') {
                    extractedText += block.Text + '\n'; // Append the text of each line with a newline
                }
            });
        }

        console.log("Extracted Text:", extractedText);
        return extractedText; // Return the concatenated text string
    } catch (error) {
        console.error("Error analyzing document with Textract:", error);
        throw error;
    }
};

module.exports = { analyzeDocument };
