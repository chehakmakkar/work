# Multi-Agent Code Review System

A sophisticated code review system using Claude AI with specialized subagents for comprehensive pull request analysis.

## Project Structure

```
project/starter/
├── src/
│   ├── agents/                    # Subagent definitions
│   │   ├── code-quality-analyzer.ts
│   │   ├── test-coverage-analyzer.ts
│   │   ├── refactoring-suggester.ts
│   │   └── index.ts
│   ├── prompts/                   # Agent and orchestrator prompts
│   │   ├── orchestrator.prompt.ts
│   │   ├── code-quality-analyzer.prompt.ts
│   │   ├── test-coverage-analyzer.prompt.ts
│   │   ├── refactoring-suggester.prompt.ts
│   │   └── index.ts
│   ├── config/                    # MCP server configurations
│   │   └── mcp.config.ts
│   ├── utils/                     # Utility modules
│   │   ├── logger.ts
│   │   ├── report-generator.ts
│   │   └── index.ts
│   ├── types/                     # Zod schemas for data validation
│   │   └── index.ts
│   ├── orchestrator.ts            # Main coordination logic
│   └── main.ts                    # CLI entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Setup

1. **Clone/Setup the project:**
   ```bash
   cd project/starter
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys:
   # - ANTHROPIC_API_KEY: Your Claude API key
   # - GITHUB_TOKEN: Your GitHub personal access token (for future PR data fetching)
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

## Running a Code Review

```bash
npm run dev -- <owner> <repo> <prNumber>
```

### Example:
```bash
npm run dev -- octocat Hello-World 1
```

This will:
1. Fetch the specified PR from GitHub
2. Run three specialized analyses:
   - **Code Quality Analysis**: Security vulnerabilities, performance issues, maintainability
   - **Test Coverage Analysis**: Test completeness and suggested test cases
   - **Refactoring Opportunities**: Structural improvements and modernization suggestions
3. Output a comprehensive JSON report

## System Architecture

### Three Specialized Agents

#### 1. Code Quality Analyzer
- Analyzes security vulnerabilities
- Identifies performance issues
- Finds maintainability concerns
- Provides severity ratings (high/medium/low)
- Returns issues with specific line numbers and suggestions

#### 2. Test Coverage Analyzer
- Estimates test coverage percentage
- Identifies coverage gaps
- Suggests specific test cases
- Prioritizes tests by impact
- Maps uncovered functions and branches

#### 3. Refactoring Suggester
- Identifies design pattern opportunities
- Suggests modernization improvements
- Proposes code structure enhancements
- Assesses impact and effort levels
- Differentiates from pure code quality issues

### Orchestrator

The orchestrator coordinates all three agents:
- Routes analysis requests to specialized agents
- Aggregates results into a comprehensive report
- Calculates overall code quality score
- Provides executive summary

## Data Structures

All data is validated using Zod schemas. Key schemas:

- **ReviewReport**: Complete code review output
- **CodeQualityResult**: Security and performance analysis
- **TestCoverageResult**: Test coverage assessment
- **RefactoringResult**: Refactoring opportunities
- **Issue**: Individual code issue with severity and location
- **TestCase**: Suggested test case with rationale
- **RefactoringOpportunity**: Code improvement opportunity with effort/impact

## Configuration

### MCP Servers

The system is designed to integrate with:
- **GitHub MCP**: For fetching PR data
- **ESLint MCP**: For code quality analysis

Configuration in `src/config/mcp.config.ts`:
```typescript
export const mcpConfig = {
  servers: {
    github: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN }
    },
    eslint: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-eslint'],
      env: {}
    }
  }
};
```

## Development

### TypeScript Compilation
```bash
npm run build
```

### Development Mode (with auto-reload)
```bash
npm run dev -- octocat Hello-World 1
```

## Output Format

The system returns a structured JSON report:

```json
{
  "owner": "string",
  "repo": "string",
  "prNumber": number,
  "codeQuality": {
    "agent": "code-quality-analyzer",
    "summary": "string",
    "issues": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "severity": "high|medium|low",
        "file": "string",
        "line": number,
        "suggestion": "string"
      }
    ],
    "score": 0-100,
    "topRisks": ["string"]
  },
  "testCoverage": {
    "agent": "test-coverage-analyzer",
    "summary": "string",
    "coverageGaps": [...],
    "suggestedTestCases": [...],
    "estimatedCoverage": 0-100
  },
  "refactoring": {
    "agent": "refactoring-suggester",
    "summary": "string",
    "opportunities": [...],
    "modernizationSuggestions": ["string"]
  },
  "overallScore": 0-100,
  "summary": "string",
  "timestamp": "ISO 8601 datetime"
}
```

## Part 2 (Coming Next)

The next phase will add:
- Error handling with exponential backoff retry logic
- Rate limiting to prevent API throttling
- Complete CLI application with argument validation
- Comprehensive unit and integration tests
- Final deliverables: 9 PR reports for submission

## Notes

- The system uses Claude Opus 4.5 for orchestration
- All responses are validated against Zod schemas
- Logging is available via the Logger utility
- Reports can be formatted as Markdown or saved to files

## Troubleshooting

### "No text response received"
- Verify ANTHROPIC_API_KEY is set correctly
- Check API rate limits
- Ensure the PR data is valid

### Type Errors
- Run `npm run build` to verify TypeScript compilation
- Check that all imports use `.js` extensions (ES modules)

### Empty Analysis Results
- Ensure the PR exists and is accessible
- Check GitHub token permissions if using real PR data
- Verify agent prompts are correct
