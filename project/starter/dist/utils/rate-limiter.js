/**
 * Rate Limiter with Sliding Window Algorithm
 *
 * Prevents API throttling by tracking requests in a 60-second sliding window.
 * Implements token bucket algorithm for smooth rate limiting.
 */
/**
 * Rate limiter using sliding window and token bucket algorithm
 */
export class RateLimiter {
    constructor(config) {
        this.requestHistory = [];
        this.activeRequests = 0;
        this.waitQueue = [];
        this.maxConcurrentRequests = config.maxConcurrentRequests;
        this.maxRequestsPerMinute = config.maxRequestsPerMinute;
        this.maxTokensPerMinute = config.maxTokensPerMinute;
        this.windowSizeMs = config.windowSizeMs || 60000; // 60 seconds default
    }
    /**
     * Remove old records outside the sliding window
     */
    pruneOldRecords() {
        const now = Date.now();
        const windowStart = now - this.windowSizeMs;
        this.requestHistory = this.requestHistory.filter((record) => record.timestamp > windowStart);
    }
    /**
     * Check if a request can proceed immediately without waiting
     */
    canProceed(estimatedTokens) {
        // Prune old records first
        this.pruneOldRecords();
        // Check concurrent requests limit
        if (this.activeRequests >= this.maxConcurrentRequests) {
            return false;
        }
        // Check requests per minute limit
        if (this.requestHistory.length >= this.maxRequestsPerMinute) {
            return false;
        }
        // Check tokens per minute limit
        const totalTokensUsed = this.requestHistory.reduce((sum, record) => sum + record.tokensUsed, 0);
        if (totalTokensUsed + estimatedTokens > this.maxTokensPerMinute) {
            return false;
        }
        return true;
    }
    /**
     * Wait for a concurrent request slot to become available
     */
    waitForSlot() {
        return new Promise((resolve) => {
            if (this.activeRequests < this.maxConcurrentRequests) {
                resolve();
            }
            else {
                this.waitQueue.push(resolve);
            }
        });
    }
    /**
     * Wait until rate limits allow the request
     */
    async waitForRateLimit(estimatedTokens) {
        while (!this.canProceed(estimatedTokens)) {
            // Find when the oldest request will expire
            if (this.requestHistory.length > 0) {
                const oldestRecord = this.requestHistory[0];
                const expiryTime = oldestRecord.timestamp + this.windowSizeMs;
                const waitTime = Math.max(0, expiryTime - Date.now());
                // Add a small buffer to ensure the record is pruned
                await new Promise((resolve) => setTimeout(resolve, waitTime + 100));
            }
            else {
                // No records yet, do a short wait and try again
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }
    }
    /**
     * Main entry point: acquire rate limiter slot and wait if necessary
     */
    async acquire(estimatedTokens) {
        // Wait for a concurrent request slot
        await this.waitForSlot();
        // Wait for rate limits to allow the request
        await this.waitForRateLimit(estimatedTokens);
        // Increment active requests and record the request
        this.activeRequests++;
        this.requestHistory.push({
            timestamp: Date.now(),
            tokensUsed: estimatedTokens,
        });
    }
    /**
     * Release a concurrent request slot
     */
    release() {
        this.activeRequests--;
        // Process waiting requests
        if (this.waitQueue.length > 0) {
            const resolve = this.waitQueue.shift();
            if (resolve) {
                resolve();
            }
        }
    }
    /**
     * Get current rate limiter status
     */
    getStatus() {
        this.pruneOldRecords();
        const totalTokensUsed = this.requestHistory.reduce((sum, record) => sum + record.tokensUsed, 0);
        return {
            activeRequests: this.activeRequests,
            requestsInWindow: this.requestHistory.length,
            tokensUsedInWindow: totalTokensUsed,
            maxConcurrentRequests: this.maxConcurrentRequests,
            maxRequestsPerMinute: this.maxRequestsPerMinute,
            maxTokensPerMinute: this.maxTokensPerMinute,
            waitingRequests: this.waitQueue.length,
        };
    }
    /**
     * Reset all counters
     */
    reset() {
        this.requestHistory = [];
        this.activeRequests = 0;
        this.waitQueue = [];
    }
}
