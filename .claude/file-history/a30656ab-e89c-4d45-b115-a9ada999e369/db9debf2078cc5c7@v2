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

interface RequestRecord {
  timestamp: number;
  tokensUsed: number;
}

/**
 * Rate limiter using sliding window and token bucket algorithm
 */
export class RateLimiter {
  private maxConcurrentRequests: number;
  private maxRequestsPerMinute: number;
  private maxTokensPerMinute: number;
  private windowSizeMs: number;
  private requestHistory: RequestRecord[] = [];
  private activeRequests = 0;

  constructor(config: RateLimiterConfig) {
    this.maxConcurrentRequests = config.maxConcurrentRequests;
    this.maxRequestsPerMinute = config.maxRequestsPerMinute;
    this.maxTokensPerMinute = config.maxTokensPerMinute;
    this.windowSizeMs = config.windowSizeMs || 60000; // 60 seconds default
  }

  /**
   * Remove old records outside the sliding window
   */
  private pruneOldRecords(): void {
    const now = Date.now();
    const windowStart = now - this.windowSizeMs;

    this.requestHistory = this.requestHistory.filter((record) => record.timestamp > windowStart);
  }

  /**
   * Check if a request can proceed immediately without waiting
   */
  private canProceed(estimatedTokens: number): boolean {
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
   * Atomically acquire a rate limiter slot, ensuring concurrency and rate limits are respected
   * This uses a retry loop to prevent race conditions where multiple concurrent callers
   * could all pass the check before any of them increment activeRequests
   */
  async acquire(estimatedTokens: number): Promise<void> {
    while (true) {
      this.pruneOldRecords();

      // Calculate total tokens used in the current window
      const totalTokens = this.requestHistory.reduce((sum, r) => sum + r.tokensUsed, 0);

      // Check if all three limits allow this request
      const canReserve =
        this.activeRequests < this.maxConcurrentRequests &&
        this.requestHistory.length < this.maxRequestsPerMinute &&
        totalTokens + estimatedTokens <= this.maxTokensPerMinute;

      if (canReserve) {
        // Atomically reserve the slot and record the request
        this.activeRequests++;
        this.requestHistory.push({
          timestamp: Date.now(),
          tokensUsed: estimatedTokens,
        });
        return;
      }

      // Calculate how long to wait before retrying
      const oldest = this.requestHistory[0];
      const waitMs = oldest
        ? Math.max(100, oldest.timestamp + this.windowSizeMs - Date.now() + 100)
        : 100;

      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  /**
   * Release a concurrent request slot
   */
  release(): void {
    this.activeRequests--;
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
    };
  }

  /**
   * Reset all counters
   */
  reset(): void {
    this.requestHistory = [];
    this.activeRequests = 0;
  }
}
