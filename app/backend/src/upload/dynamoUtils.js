/**
 * Pauses execution for a given number of milliseconds.
 * @param {number} ms - The time to sleep in milliseconds.
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Performs a DynamoDB operation with exponential backoff.
 * @param {Function} operation - The DynamoDB operation to perform.
 * @param {number} maxRetries - Maximum number of retries.
 * @returns {Promise<any>} - The result of the DynamoDB operation.
 */
const executeWithExponentialBackoff = async (operation, maxRetries = 5) => {
    const baseDelay = 50; // Base delay in milliseconds
    let attempt = 0;

    while (true) {
        try {
            return await operation(); // Attempt the operation
        } catch (error) {
            if (error.name !== 'ProvisionedThroughputExceededException' || attempt >= maxRetries) {
                throw error; // Rethrow error if not related to throughput or max retries reached
            }
            // Calculate delay with exponential backoff
            const delay = Math.pow(2, attempt) * baseDelay;
            console.log(`Waiting ${delay} ms before retrying...`);
            await sleep(delay); // Wait before retrying
            attempt++;
        }
    }
};

module.exports = { sleep, executeWithExponentialBackoff };
