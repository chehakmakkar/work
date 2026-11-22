/**
 * Error Handling Utilities
 *
 * Provides retry logic with exponential backoff and timeout wrappers
 * for resilient API interactions.
 */
export declare class ReviewError extends Error {
    code: string;
    originalError?: Error | undefined;
    constructor(code: string, message: string, originalError?: Error | undefined);
}
export interface RetryOptions {
    maxRetries: number;
    initialDelayMs: number;
    maxDelayMs?: number;
    jitterMs?: number;
}
export interface TimeoutOptions {
    timeoutMs: number;
}
/**
 * Wraps a function with retry logic using exponential backoff
 *
 * @param fn The async function to retry
 * @param options Configuration for retry behavior
 * @returns The result of the function
 * @throws ReviewError with RETRY_EXHAUSTED code if all retries fail
 */
export declare function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T>;
/**
 * Wraps a function with a timeout
 *
 * @param fn The async function to execute
 * @param options Timeout configuration
 * @returns The result of the function
 * @throws ReviewError with TIMEOUT code if function exceeds timeoutMs
 */
export declare function withTimeout<T>(fn: () => Promise<T>, options: TimeoutOptions): Promise<T>;
/**
 * Combines retry and timeout: retry with timeout on each attempt
 */
export declare function withRetryAndTimeout<T>(fn: () => Promise<T>, retryOptions: RetryOptions, timeoutOptions: TimeoutOptions): Promise<T>;
//# sourceMappingURL=error-handler.d.ts.map