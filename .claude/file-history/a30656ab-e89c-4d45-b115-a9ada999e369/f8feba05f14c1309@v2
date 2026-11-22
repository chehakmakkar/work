import { testCoverageAnalyzerPrompt } from '../prompts/index.js';

export const testCoverageAnalyzer = {
  name: 'test-coverage-analyzer',
  description:
    'Evaluates test completeness and suggests specific test cases. Analyzes the relationship between source files and test files to identify coverage gaps and recommend actionable test cases with clear descriptions and priorities.',
  prompt: testCoverageAnalyzerPrompt,
  model: 'inherit',
  tools: ['Read', 'Grep', 'Glob', 'Skill'],
};
