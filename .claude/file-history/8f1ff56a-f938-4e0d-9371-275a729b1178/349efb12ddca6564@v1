# Part 2: Production Ready Implementation

## Overview

Part 2 transforms the working prototype into a production-ready system with robust error handling, rate limiting, comprehensive testing, and report generation in multiple formats.

## 🏗️ Phase 4: Production Utilities

### Error Handler (`src/utils/error-handler.ts`)

**Purpose**: Provide retry logic with exponential backoff and timeout wrappers

#### ReviewError Class

Custom error class for all review system errors with structured error codes:

```typescript
class ReviewError extends Error {
  constructor(code: string, message: string, originalError?: Error)
}
```

Error codes:
- `RETRY_EXHAUSTED`: All retries failed
- `TIMEOUT`: Operation exceeded timeout

#### withRetry Function

Implements exponential backoff retry logic:

**Algorithm**:
1. Try to execute the function
2. If successful, return result
3. If failed and retries remain:
   - Calculate delay: `initialDelayMs * 2^(attempt - 1)`
   - Add jitter (random 0-100ms) to prevent thundering herd
   - Wait for calculated duration
   - Retry

**Configuration**:
```typescript
interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs?: number;        // Default: 30000
  jitterMs?: number;          // Default: 100
}
```

**Example**:
```typescript
await withRetry(
  async () => orchestrator.reviewPullRequest(owner, repo, prNumber),
  { maxRetries: 3, initialDelayMs: 1000 }
);
```

**Benefits**:
- Automatic retry on transient failures
- Exponential backoff prevents overwhelming the API
- Jitter prevents thundering herd problem
- Configurable limits and delays

#### withTimeout Function

Wraps async operations with timeout protection:

**Algorithm**:
1. Race the function against a timeout promise
2. Whichever completes first wins
3. If timeout expires first, throw ReviewError

**Configuration**:
```typescript
interface TimeoutOptions {
  timeoutMs: number;
}
```

**Example**:
```typescript
await withTimeout(
  async () => claudeCall(),
  { timeoutMs: 60000 }  // 60 second timeout
);
```

#### withRetryAndTimeout

Combines both strategies - retry with timeout on each attempt:

```typescript
await withRetryAndTimeout(
  async () => claudeCall(),
  { maxRetries: 3, initialDelayMs: 1000 },
  { timeoutMs: 30000 }
);
```

### Rate Limiter (`src/utils/rate-limiter.ts`)

**Purpose**: Prevent API throttling using sliding window algorithm

#### Sliding Window Algorithm

Tracks requests in a 60-second rolling window:

```
Current time: T
Window: [T - 60000ms, T]
Count only requests with timestamp > T - 60000ms
```

**Key Concept**: Unlike fixed buckets that reset at specific times, sliding window provides smooth rate limiting that adapts to request patterns.

#### Configuration

```typescript
interface RateLimiterConfig {
  maxConcurrentRequests: number;  // e.g., 5
  maxRequestsPerMinute: number;   // e.g., 60
  maxTokensPerMinute: number;     // e.g., 90000
  windowSizeMs?: number;           // Default: 60000
}
```

#### Core Methods

**pruneOldRecords()**
- Removes requests older than 60 seconds
- Called automatically before each check
- Keeps memory usage constant

**canProceed(estimatedTokens)**
- Checks if request can proceed immediately
- Returns true only if all three conditions met:
  1. Active requests < max concurrent requests
  2. Requests in window < max requests per minute
  3. Tokens in window + estimated tokens <= max tokens per minute
- No waiting involved

**waitForSlot()**
- Waits for a concurrent request slot
- Adds resolver to `waitQueue`
- Resolvers are called by `release()` when slots available

**waitForRateLimit(estimatedTokens)**
- Waits until rate limits allow the request
- Calculates when oldest request expires
- Sleeps and checks again
- Smooth waiting without busy-looping

**acquire(estimatedTokens)**
- Main entry point for getting rate-limited access
- Calls `waitForSlot()` first (concurrent access)
- Calls `waitForRateLimit()` second (rate limit)
- Increments active requests
- Adds request to history
- Returns when ready

**release()**
- Called after request completes
- Decrements active requests
- Processes waiting requests from queue

#### Example Usage

```typescript
const rateLimiter = new RateLimiter({
  maxConcurrentRequests: 5,
  maxRequestsPerMinute: 60,
  maxTokensPerMinute: 90000
});

// Before API call
await rateLimiter.acquire(3000);  // 3000 tokens

try {
  const result = await orchestrator.reviewPullRequest(owner, repo, pr);
  return result;
} finally {
  rateLimiter.release();  // Always release
}
```

#### Advantages

- **Smooth rate limiting**: No sudden stops at fixed boundaries
- **Token-based**: Can account for different request sizes
- **Concurrent control**: Manages both concurrent requests and overall rate
- **Low overhead**: O(n) pruning only when needed
- **Wait queue pattern**: Efficient waiting without polling

## 🏗️ Phase 5: Complete CLI Application

### Enhanced main.ts

**New Features**:
1. Argument validation with helpful error messages
2. Authentication validation (Anthropic or AWS Bedrock)
3. Model configuration validation
4. Report generation in 3 formats (JSON, Markdown, HTML)
5. User-friendly output with progress indicators

#### Validation Functions

**validateArguments(args)**

Checks:
- All three arguments provided (owner, repo, prNumber)
- owner and repo not empty strings
- prNumber is valid positive integer

Provides helpful error messages on failure:
```
❌ Error: Missing required arguments

Usage: npm run dev -- <owner> <repo> <prNumber>
Example: npm run dev -- octocat Hello-World 1

Arguments:
  <owner>    - GitHub repository owner
  <repo>     - GitHub repository name
  <prNumber> - Pull request number (must be a positive integer)
```

**validateAuthentication()**

Checks for one of:
1. ANTHROPIC_API_KEY (Anthropic API)
2. AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY (AWS Bedrock)

Optional:
- AWS_REGION (defaults to us-east-1)

Logs which method is being used.

**validateModelConfiguration()**

Checks:
- ANTHROPIC_MODEL environment variable set
- Provides helpful examples for both Anthropic and Bedrock

#### Report Generation

After analysis completes:

1. Generate JSON: Pretty-printed, complete data
2. Generate Markdown: Human-readable, structured
3. Generate HTML: Interactive, styled visualization

Files saved to `reports/` directory:
```
reports/owner_repo_prNumber.json
reports/owner_repo_prNumber.md
reports/owner_repo_prNumber.html
```

#### User Output

```
📋 Code Review System - Part 2
═══════════════════════════════════════

🔍 Analyzing PR: owner/repo#1

✅ Code Review Completed

Overall Score: 72/100
Code Quality: 75/100
Test Coverage: 68%
Refactoring Opportunities: 3

📝 Generating reports...

✅ Reports saved:

  📄 JSON:     reports/owner_repo_1.json
  📋 Markdown: reports/owner_repo_1.md
  🌐 HTML:     reports/owner_repo_1.html

═══════════════════════════════════════

📌 Summary:
[Report summary text here]
```

#### Error Handling

Comprehensive error messages with helpful guidance:
- Argument validation errors
- Authentication configuration errors
- Model configuration errors
- Runtime errors with optional stack traces

Enable debug output:
```bash
DEBUG=1 npm run dev -- owner repo pr
```

## 🏗️ Report Generator Enhancement

### Multiple Output Formats

#### JSON Format
- Complete data structure
- Pretty-printed for readability
- Machine-parseable
- Contains all analysis details

#### Markdown Format
- Executive summary at top
- Organized sections for each analysis
- Code blocks for patterns
- Bulleted lists for findings
- Good for GitHub issues/PRs

**Structure**:
```
# Code Review Report
- Repository info
- Executive Summary
- Code Quality Analysis (score, summary, issues)
- Test Coverage Analysis (coverage %, gaps, suggestions)
- Refactoring Opportunities (opportunities, suggestions)
```

#### HTML Format
- Beautiful, interactive design
- Color-coded severity levels
- Responsive grid layouts
- Styled code blocks
- Professional presentation
- Ready to share with stakeholders

**Features**:
- Color gradient header with repository info
- Circular score badge
- Color-coded severity badges (high=red, medium=orange, low=blue)
- Priority badges for test suggestions
- Impact/effort visualization for refactorings
- Mobile-responsive design

### Saving Reports

```typescript
const paths = await ReportGenerator.saveReports(report);
// {
//   json: "reports/owner_repo_1.json",
//   markdown: "reports/owner_repo_1.md",
//   html: "reports/owner_repo_1.html"
// }
```

## 📋 Phase 6: Testing

### Unit Tests (`tests/schemas.test.ts`)

Comprehensive test coverage for all Zod schemas:

**Test Categories**:

1. **Valid Data Tests**: Confirm schemas accept valid data
2. **Invalid Data Tests**: Confirm schemas reject invalid data
3. **Edge Case Tests**: Boundary values, empty arrays, special characters
4. **Type Tests**: Wrong types are rejected
5. **Enum Tests**: Only valid enum values accepted

**Running Tests**:
```bash
npm test
```

**Example Test Cases**:

```typescript
// Valid severity levels
SeveritySchema.parse('high')     // ✓
SeveritySchema.parse('critical') // ✗ throws

// Issue validation
IssueSchema.parse({
  id: 'issue-001',
  title: 'Bug',
  description: 'Description',
  severity: 'high',
  file: 'src/file.ts',
  line: 42,
  suggestion: 'Fix it'
}) // ✓

// Score ranges
CodeQualityResultSchema.parse({ ..., score: 100 }) // ✓
CodeQualityResultSchema.parse({ ..., score: 150 }) // ✗ throws

// Optional fields
IssueSchema.parse({
  id, title, description, severity, file
  // line is optional ✓
})
```

## 🔧 Integration Guide

### Using Error Handler

```typescript
import { withRetry, withTimeout, withRetryAndTimeout } from './utils/error-handler.js';

// Simple retry
const result = await withRetry(
  () => apiCall(),
  { maxRetries: 3, initialDelayMs: 1000 }
);

// With timeout
const result = await withTimeout(
  () => apiCall(),
  { timeoutMs: 30000 }
);

// Combined
const result = await withRetryAndTimeout(
  () => apiCall(),
  { maxRetries: 3, initialDelayMs: 1000 },
  { timeoutMs: 30000 }
);
```

### Using Rate Limiter

```typescript
import { RateLimiter } from './utils/rate-limiter.js';

const limiter = new RateLimiter({
  maxConcurrentRequests: 5,
  maxRequestsPerMinute: 60,
  maxTokensPerMinute: 90000
});

// Acquire token before operation
await limiter.acquire(estimatedTokens);

try {
  // Perform operation
  const result = await orchestrator.reviewPullRequest(...);
  return result;
} finally {
  limiter.release();  // Always release
}

// Check status
console.log(limiter.getStatus());
// {
//   activeRequests: 2,
//   requestsInWindow: 45,
//   tokensUsedInWindow: 67500,
//   ...
// }
```

### Error Handling in Orchestrator

```typescript
try {
  const report = await orchestrator.reviewPullRequest(owner, repo, prNumber);
} catch (error) {
  if (error instanceof ReviewError) {
    switch(error.code) {
      case 'RETRY_EXHAUSTED':
        console.error('All retries failed:', error.message);
        break;
      case 'TIMEOUT':
        console.error('Operation timed out:', error.message);
        break;
    }
  }
}
```

## 📊 Architecture Update

```
CLI Layer (main.ts)
  ├── Argument Validation
  ├── Authentication Validation
  └── Model Configuration Validation
        ↓
  Rate Limiter
  └── Acquire → Orchestrator → Release
        ↓
  Error Handler
  └── withRetry & withTimeout wrapping
        ↓
  Orchestrator
  └── reviewPullRequest(owner, repo, prNumber)
        ↓
  Claude API
        ↓
  Report Generator
  ├── formatJSON()
  ├── generateMarkdown()
  ├── generateHTML()
  └── saveReports()
        ↓
  Output (3 file formats)
```

## 🧪 Testing Strategy

### Unit Tests (Schemas)
- Test each Zod schema independently
- Verify validation rules
- Test edge cases
- Run: `npm test`

### Integration Tests
- Test complete flow from CLI to reports
- Verify error handling works
- Run: `npm run dev -- [owner] [repo] [prNumber]`

### Manual Testing
- Run against real PRs from test repository
- Verify report generation
- Check HTML rendering in browser
- Validate Markdown in GitHub

## 📈 Performance Considerations

### Rate Limiter Performance
- Pruning: O(n) where n = requests in 60s window
- Typically n < 100, so negligible
- Sliding window is more efficient than fixed buckets for real-time

### Report Generation
- JSON: Instant (direct serialization)
- Markdown: ~100ms (string building)
- HTML: ~200ms (complex rendering)
- File I/O: ~50ms per format

### Error Handler Overhead
- Retry delay grows exponentially (1s, 2s, 4s, 8s, etc.)
- Jitter adds 0-100ms randomness
- Timeout uses Promise.race (minimal overhead)

## 🚀 Deployment Considerations

### Environment Variables

**Required**:
- `ANTHROPIC_API_KEY` OR (`AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`)

**Optional**:
- `ANTHROPIC_MODEL` (defaults to claude-opus-4-5-20251101)
- `AWS_REGION` (defaults to us-east-1)
- `DEBUG` (set to 1 for verbose logging)

### File System Requirements
- Write access to create `reports/` directory
- Sufficient disk space for HTML reports (~500KB each)

### Network Requirements
- Outbound HTTPS to Anthropic API or AWS Bedrock
- Rate limits configured for your API tier

## 📚 Configuration Examples

### High Throughput Setup
```typescript
new RateLimiter({
  maxConcurrentRequests: 10,
  maxRequestsPerMinute: 120,
  maxTokensPerMinute: 300000
});

withRetryAndTimeout(
  () => apiCall(),
  { maxRetries: 5, initialDelayMs: 500 },
  { timeoutMs: 60000 }
);
```

### Conservative Setup
```typescript
new RateLimiter({
  maxConcurrentRequests: 2,
  maxRequestsPerMinute: 20,
  maxTokensPerMinute: 30000
});

withRetryAndTimeout(
  () => apiCall(),
  { maxRetries: 3, initialDelayMs: 2000 },
  { timeoutMs: 30000 }
);
```

## 🔍 Troubleshooting

### "RETRY_EXHAUSTED" Error
- Check API rate limits
- Increase maxRetries in retry configuration
- Increase maxDelayMs to wait longer between attempts
- Reduce concurrent requests with rate limiter

### "TIMEOUT" Error
- Increase timeoutMs value
- Check network connectivity
- Verify API is responding
- Try with smaller PRs (fewer files to analyze)

### Reports Not Generated
- Check write permissions to reports/ directory
- Verify disk space available
- Check for errors in validation

### Low Test Coverage
- Run with DEBUG=1 to see detailed logs
- Verify test-coverage-analyzer is being invoked
- Check promptsreferences expected output format

## 📦 Deliverables Summary

Part 2 adds:
✅ Error handler with exponential backoff (withRetry)
✅ Timeout wrapper (withTimeout)
✅ Rate limiter with sliding window
✅ Enhanced CLI with validation
✅ Report generation (JSON, Markdown, HTML)
✅ Comprehensive unit tests
✅ Error handling throughout system
✅ User-friendly output messages
✅ Production-ready configuration options

Total new code: ~1500 lines (error-handler, rate-limiter, report-generator enhancements, main validation, tests)
