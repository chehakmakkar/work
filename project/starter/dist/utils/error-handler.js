/**
 * Error Handling Utilities
 *
 * Provides retry logic with exponential backoff and timeout wrappers
 * for resilient API interactions.
 */
export class ReviewError extends Error {
    constructor(code, message, originalError) {
        super(message);
        this.code = code;
        this.originalError = originalError;
        this.name = 'ReviewError';
    }
}
/**
 * Wraps a function with retry logic using exponential backoff
 *
 * @param fn The async function to retry
 * @param options Configuration for retry behavior
 * @returns The result of the function
 * @throws ReviewError with RETRY_EXHAUSTED code if all retries fail
 */
export async function withRetry(fn, options) {
    const { maxRetries, initialDelayMs, maxDelayMs = 30000, jitterMs = 100 } = options;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt === maxRetries) {
                // All retries exhausted
                throw new ReviewError('RETRY_EXHAUSTED', `Failed after ${maxRetries} retries`, lastError);
            }
            // Calculate exponential backoff delay
            const exponentialDelay = initialDelayMs * Math.pow(2, attempt);
            const cappedDelay = Math.min(exponentialDelay, maxDelayMs);
            const jitter = Math.random() * jitterMs;
            const totalDelay = cappedDelay + jitter;
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, totalDelay));
        }
    }
    throw new ReviewError('RETRY_EXHAUSTED', 'Retry logic error', lastError);
}
/**
 * Wraps a function with a timeout
 *
 * @param fn The async function to execute
 * @param options Timeout configuration
 * @returns The result of the function
 * @throws ReviewError with TIMEOUT code if function exceeds timeoutMs
 */
export async function withTimeout(fn, options) {
    const { timeoutMs } = options;
    return Promise.race([
        fn(),
        new Promise((_, reject) => {
            const timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                reject(new ReviewError('TIMEOUT', `Operation exceeded timeout of ${timeoutMs}ms`));
            }, timeoutMs);
        }),
    ]);
}
/**
 * Combines retry and timeout: retry with timeout on each attempt
 */
export async function withRetryAndTimeout(fn, retryOptions, timeoutOptions) {
    return withRetry(() => withTimeout(fn, timeoutOptions), retryOptions);
}
