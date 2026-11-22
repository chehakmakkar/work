import { query } from '@anthropic-ai/claude-agent-sdk';
import { codeQualityAnalyzer, testCoverageAnalyzer, refactoringSuggester } from './agents/index.js';
import { orchestratorPrompt } from './prompts/index.js';
import { ReviewReport, ReviewReportSchema } from './types/index.js';
import { Logger } from './utils/logger.js';
import { mcpConfig } from './config/mcp.config.js';

export class Orchestrator {
  async reviewPullRequest(owner: string, repo: string, prNumber: number): Promise<ReviewReport> {
    Logger.info('Starting code review with Agent SDK', { owner, repo, prNumber });

    // Build the prompt with PR information and instructions
    const prompt = `${orchestratorPrompt}

Please review the following GitHub pull request:
- Repository: ${owner}/${repo}
- Pull Request Number: #${prNumber}

Fetch the PR data using GitHub MCP tools, then invoke all three subagents (code-quality-analyzer, test-coverage-analyzer, and refactoring-suggester) to analyze different aspects of the code.

Return the final analysis as a valid JSON object matching the ReviewReportSchema.`;

    try {
      Logger.info('Initiating Agent SDK query with MCP servers and subagents');

      let finalResult = '';

      // Use the Claude Agent SDK query function
      const stream = query({
        prompt,
        options: {
          mcpServers: mcpConfig.servers,
          allowedTools: [
            'mcp__github',
            'mcp__eslint',
            'Task',
            'Read',
            'Grep',
            'Glob',
            'Skill',
          ],
          agents: {
            'code-quality-analyzer': codeQualityAnalyzer,
            'test-coverage-analyzer': testCoverageAnalyzer,
            'refactoring-suggester': refactoringSuggester,
          },
          maxTurns: 20,
        },
      });

      // Collect the final result from the event stream
      for await (const event of stream) {
        if (event.type === 'assistant') {
          // The assistant event contains the final response with text content
          if (typeof (event as Record<string, unknown>).text === 'string') {
            finalResult = (event as Record<string, unknown>).text as string;
          } else if ('content' in event) {
            const content = (event as Record<string, unknown>).content;
            if (Array.isArray(content)) {
              for (const block of content) {
                if (typeof block === 'object' && block !== null && (block as Record<string, unknown>).type === 'text') {
                  finalResult += (block as Record<string, unknown>).text;
                }
              }
            }
          }
        }
        // Log progress for other event types
        if (event.type === 'tool_progress' || event.type === 'stream_event') {
          Logger.debug('Agent event', { eventType: event.type });
        }
      }

      if (!finalResult) {
        throw new Error('No result received from agent orchestration');
      }

      Logger.debug('Raw agent result', { result: finalResult.substring(0, 200) });

      // Clean up response - remove markdown code blocks if present
      let cleanedResponse = finalResult.trim();

      // Remove markdown code block markers if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.substring(7);
      } else if (cleanedResponse.startsWith('```')) {
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
    } catch (error) {
      Logger.error('Error during orchestration', error);
      throw error;
    }
  }
}
