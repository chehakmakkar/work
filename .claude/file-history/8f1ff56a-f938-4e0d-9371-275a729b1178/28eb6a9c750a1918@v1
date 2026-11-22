# Quick Start Guide

## 1. Setup (30 seconds)

```bash
cd project/starter
npm install
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=sk-...
```

## 2. Build (10 seconds)

```bash
npm run build
```

## 3. Run (requires real PR data)

```bash
npm run dev -- octocat Hello-World 1
```

Replace with actual GitHub repository and PR number.

## What Happens

1. **Orchestrator** receives the PR coordinates
2. **Three Agents** analyze the PR simultaneously:
   - 🔒 Code Quality Analyzer (security, performance, maintainability)
   - 🧪 Test Coverage Analyzer (test gaps and suggestions)
   - 🔧 Refactoring Suggester (design improvements)
3. **Aggregation** combines results into one comprehensive report
4. **Output** is validated JSON matching the ReviewReport schema

## Expected Output

A JSON report containing:
- **Code Quality Score** (0-100) with security vulnerabilities and performance issues
- **Test Coverage** (0-100%) with specific test suggestions
- **Refactoring Opportunities** ranked by impact/effort
- **Overall Score** (0-100) synthesizing all three analyses

## Example Output Structure

```json
{
  "owner": "octocat",
  "repo": "Hello-World",
  "prNumber": 1,
  "overallScore": 72,
  "summary": "Good code quality with minor security concerns...",
  "codeQuality": {
    "score": 75,
    "issues": [
      {
        "severity": "high",
        "title": "SQL Injection Risk",
        "file": "src/db.ts",
        "line": 42
      }
    ]
  },
  "testCoverage": {
    "estimatedCoverage": 68,
    "suggestedTestCases": [
      {
        "description": "Test error handling in validateEmail",
        "priority": "high"
      }
    ]
  },
  "refactoring": {
    "opportunities": [
      {
        "title": "Extract authentication logic",
        "impact": "high",
        "effort": "medium"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Key Files to Understand

| File | Purpose |
|------|---------|
| `src/orchestrator.ts` | Main coordination logic - routes to agents and aggregates results |
| `src/agents/*.ts` | Agent definitions - specialized analyzers |
| `src/prompts/*.ts` | Detailed instructions for each agent |
| `src/types/index.ts` | Zod schemas - data validation |
| `src/config/mcp.config.ts` | External tool integration (GitHub, ESLint) |

## Architecture Overview

```
User Request (PR coordinates)
           ↓
    Orchestrator
           ↓
    ┌──────┬──────┬──────┐
    ↓      ↓      ↓      ↓
  CodeQA  TestCov Refactor Aggregator
    ↓      ↓      ↓      ↓
    └──────┴──────┴──────┘
           ↓
    ReviewReport (JSON)
```

## Common Commands

```bash
# Compile TypeScript
npm run build

# Run with real PR data
npm run dev -- owner repo prNumber

# Example with GitHub's official Hello-World repo
npm run dev -- octocat Hello-World 1

# Run tests (when implemented)
npm test
```

## Next Steps

This Part 1 implementation provides:
✅ Full project structure
✅ Three specialized agents
✅ Orchestration logic
✅ Type-safe data validation
✅ Working build pipeline

Part 2 will add:
⬜ Error handling and retries
⬜ Rate limiting
⬜ Complete CLI with validation
⬜ Comprehensive tests
⬜ 9 PR reports for final submission

## Debugging

Enable debug logging:
```bash
DEBUG=1 npm run dev -- octocat Hello-World 1
```

## Notes

- Currently uses mocked PR data (actual GitHub API integration comes in Part 2)
- Orchestrator uses Claude Opus 4.5 for analysis
- All results validated against Zod schemas
- JSON output can be piped to files or processed further
