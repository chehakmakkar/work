import { z } from 'zod';
export const SeveritySchema = z.enum(['low', 'medium', 'high']);
export const IssueSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    severity: SeveritySchema,
    file: z.string(),
    line: z.number().optional(),
    suggestion: z.string().optional(),
});
export const CodeQualityResultSchema = z.object({
    agent: z.literal('code-quality-analyzer'),
    summary: z.string(),
    issues: z.array(IssueSchema),
    score: z.number().min(0).max(100),
    topRisks: z.array(z.string()),
});
export const TestCaseSchema = z.object({
    description: z.string(),
    reason: z.string(),
    affectedFunctions: z.array(z.string()),
    priority: z.enum(['high', 'medium', 'low']),
});
export const TestCoverageResultSchema = z.object({
    agent: z.literal('test-coverage-analyzer'),
    summary: z.string(),
    coverageGaps: z.array(IssueSchema),
    suggestedTestCases: z.array(TestCaseSchema),
    estimatedCoverage: z.number().min(0).max(100),
});
export const RefactoringOpportunitySchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    currentPattern: z.string(),
    suggestedPattern: z.string(),
    files: z.array(z.string()),
    impact: z.enum(['low', 'medium', 'high']),
    effort: z.enum(['low', 'medium', 'high']),
});
export const RefactoringResultSchema = z.object({
    agent: z.literal('refactoring-suggester'),
    summary: z.string(),
    opportunities: z.array(RefactoringOpportunitySchema),
    modernizationSuggestions: z.array(z.string()),
});
export const ReviewReportSchema = z.object({
    owner: z.string(),
    repo: z.string(),
    prNumber: z.number(),
    codeQuality: CodeQualityResultSchema,
    testCoverage: TestCoverageResultSchema,
    refactoring: RefactoringResultSchema,
    overallScore: z.number().min(0).max(100),
    summary: z.string(),
    timestamp: z.string().datetime(),
});
