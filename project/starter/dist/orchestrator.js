import Anthropic from '@anthropic-ai/sdk';
import { ReviewReportSchema } from './types/index.js';
import { Logger } from './utils/logger.js';
export class Orchestrator {
    constructor() {
        this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }
    async reviewPullRequest(owner, repo, prNumber) {
        Logger.info('Starting code review', { owner, repo, prNumber });
        // Build the user message with PR information
        const userMessage = `Please review the following GitHub pull request and provide a comprehensive code review analysis:

Repository: ${owner}/${repo}
Pull Request Number: #${prNumber}

Analyze this PR by conducting three specialized analyses:

1. **Code Quality Analysis**: Identify security vulnerabilities, performance issues, and maintainability concerns
2. **Test Coverage Analysis**: Evaluate test completeness and suggest specific test cases
3. **Refactoring Opportunities**: Identify structural improvements and modernization opportunities

IMPORTANT: Respond with ONLY a valid JSON object (no markdown, no code blocks, no explanations).

The JSON MUST have this exact structure with ALL required fields:
{
  "owner": "${owner}",
  "repo": "${repo}",
  "prNumber": ${prNumber},
  "codeQuality": {
    "agent": "code-quality-analyzer",
    "summary": "Summary of code quality assessment",
    "issues": [
      {
        "id": "code-001",
        "title": "Security Issue",
        "description": "Detailed description of the issue",
        "severity": "high",
        "file": "src/example.ts",
        "line": 42,
        "suggestion": "Recommended fix or improvement"
      }
    ],
    "score": 75,
    "topRisks": ["Risk 1", "Risk 2", "Risk 3"]
  },
  "testCoverage": {
    "agent": "test-coverage-analyzer",
    "summary": "Summary of test coverage assessment",
    "coverageGaps": [
      {
        "id": "test-001",
        "title": "Missing tests for error handling",
        "description": "Detailed description of the gap",
        "severity": "high",
        "file": "src/example.ts",
        "suggestion": "Add tests for error scenarios"
      }
    ],
    "suggestedTestCases": [
      {
        "description": "Test case description",
        "reason": "Why this test is important",
        "affectedFunctions": ["functionName"],
        "priority": "high"
      }
    ],
    "estimatedCoverage": 68
  },
  "refactoring": {
    "agent": "refactoring-suggester",
    "summary": "Summary of refactoring opportunities",
    "opportunities": [
      {
        "id": "refactor-001",
        "title": "Extract common logic into utility function",
        "description": "Detailed description of the opportunity",
        "currentPattern": "Current code pattern or practice",
        "suggestedPattern": "Suggested improvement or pattern",
        "files": ["src/example.ts", "src/other.ts"],
        "impact": "high",
        "effort": "medium"
      }
    ],
    "modernizationSuggestions": ["Use modern async/await", "Adopt TypeScript strict mode"]
  },
  "overallScore": 72,
  "summary": "Overall comprehensive assessment and recommendations",
  "timestamp": "${new Date().toISOString()}"
}`;
        try {
            Logger.info('Calling Claude for code review');
            const response = await this.client.messages.create({
                model: 'claude-opus-4-5-20251101',
                max_tokens: 4096,
                system: `You are an expert code review analyzer. Analyze GitHub pull requests and provide comprehensive reviews.
When analyzing a PR for ${owner}/${repo} #${prNumber}, provide thorough assessment of code quality, test coverage, and refactoring opportunities.
Return ONLY valid JSON with no additional text, markdown, or explanations.`,
                messages: [
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
            });
            // Extract text content from response
            let responseText = '';
            for (const block of response.content) {
                if (block.type === 'text') {
                    responseText += block.text;
                }
            }
            if (!responseText) {
                throw new Error('No text response received from orchestrator');
            }
            Logger.debug('Raw response', { response: responseText.substring(0, 200) });
            // Clean up response - remove markdown code blocks if present
            let cleanedResponse = responseText.trim();
            // Remove markdown code block markers if present
            if (cleanedResponse.startsWith('```json')) {
                cleanedResponse = cleanedResponse.substring(7);
            }
            else if (cleanedResponse.startsWith('```')) {
                cleanedResponse = cleanedResponse.substring(3);
            }
            if (cleanedResponse.endsWith('```')) {
                cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length - 3);
            }
            cleanedResponse = cleanedResponse.trim();
            // Extract JSON from response - look for first { and last }
            const jsonStart = cleanedResponse.indexOf('{');
            const jsonEnd = cleanedResponse.lastIndexOf('}');
            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error(`No JSON object found in response. Got: ${cleanedResponse.substring(0, 200)}`);
            }
            const jsonStr = cleanedResponse.substring(jsonStart, jsonEnd + 1);
            Logger.debug('Cleaned JSON', { json: jsonStr.substring(0, 300) });
            const output = JSON.parse(jsonStr);
            const validatedReport = ReviewReportSchema.parse(output);
            Logger.info('Code review completed successfully', {
                overallScore: validatedReport.overallScore,
            });
            return validatedReport;
        }
        catch (error) {
            Logger.error('Error during orchestration', error);
            throw error;
        }
    }
}
