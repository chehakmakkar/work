import { codeQualityAnalyzerPrompt } from '../prompts/index.js';
export const codeQualityAnalyzer = {
    name: 'code-quality-analyzer',
    description: 'Analyzes code for security vulnerabilities, performance issues, and maintainability concerns. Uses code inspection tools and security analysis skills to identify potential risks and provide severity-rated issues.',
    instructions: codeQualityAnalyzerPrompt,
};
