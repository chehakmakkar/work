import { refactoringSuggesterPrompt } from '../prompts/index.js';
export const refactoringSuggester = {
    name: 'refactoring-suggester',
    description: 'Identifies opportunities to improve code structure and modernize patterns. Looks for design pattern improvements, modernization opportunities, and code clarity enhancements. Differentiates from code quality by focusing on structure and maintainability.',
    instructions: refactoringSuggesterPrompt,
};
