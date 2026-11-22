/**
 * Rate Limiter with Sliding Window Algorithm
 *
 * Prevents API throttling by tracking requests in a 60-second sliding window.
 * Implements token bucket algorithm for smooth rate limiting.
 */
export interface RateLimiterConfig {
    maxConcurrentRequests: number;
    maxRequestsPerMinute: number;
    maxTokensPerMinute: number;
    windowSizeMs?: number;
}
/**
 * Rate limiter using sliding window and token bucket algorithm
 */
export declare class RateLimiter {
    private maxConcurrentRequests;
    private maxRequestsPerMinute;
    private maxTokensPerMinute;
    private windowSizeMs;
    private requestHistory;
    private activeRequests;
    private waitQueue;
    constructor(config: RateLimiterConfig);
    /**
     * Remove old records outside the sliding window
     */
    private pruneOldRecords;
    /**
     * Check if a request can proceed immediately without waiting
     */
    private canProceed;
    /**
     * Wait for a concurrent request slot to become available
     */
    private waitForSlot;
    /**
     * Wait until rate limits allow the request
     */
    private waitForRateLimit;
    /**
     * Main entry point: acquire rate limiter slot and wait if necessary
     */
    acquire(estimatedTokens: number): Promise<void>;
    /**
     * Release a concurrent request slot
     */
    release(): void;
    /**
     * Get current rate limiter status
     */
    getStatus(): {
        activeRequests: number;
        requestsInWindow: number;
        tokensUsedInWindow: number;
        maxConcurrentRequests: number;
        maxRequestsPerMinute: number;
        maxTokensPerMinute: number;
        waitingRequests: number;
    };
    /**
     * Reset all counters
     */
    reset(): void;
}
//# sourceMappingURL=rate-limiter.d.ts.map