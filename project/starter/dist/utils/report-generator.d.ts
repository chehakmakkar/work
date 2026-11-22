import { ReviewReport } from '../types/index.js';
export declare class ReportGenerator {
    /**
     * Format report as JSON (pretty-printed)
     */
    static formatJSON(report: ReviewReport): string;
    /**
     * Generate Markdown report
     */
    static generateMarkdown(report: ReviewReport): string;
    /**
     * Generate HTML report
     */
    static generateHTML(report: ReviewReport): string;
    /**
     * Save reports to disk in all formats
     */
    static saveReports(report: ReviewReport, outputDir?: string): Promise<{
        json: string;
        markdown: string;
        html: string;
    }>;
}
//# sourceMappingURL=report-generator.d.ts.map