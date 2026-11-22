import { z } from 'zod';
export declare const SeveritySchema: z.ZodEnum<["low", "medium", "high"]>;
export type Severity = z.infer<typeof SeveritySchema>;
export declare const IssueSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    severity: z.ZodEnum<["low", "medium", "high"]>;
    file: z.ZodString;
    line: z.ZodOptional<z.ZodNumber>;
    suggestion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    file: string;
    line?: number | undefined;
    suggestion?: string | undefined;
}, {
    id: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    file: string;
    line?: number | undefined;
    suggestion?: string | undefined;
}>;
export type Issue = z.infer<typeof IssueSchema>;
export declare const CodeQualityResultSchema: z.ZodObject<{
    agent: z.ZodLiteral<"code-quality-analyzer">;
    summary: z.ZodString;
    issues: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        severity: z.ZodEnum<["low", "medium", "high"]>;
        file: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        suggestion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        description: string;
        severity: "low" | "medium" | "high";
        file: string;
        line?: number | undefined;
        suggestion?: string | undefined;
    }, {
        id: string;
        title: string;
        description: string;
        severity: "low" | "medium" | "high";
        file: string;
        line?: number | undefined;
        suggestion?: string | undefined;
    }>, "many">;
    score: z.ZodNumber;
    topRisks: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    issues: {
        id: string;
        title: string;
        description: string;
        severity: "low" | "medium" | "high";
        file: string;
        line?: number | undefined;
        suggestion?: string | undefined;
    }[];
    agent: "code-quality-analyzer";
    summary: string;
    score: number;
    topRisks: string[];
}, {
    issues: {
        id: string;
        title: string;
        description: string;
        severity: "low" | "medium" | "high";
        file: string;
        line?: number | undefined;
        suggestion?: string | undefined;
    }[];
    agent: "code-quality-analyzer";
    summary: string;
    score: number;
    topRisks: string[];
}>;
export type CodeQualityResult = z.infer<typeof CodeQualityResultSchema>;
export declare const TestCaseSchema: z.ZodObject<{
    description: z.ZodString;
    reason: z.ZodString;
    affectedFunctions: z.ZodArray<z.ZodString, "many">;
    priority: z.ZodEnum<["high", "medium", "low"]>;
}, "strip", z.ZodTypeAny, {
    description: string;
    reason: string;
    affectedFunctions: string[];
    priority: "low" | "medium" | "high";
}, {
    description: string;
    reason: string;
    affectedFunctions: string[];
    priority: "low" | "medium" | "high";
}>;
export type TestCase = z.infer<typeof TestCaseSchema>;
export declare const TestCoverageResultSchema: z.ZodObject<{
    agent: z.ZodLiteral<"test-coverage-analyzer">;
    summary: z.ZodString;
    coverageGaps: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        severity: z.ZodEnum<["low", "medium", "high"]>;
        file: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        suggestion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        description: string;
        severity: "low" | "medium" | "high";
        file: string;
        line?: number | undefined;
        suggestion?: string | undefined;
    }, {
        id: string;
        title: string;
        description: string;
        severity: "low" | "medium" | "high";
        file: string;
        line?: number | undefined;
        suggestion?: string | undefined;
    }>, "many">;
    suggestedTestCases: z.ZodArray<z.ZodObject<{
        description: z.ZodString;
        reason: z.ZodString;
        affectedFunctions: z.ZodArray<z.ZodString, "many">;
        priority: z.ZodEnum<["high", "medium", "low"]>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        reason: string;
        affectedFunctions: string[];
        priority: "low" | "medium" | "high";
    }, {
        description: string;
        reason: string;
        affectedFunctions: string[];
        priority: "low" | "medium" | "high";
    }>, "many">;
    estimatedCoverage: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    agent: "test-coverage-analyzer";
    summary: string;
    coverageGaps: {
        id: string;
        title: string;
        description: string;
        severity: "low" | "medium" | "high";
        file: string;
        line?: number | undefined;
        suggestion?: string | undefined;
    }[];
    suggestedTestCases: {
        description: string;
        reason: string;
        affectedFunctions: string[];
        priority: "low" | "medium" | "high";
    }[];
    estimatedCoverage: number;
}, {
    agent: "test-coverage-analyzer";
    summary: string;
    coverageGaps: {
        id: string;
        title: string;
        description: string;
        severity: "low" | "medium" | "high";
        file: string;
        line?: number | undefined;
        suggestion?: string | undefined;
    }[];
    suggestedTestCases: {
        description: string;
        reason: string;
        affectedFunctions: string[];
        priority: "low" | "medium" | "high";
    }[];
    estimatedCoverage: number;
}>;
export type TestCoverageResult = z.infer<typeof TestCoverageResultSchema>;
export declare const RefactoringOpportunitySchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    currentPattern: z.ZodString;
    suggestedPattern: z.ZodString;
    files: z.ZodArray<z.ZodString, "many">;
    impact: z.ZodEnum<["low", "medium", "high"]>;
    effort: z.ZodEnum<["low", "medium", "high"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    description: string;
    currentPattern: string;
    suggestedPattern: string;
    files: string[];
    impact: "low" | "medium" | "high";
    effort: "low" | "medium" | "high";
}, {
    id: string;
    title: string;
    description: string;
    currentPattern: string;
    suggestedPattern: string;
    files: string[];
    impact: "low" | "medium" | "high";
    effort: "low" | "medium" | "high";
}>;
export type RefactoringOpportunity = z.infer<typeof RefactoringOpportunitySchema>;
export declare const RefactoringResultSchema: z.ZodObject<{
    agent: z.ZodLiteral<"refactoring-suggester">;
    summary: z.ZodString;
    opportunities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        currentPattern: z.ZodString;
        suggestedPattern: z.ZodString;
        files: z.ZodArray<z.ZodString, "many">;
        impact: z.ZodEnum<["low", "medium", "high"]>;
        effort: z.ZodEnum<["low", "medium", "high"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        description: string;
        currentPattern: string;
        suggestedPattern: string;
        files: string[];
        impact: "low" | "medium" | "high";
        effort: "low" | "medium" | "high";
    }, {
        id: string;
        title: string;
        description: string;
        currentPattern: string;
        suggestedPattern: string;
        files: string[];
        impact: "low" | "medium" | "high";
        effort: "low" | "medium" | "high";
    }>, "many">;
    modernizationSuggestions: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    agent: "refactoring-suggester";
    summary: string;
    opportunities: {
        id: string;
        title: string;
        description: string;
        currentPattern: string;
        suggestedPattern: string;
        files: string[];
        impact: "low" | "medium" | "high";
        effort: "low" | "medium" | "high";
    }[];
    modernizationSuggestions: string[];
}, {
    agent: "refactoring-suggester";
    summary: string;
    opportunities: {
        id: string;
        title: string;
        description: string;
        currentPattern: string;
        suggestedPattern: string;
        files: string[];
        impact: "low" | "medium" | "high";
        effort: "low" | "medium" | "high";
    }[];
    modernizationSuggestions: string[];
}>;
export type RefactoringResult = z.infer<typeof RefactoringResultSchema>;
export declare const ReviewReportSchema: z.ZodObject<{
    owner: z.ZodString;
    repo: z.ZodString;
    prNumber: z.ZodNumber;
    codeQuality: z.ZodObject<{
        agent: z.ZodLiteral<"code-quality-analyzer">;
        summary: z.ZodString;
        issues: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodString;
            severity: z.ZodEnum<["low", "medium", "high"]>;
            file: z.ZodString;
            line: z.ZodOptional<z.ZodNumber>;
            suggestion: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }, {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }>, "many">;
        score: z.ZodNumber;
        topRisks: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        issues: {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }[];
        agent: "code-quality-analyzer";
        summary: string;
        score: number;
        topRisks: string[];
    }, {
        issues: {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }[];
        agent: "code-quality-analyzer";
        summary: string;
        score: number;
        topRisks: string[];
    }>;
    testCoverage: z.ZodObject<{
        agent: z.ZodLiteral<"test-coverage-analyzer">;
        summary: z.ZodString;
        coverageGaps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodString;
            severity: z.ZodEnum<["low", "medium", "high"]>;
            file: z.ZodString;
            line: z.ZodOptional<z.ZodNumber>;
            suggestion: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }, {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }>, "many">;
        suggestedTestCases: z.ZodArray<z.ZodObject<{
            description: z.ZodString;
            reason: z.ZodString;
            affectedFunctions: z.ZodArray<z.ZodString, "many">;
            priority: z.ZodEnum<["high", "medium", "low"]>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            reason: string;
            affectedFunctions: string[];
            priority: "low" | "medium" | "high";
        }, {
            description: string;
            reason: string;
            affectedFunctions: string[];
            priority: "low" | "medium" | "high";
        }>, "many">;
        estimatedCoverage: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        agent: "test-coverage-analyzer";
        summary: string;
        coverageGaps: {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }[];
        suggestedTestCases: {
            description: string;
            reason: string;
            affectedFunctions: string[];
            priority: "low" | "medium" | "high";
        }[];
        estimatedCoverage: number;
    }, {
        agent: "test-coverage-analyzer";
        summary: string;
        coverageGaps: {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }[];
        suggestedTestCases: {
            description: string;
            reason: string;
            affectedFunctions: string[];
            priority: "low" | "medium" | "high";
        }[];
        estimatedCoverage: number;
    }>;
    refactoring: z.ZodObject<{
        agent: z.ZodLiteral<"refactoring-suggester">;
        summary: z.ZodString;
        opportunities: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodString;
            currentPattern: z.ZodString;
            suggestedPattern: z.ZodString;
            files: z.ZodArray<z.ZodString, "many">;
            impact: z.ZodEnum<["low", "medium", "high"]>;
            effort: z.ZodEnum<["low", "medium", "high"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            description: string;
            currentPattern: string;
            suggestedPattern: string;
            files: string[];
            impact: "low" | "medium" | "high";
            effort: "low" | "medium" | "high";
        }, {
            id: string;
            title: string;
            description: string;
            currentPattern: string;
            suggestedPattern: string;
            files: string[];
            impact: "low" | "medium" | "high";
            effort: "low" | "medium" | "high";
        }>, "many">;
        modernizationSuggestions: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        agent: "refactoring-suggester";
        summary: string;
        opportunities: {
            id: string;
            title: string;
            description: string;
            currentPattern: string;
            suggestedPattern: string;
            files: string[];
            impact: "low" | "medium" | "high";
            effort: "low" | "medium" | "high";
        }[];
        modernizationSuggestions: string[];
    }, {
        agent: "refactoring-suggester";
        summary: string;
        opportunities: {
            id: string;
            title: string;
            description: string;
            currentPattern: string;
            suggestedPattern: string;
            files: string[];
            impact: "low" | "medium" | "high";
            effort: "low" | "medium" | "high";
        }[];
        modernizationSuggestions: string[];
    }>;
    overallScore: z.ZodNumber;
    summary: z.ZodString;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    summary: string;
    owner: string;
    repo: string;
    prNumber: number;
    codeQuality: {
        issues: {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }[];
        agent: "code-quality-analyzer";
        summary: string;
        score: number;
        topRisks: string[];
    };
    testCoverage: {
        agent: "test-coverage-analyzer";
        summary: string;
        coverageGaps: {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }[];
        suggestedTestCases: {
            description: string;
            reason: string;
            affectedFunctions: string[];
            priority: "low" | "medium" | "high";
        }[];
        estimatedCoverage: number;
    };
    refactoring: {
        agent: "refactoring-suggester";
        summary: string;
        opportunities: {
            id: string;
            title: string;
            description: string;
            currentPattern: string;
            suggestedPattern: string;
            files: string[];
            impact: "low" | "medium" | "high";
            effort: "low" | "medium" | "high";
        }[];
        modernizationSuggestions: string[];
    };
    overallScore: number;
    timestamp: string;
}, {
    summary: string;
    owner: string;
    repo: string;
    prNumber: number;
    codeQuality: {
        issues: {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }[];
        agent: "code-quality-analyzer";
        summary: string;
        score: number;
        topRisks: string[];
    };
    testCoverage: {
        agent: "test-coverage-analyzer";
        summary: string;
        coverageGaps: {
            id: string;
            title: string;
            description: string;
            severity: "low" | "medium" | "high";
            file: string;
            line?: number | undefined;
            suggestion?: string | undefined;
        }[];
        suggestedTestCases: {
            description: string;
            reason: string;
            affectedFunctions: string[];
            priority: "low" | "medium" | "high";
        }[];
        estimatedCoverage: number;
    };
    refactoring: {
        agent: "refactoring-suggester";
        summary: string;
        opportunities: {
            id: string;
            title: string;
            description: string;
            currentPattern: string;
            suggestedPattern: string;
            files: string[];
            impact: "low" | "medium" | "high";
            effort: "low" | "medium" | "high";
        }[];
        modernizationSuggestions: string[];
    };
    overallScore: number;
    timestamp: string;
}>;
export type ReviewReport = z.infer<typeof ReviewReportSchema>;
//# sourceMappingURL=index.d.ts.map