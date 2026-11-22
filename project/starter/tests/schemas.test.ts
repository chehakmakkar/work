import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  SeveritySchema,
  IssueSchema,
  CodeQualityResultSchema,
  TestCaseSchema,
  TestCoverageResultSchema,
  RefactoringOpportunitySchema,
  RefactoringResultSchema,
  ReviewReportSchema,
} from '../src/types/index.js';

describe('Zod Schemas', () => {
  describe('SeveritySchema', () => {
    it('should accept valid severity levels', () => {
      expect(() => SeveritySchema.parse('high')).not.toThrow();
      expect(() => SeveritySchema.parse('medium')).not.toThrow();
      expect(() => SeveritySchema.parse('low')).not.toThrow();
    });

    it('should reject invalid severity levels', () => {
      expect(() => SeveritySchema.parse('critical')).toThrow();
      expect(() => SeveritySchema.parse('urgent')).toThrow();
      expect(() => SeveritySchema.parse('')).toThrow();
    });
  });

  describe('IssueSchema', () => {
    it('should validate a complete issue', () => {
      const validIssue = {
        id: 'issue-001',
        title: 'SQL Injection vulnerability',
        description: 'User input is directly concatenated into SQL query',
        severity: 'high',
        file: 'src/db.ts',
        line: 42,
        suggestion: 'Use parameterized queries or an ORM',
      };

      expect(() => IssueSchema.parse(validIssue)).not.toThrow();
      const result = IssueSchema.parse(validIssue);
      expect(result.id).toBe('issue-001');
      expect(result.severity).toBe('high');
    });

    it('should validate issue without optional line field', () => {
      const validIssue = {
        id: 'issue-002',
        title: 'Missing error handling',
        description: 'Function does not handle exceptions',
        severity: 'medium',
        file: 'src/utils.ts',
      };

      expect(() => IssueSchema.parse(validIssue)).not.toThrow();
    });

    it('should reject issue with missing required fields', () => {
      const invalidIssue = {
        id: 'issue-003',
        title: 'Bug',
        // missing description, severity, file
      };

      expect(() => IssueSchema.parse(invalidIssue)).toThrow();
    });

    it('should reject issue with wrong severity type', () => {
      const invalidIssue = {
        id: 'issue-004',
        title: 'Issue',
        description: 'Description',
        severity: 'critical', // invalid
        file: 'file.ts',
      };

      expect(() => IssueSchema.parse(invalidIssue)).toThrow();
    });

    it('should reject issue with non-numeric line number', () => {
      const invalidIssue = {
        id: 'issue-005',
        title: 'Issue',
        description: 'Description',
        severity: 'high',
        file: 'file.ts',
        line: 'line 42', // should be number
      };

      expect(() => IssueSchema.parse(invalidIssue)).toThrow();
    });
  });

  describe('CodeQualityResultSchema', () => {
    it('should validate a complete code quality result', () => {
      const result = {
        agent: 'code-quality-analyzer',
        summary: 'Found 2 high-severity issues',
        issues: [
          {
            id: 'cq-001',
            title: 'SQL Injection',
            description: 'Direct SQL concatenation',
            severity: 'high',
            file: 'src/db.ts',
            line: 42,
            suggestion: 'Use parameterized queries',
          },
        ],
        score: 65,
        topRisks: ['SQL Injection', 'Missing validation'],
      };

      expect(() => CodeQualityResultSchema.parse(result)).not.toThrow();
      const parsed = CodeQualityResultSchema.parse(result);
      expect(parsed.score).toBe(65);
      expect(parsed.agent).toBe('code-quality-analyzer');
    });

    it('should reject result with wrong agent name', () => {
      const invalid = {
        agent: 'wrong-agent',
        summary: 'Summary',
        issues: [],
        score: 75,
        topRisks: [],
      };

      expect(() => CodeQualityResultSchema.parse(invalid)).toThrow();
    });

    it('should reject result with score out of range', () => {
      const invalid = {
        agent: 'code-quality-analyzer',
        summary: 'Summary',
        issues: [],
        score: 150, // should be 0-100
        topRisks: [],
      };

      expect(() => CodeQualityResultSchema.parse(invalid)).toThrow();
    });

    it('should validate empty issues array', () => {
      const result = {
        agent: 'code-quality-analyzer',
        summary: 'No issues found',
        issues: [],
        score: 95,
        topRisks: [],
      };

      expect(() => CodeQualityResultSchema.parse(result)).not.toThrow();
    });
  });

  describe('TestCaseSchema', () => {
    it('should validate a complete test case', () => {
      const testCase = {
        description: 'Test that validateEmail rejects invalid formats',
        reason: 'Critical validation function with no test coverage',
        affectedFunctions: ['validateEmail', 'parseEmail'],
        priority: 'high',
      };

      expect(() => TestCaseSchema.parse(testCase)).not.toThrow();
      const parsed = TestCaseSchema.parse(testCase);
      expect(parsed.priority).toBe('high');
    });

    it('should reject test case with invalid priority', () => {
      const invalid = {
        description: 'Test case',
        reason: 'Reason',
        affectedFunctions: [],
        priority: 'urgent', // invalid
      };

      expect(() => TestCaseSchema.parse(invalid)).toThrow();
    });

    it('should validate test case with empty affected functions', () => {
      const testCase = {
        description: 'Test case',
        reason: 'Reason',
        affectedFunctions: [],
        priority: 'low',
      };

      expect(() => TestCaseSchema.parse(testCase)).not.toThrow();
    });
  });

  describe('TestCoverageResultSchema', () => {
    it('should validate a complete test coverage result', () => {
      const result = {
        agent: 'test-coverage-analyzer',
        summary: 'Test coverage is good but has some gaps',
        coverageGaps: [
          {
            id: 'gap-001',
            title: 'Missing error handler test',
            description: 'Exception handling not tested',
            severity: 'medium',
            file: 'src/api.ts',
            line: 50,
          },
        ],
        suggestedTestCases: [
          {
            description: 'Test that API endpoint returns 500 on database error',
            reason: 'Error handling not tested',
            affectedFunctions: ['handleRequest'],
            priority: 'high',
          },
        ],
        estimatedCoverage: 72,
      };

      expect(() => TestCoverageResultSchema.parse(result)).not.toThrow();
      const parsed = TestCoverageResultSchema.parse(result);
      expect(parsed.estimatedCoverage).toBe(72);
      expect(parsed.agent).toBe('test-coverage-analyzer');
    });

    it('should reject result with coverage out of range', () => {
      const invalid = {
        agent: 'test-coverage-analyzer',
        summary: 'Summary',
        coverageGaps: [],
        suggestedTestCases: [],
        estimatedCoverage: 150, // should be 0-100
      };

      expect(() => TestCoverageResultSchema.parse(invalid)).toThrow();
    });

    it('should validate 0% and 100% coverage', () => {
      const zeroCoverage = {
        agent: 'test-coverage-analyzer',
        summary: 'No tests',
        coverageGaps: [],
        suggestedTestCases: [],
        estimatedCoverage: 0,
      };

      const fullCoverage = {
        agent: 'test-coverage-analyzer',
        summary: 'Full coverage',
        coverageGaps: [],
        suggestedTestCases: [],
        estimatedCoverage: 100,
      };

      expect(() => TestCoverageResultSchema.parse(zeroCoverage)).not.toThrow();
      expect(() => TestCoverageResultSchema.parse(fullCoverage)).not.toThrow();
    });
  });

  describe('RefactoringOpportunitySchema', () => {
    it('should validate a complete refactoring opportunity', () => {
      const opportunity = {
        id: 'refactor-001',
        title: 'Extract authentication logic',
        description: 'Authentication code is repeated in multiple controllers',
        currentPattern: 'if (!req.user) return 401;',
        suggestedPattern: 'Use middleware: app.use(authMiddleware);',
        files: ['src/controllers/user.ts', 'src/controllers/admin.ts'],
        impact: 'high',
        effort: 'medium',
      };

      expect(() => RefactoringOpportunitySchema.parse(opportunity)).not.toThrow();
      const parsed = RefactoringOpportunitySchema.parse(opportunity);
      expect(parsed.impact).toBe('high');
      expect(parsed.effort).toBe('medium');
    });

    it('should reject opportunity with invalid impact', () => {
      const invalid = {
        id: 'refactor-002',
        title: 'Title',
        description: 'Description',
        currentPattern: 'pattern',
        suggestedPattern: 'new pattern',
        files: [],
        impact: 'critical', // invalid
        effort: 'low',
      };

      expect(() => RefactoringOpportunitySchema.parse(invalid)).toThrow();
    });

    it('should reject opportunity with invalid effort', () => {
      const invalid = {
        id: 'refactor-003',
        title: 'Title',
        description: 'Description',
        currentPattern: 'pattern',
        suggestedPattern: 'new pattern',
        files: [],
        impact: 'low',
        effort: 'extreme', // invalid
      };

      expect(() => RefactoringOpportunitySchema.parse(invalid)).toThrow();
    });
  });

  describe('RefactoringResultSchema', () => {
    it('should validate a complete refactoring result', () => {
      const result = {
        agent: 'refactoring-suggester',
        summary: 'Found 3 refactoring opportunities',
        opportunities: [
          {
            id: 'refactor-001',
            title: 'Extract authentication middleware',
            description: 'Auth code is duplicated',
            currentPattern: 'if (!user) return 401;',
            suggestedPattern: 'Use middleware',
            files: ['src/routes.ts'],
            impact: 'high',
            effort: 'low',
          },
        ],
        modernizationSuggestions: [
          'Consider using async/await instead of promise chains',
          'Migrate to ES modules',
        ],
      };

      expect(() => RefactoringResultSchema.parse(result)).not.toThrow();
      const parsed = RefactoringResultSchema.parse(result);
      expect(parsed.agent).toBe('refactoring-suggester');
      expect(parsed.modernizationSuggestions).toHaveLength(2);
    });

    it('should validate empty opportunities and suggestions', () => {
      const result = {
        agent: 'refactoring-suggester',
        summary: 'No opportunities found',
        opportunities: [],
        modernizationSuggestions: [],
      };

      expect(() => RefactoringResultSchema.parse(result)).not.toThrow();
    });
  });

  describe('ReviewReportSchema', () => {
    it('should validate a complete review report', () => {
      const report = {
        owner: 'octocat',
        repo: 'Hello-World',
        prNumber: 1,
        codeQuality: {
          agent: 'code-quality-analyzer',
          summary: 'Good code quality',
          issues: [],
          score: 80,
          topRisks: [],
        },
        testCoverage: {
          agent: 'test-coverage-analyzer',
          summary: 'Decent coverage',
          coverageGaps: [],
          suggestedTestCases: [],
          estimatedCoverage: 70,
        },
        refactoring: {
          agent: 'refactoring-suggester',
          summary: 'Some opportunities',
          opportunities: [],
          modernizationSuggestions: [],
        },
        overallScore: 75,
        summary: 'Overall good PR',
        timestamp: '2024-01-15T10:30:00Z',
      };

      expect(() => ReviewReportSchema.parse(report)).not.toThrow();
      const parsed = ReviewReportSchema.parse(report);
      expect(parsed.overallScore).toBe(75);
      expect(parsed.prNumber).toBe(1);
    });

    it('should reject report with invalid timestamp', () => {
      const invalid = {
        owner: 'owner',
        repo: 'repo',
        prNumber: 1,
        codeQuality: {
          agent: 'code-quality-analyzer',
          summary: 'Summary',
          issues: [],
          score: 50,
          topRisks: [],
        },
        testCoverage: {
          agent: 'test-coverage-analyzer',
          summary: 'Summary',
          coverageGaps: [],
          suggestedTestCases: [],
          estimatedCoverage: 50,
        },
        refactoring: {
          agent: 'refactoring-suggester',
          summary: 'Summary',
          opportunities: [],
          modernizationSuggestions: [],
        },
        overallScore: 50,
        summary: 'Summary',
        timestamp: 'not-a-timestamp', // invalid
      };

      expect(() => ReviewReportSchema.parse(invalid)).toThrow();
    });

    it('should reject report with negative PR number', () => {
      const invalid = {
        owner: 'owner',
        repo: 'repo',
        prNumber: -1, // invalid
        codeQuality: {
          agent: 'code-quality-analyzer',
          summary: 'Summary',
          issues: [],
          score: 50,
          topRisks: [],
        },
        testCoverage: {
          agent: 'test-coverage-analyzer',
          summary: 'Summary',
          coverageGaps: [],
          suggestedTestCases: [],
          estimatedCoverage: 50,
        },
        refactoring: {
          agent: 'refactoring-suggester',
          summary: 'Summary',
          opportunities: [],
          modernizationSuggestions: [],
        },
        overallScore: 50,
        summary: 'Summary',
        timestamp: '2024-01-15T10:30:00Z',
      };

      expect(() => ReviewReportSchema.parse(invalid)).toThrow();
    });

    it('should validate 0 and 100 overall scores', () => {
      const baseReport = {
        owner: 'owner',
        repo: 'repo',
        prNumber: 1,
        codeQuality: {
          agent: 'code-quality-analyzer',
          summary: 'Summary',
          issues: [],
          score: 50,
          topRisks: [],
        },
        testCoverage: {
          agent: 'test-coverage-analyzer',
          summary: 'Summary',
          coverageGaps: [],
          suggestedTestCases: [],
          estimatedCoverage: 50,
        },
        refactoring: {
          agent: 'refactoring-suggester',
          summary: 'Summary',
          opportunities: [],
          modernizationSuggestions: [],
        },
        summary: 'Summary',
        timestamp: '2024-01-15T10:30:00Z',
      };

      const zeroScore = { ...baseReport, overallScore: 0 };
      const perfectScore = { ...baseReport, overallScore: 100 };

      expect(() => ReviewReportSchema.parse(zeroScore)).not.toThrow();
      expect(() => ReviewReportSchema.parse(perfectScore)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long strings in descriptions', () => {
      const longDescription = 'A'.repeat(10000);
      const issue = {
        id: 'long-desc',
        title: 'Issue',
        description: longDescription,
        severity: 'low',
        file: 'file.ts',
      };

      expect(() => IssueSchema.parse(issue)).not.toThrow();
    });

    it('should handle special characters in strings', () => {
      const issue = {
        id: 'special-chars',
        title: 'Issue with <>&"\'',
        description: 'Description with <script>alert("xss")</script>',
        severity: 'low',
        file: 'file.ts',
        suggestion: 'Fix `const x = y < 10 && z > 5`',
      };

      expect(() => IssueSchema.parse(issue)).not.toThrow();
    });

    it('should handle arrays with many items', () => {
      const manyIssues = Array.from({ length: 100 }, (_, i) => ({
        id: `issue-${i}`,
        title: `Issue ${i}`,
        description: `Description ${i}`,
        severity: i % 2 === 0 ? 'high' : 'low',
        file: `file-${i}.ts`,
      }));

      const result = {
        agent: 'code-quality-analyzer',
        summary: 'Many issues',
        issues: manyIssues,
        score: 10,
        topRisks: Array.from({ length: 3 }, (_, i) => `Risk ${i}`),
      };

      expect(() => CodeQualityResultSchema.parse(result)).not.toThrow();
    });
  });
});
