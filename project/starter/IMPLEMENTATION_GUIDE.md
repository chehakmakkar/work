# Implementation Guide

## Part 1: Complete Implementation Overview

This guide explains the complete architecture and implementation of the multi-agent code review system.

## System Architecture

### Core Components

```
┌─────────────────────────────────────────────────────┐
│                   Main Entry Point                   │
│                   (src/main.ts)                      │
│          Accepts: owner, repo, prNumber              │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              Orchestrator Class                      │
│            (src/orchestrator.ts)                     │
│   • Coordinates subagent execution                   │
│   • Aggregates results                              │
│   • Validates output against schemas                │
│   • Returns ReviewReport                            │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼────┐ ┌────▼──────┐ ┌──▼─────────┐
│   Agent 1  │ │  Agent 2  │ │  Agent 3   │
│  CodeQA    │ │ TestCov   │ │ Refactor   │
│ Analyzer   │ │ Analyzer  │ │ Suggester  │
└────────────┘ └───────────┘ └────────────┘
```

## Component Details

### 1. Main Entry Point (`src/main.ts`)

**Responsibility**: Parse CLI arguments and instantiate orchestrator

```typescript
// Accepts three command-line arguments:
// npm run dev -- <owner> <repo> <prNumber>

// Flow:
// 1. Parse and validate arguments
// 2. Create Orchestrator instance
// 3. Call reviewPullRequest(owner, repo, prNumber)
// 4. Output JSON result
// 5. Exit with appropriate code
```

**Key Features**:
- Error handling for invalid arguments
- Logging via Logger utility
- JSON output to stdout

### 2. Orchestrator (`src/orchestrator.ts`)

**Responsibility**: Coordinate analysis and aggregate results

```typescript
class Orchestrator {
  async reviewPullRequest(owner, repo, prNumber): ReviewReport {
    // 1. Build PR analysis prompt
    // 2. Call Claude with system prompt
    // 3. Parse and validate JSON response
    // 4. Return validated ReviewReport
  }
}
```

**Key Features**:
- Uses Claude Opus 4.5 for analysis
- System prompt guides the model to simulate three agents
- JSON extraction with fallback parsing
- Zod schema validation
- Comprehensive error handling

**How It Works**:
1. Orchestrator sends a detailed prompt to Claude
2. Prompt instructs Claude to analyze from 3 perspectives
3. Claude returns structured JSON with all analyses
4. Result is validated and returned to caller

### 3. Agents (`src/agents/`)

**Three specialized agents**, each with specific focus:

#### Code Quality Analyzer (`code-quality-analyzer.ts`)
```typescript
interface CodeQualityAnalyzer {
  name: 'code-quality-analyzer',
  description: 'Analyzes security, performance, maintainability',
  instructions: 'Detailed prompt for analysis'
}
```

**Analyzes**:
- Security vulnerabilities (injection, auth, crypto, etc.)
- Performance issues (algorithms, memory, DB queries)
- Maintainability (complexity, naming, error handling)

**Output Schema**:
```typescript
{
  agent: "code-quality-analyzer",
  summary: "string",
  issues: Issue[],  // With severity: high|medium|low
  score: 0-100,
  topRisks: string[]
}
```

#### Test Coverage Analyzer (`test-coverage-analyzer.ts`)
```typescript
interface TestCoverageAnalyzer {
  name: 'test-coverage-analyzer',
  description: 'Evaluates test completeness',
  instructions: 'Detailed prompt for analysis'
}
```

**Analyzes**:
- Coverage gaps (untested functions)
- Branch coverage (if/else not covered)
- Edge cases (null, empty, boundary values)
- Error handling

**Output Schema**:
```typescript
{
  agent: "test-coverage-analyzer",
  summary: "string",
  coverageGaps: Issue[],
  suggestedTestCases: TestCase[],
  estimatedCoverage: 0-100
}
```

#### Refactoring Suggester (`refactoring-suggester.ts`)
```typescript
interface RefactoringSuggester {
  name: 'refactoring-suggester',
  description: 'Identifies improvement opportunities',
  instructions: 'Detailed prompt for analysis'
}
```

**Analyzes**:
- Design pattern opportunities
- Modernization (new language features, API updates)
- Code structure (decomposition, single responsibility)
- Code clarity improvements

**Output Schema**:
```typescript
{
  agent: "refactoring-suggester",
  summary: "string",
  opportunities: RefactoringOpportunity[],
  modernizationSuggestions: string[]
}
```

### 4. Prompts (`src/prompts/`)

Each component has a specialized prompt:

#### Orchestrator Prompt (`orchestrator.prompt.ts`)
- **Role**: Main coordinator
- **Task**: Fetch PR data, invoke agents, aggregate
- **Output**: Complete ReviewReport

#### Agent Prompts
- **Code Quality**: Security, performance, maintainability criteria
- **Test Coverage**: Gap analysis, test suggestion criteria
- **Refactoring**: Pattern opportunities, modernization focus

**Key Prompt Principles**:
1. **Specificity**: Clear about what to analyze
2. **Criteria**: Define severity levels and priorities
3. **Format**: Exact JSON structure expected
4. **Examples**: Show good vs. bad findings

### 5. Types (`src/types/index.ts`)

**Zod Schemas** for type safety:

```typescript
// Base schemas
Severity = z.enum(['low', 'medium', 'high'])
Issue = { id, title, description, severity, file, line, suggestion }

// Result schemas
CodeQualityResult = { agent, summary, issues, score, topRisks }
TestCoverageResult = { agent, summary, coverageGaps, suggestedTestCases, estimatedCoverage }
RefactoringResult = { agent, summary, opportunities, modernizationSuggestions }

// Final output
ReviewReport = {
  owner, repo, prNumber,
  codeQuality: CodeQualityResult,
  testCoverage: TestCoverageResult,
  refactoring: RefactoringResult,
  overallScore: 0-100,
  summary: string,
  timestamp: ISO 8601
}
```

**Benefits**:
- Runtime validation of responses
- Type safety in TypeScript
- Clear data contracts
- Early error detection

### 6. Configuration (`src/config/mcp.config.ts`)

**MCP Server Configuration** for external tools:

```typescript
mcpConfig = {
  servers: {
    github: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: { GITHUB_TOKEN }
    },
    eslint: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-eslint'],
      env: {}
    }
  }
}
```

**Purpose**: Enable integration with external tools (Part 2)

### 7. Utilities (`src/utils/`)

#### Logger (`logger.ts`)
```typescript
class Logger {
  static info(message, data?)
  static error(message, error?)
  static warn(message, data?)
  static debug(message, data?)  // Only if DEBUG env var set
}
```

#### Report Generator (`report-generator.ts`)
```typescript
class ReportGenerator {
  static formatReport(report): string
  static generateMarkdown(report): string
  static saveReport(report, filePath): void
}
```

## Data Flow

### Complete Request Flow

```
User Input (CLI args)
    ↓
main.ts: Parse and validate
    ↓
Orchestrator: Create instance
    ↓
reviewPullRequest(owner, repo, prNumber)
    ↓
Build system prompt + user message
    ↓
Call Claude Opus 4.5 API
    ↓
Claude analyzes from 3 perspectives
    ↓
Return structured JSON
    ↓
Parse JSON response
    ↓
Validate against ReviewReportSchema
    ↓
Return ReviewReport to main
    ↓
Output JSON to stdout
```

## Key Design Decisions

### 1. Single-Call Multi-Agent Pattern
Instead of separate API calls per agent, we use one Claude call with a prompt that instructs the model to analyze from multiple perspectives. This is more efficient and maintains consistency.

**Pros**:
- Single API call vs. three separate calls
- Consistent context across analyses
- Faster execution
- Lower latency

**Cons**:
- Less specialization per agent
- Harder to independently iterate on agents

### 2. Zod Validation
All responses are validated against Zod schemas before returning.

**Pros**:
- Runtime type safety
- Clear data contracts
- Fails fast on invalid data
- Better error messages

**Cons**:
- Extra validation overhead
- Stricter requirements on output

### 3. Explicit Agent Definition
Agents are defined as simple data objects, not full classes.

**Pros**:
- Simple and lightweight
- Easy to extend
- Clear separation of concerns

**Cons**:
- Less encapsulation
- Logic lives in prompts

## Extension Points

### Part 2 Enhancements

The current implementation is designed to easily extend to:

1. **Error Handling**
   - Add retry logic with exponential backoff
   - Implement timeout handling
   - Add partial failure recovery

2. **Rate Limiting**
   - Add token bucket rate limiter
   - Implement queue management
   - Cache common results

3. **MCP Integration**
   - Actually use GitHub MCP server
   - Integrate ESLint MCP
   - Real PR data fetching

4. **CLI Enhancement**
   - Add argument validation
   - Support config files
   - Add output formatting options

5. **Testing**
   - Unit tests per module
   - Integration tests for orchestration
   - Mock API responses

## Performance Characteristics

### API Calls
- **Single call** to Claude Opus 4.5
- Typical response time: 5-15 seconds
- Token usage: ~3000-5000 tokens (depending on PR size)

### Memory Usage
- JSON parsing and validation
- Minimal memory footprint
- No intermediate caching

### Scalability
- Currently designed for single PR review
- Part 2 will add batching capabilities

## Troubleshooting Guide

### "Cannot find module" errors
- Ensure all imports use `.js` extensions (ES modules)
- Run `npm run build` to verify compilation

### "No text response received"
- Check ANTHROPIC_API_KEY is set correctly
- Verify API quota not exceeded
- Check network connectivity

### Validation errors
- Inspect raw Claude response (enable DEBUG mode)
- Verify prompt generates valid JSON
- Check schema matches response structure

### Type errors during build
- Run `npm run build` to see full error
- Check for missing type annotations
- Verify Zod schema definitions

## Testing the System

### Quick Validation
```bash
npm run build                              # Verify compilation
npm run dev -- octocat Hello-World 1      # Run with example PR
```

### Expected Success Indicators
✅ Build completes without errors
✅ Main.ts accepts command-line arguments
✅ Orchestrator successfully calls Claude API
✅ Response is valid JSON
✅ Output matches ReviewReportSchema

## Next Steps (Part 2)

The foundation is complete. Next phase will add:
1. Production-grade error handling
2. Rate limiting and retry logic
3. Full CLI with validation
4. Comprehensive test suite
5. 9 PR reports for final submission
