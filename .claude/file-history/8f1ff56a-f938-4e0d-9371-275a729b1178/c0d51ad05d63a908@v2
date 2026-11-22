import { ReviewReport, Issue } from '../types/index.js';
import * as fs from 'fs';
import * as path from 'path';

export class ReportGenerator {
  /**
   * Format report as JSON (pretty-printed)
   */
  static formatJSON(report: ReviewReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Generate Markdown report
   */
  static generateMarkdown(report: ReviewReport): string {
    const issuesMarkdown =
      report.codeQuality.issues.length > 0
        ? report.codeQuality.issues
            .map(
              (issue) =>
                `- **${issue.title}** (${issue.severity.toUpperCase()}) - ${issue.file}:${issue.line || 'N/A'}
  ${issue.description}
  ${issue.suggestion ? `**Suggestion:** ${issue.suggestion}` : ''}`
            )
            .join('\n')
        : 'No issues found.';

    const testCasesMarkdown =
      report.testCoverage.suggestedTestCases.length > 0
        ? report.testCoverage.suggestedTestCases
            .map(
              (tc) =>
                `- **${tc.description}** (${tc.priority.toUpperCase()})
  Reason: ${tc.reason}
  Affected Functions: ${tc.affectedFunctions.join(', ')}`
            )
            .join('\n')
        : 'No test suggestions.';

    const refactoringMarkdown =
      report.refactoring.opportunities.length > 0
        ? report.refactoring.opportunities
            .map(
              (opp) =>
                `- **${opp.title}** (Impact: ${opp.impact}, Effort: ${opp.effort})
  ${opp.description}
  Files: ${opp.files.join(', ')}
  Current: ${opp.currentPattern}
  Suggested: ${opp.suggestedPattern}`
            )
            .join('\n')
        : 'No refactoring opportunities identified.';

    const markdown = `# Code Review Report

**Repository:** ${report.owner}/${report.repo}
**PR Number:** #${report.prNumber}
**Overall Score:** ${report.overallScore}/100
**Generated:** ${new Date(report.timestamp).toLocaleString()}

## Executive Summary
${report.summary}

---

## Code Quality Analysis

**Score:** ${report.codeQuality.score}/100

**Summary:** ${report.codeQuality.summary}

**Top Risks:**
${report.codeQuality.topRisks.map((risk) => `- ${risk}`).join('\n')}

**Issues Found:** ${report.codeQuality.issues.length}

${issuesMarkdown}

---

## Test Coverage Analysis

**Estimated Coverage:** ${report.testCoverage.estimatedCoverage}%

**Summary:** ${report.testCoverage.summary}

**Coverage Gaps:** ${report.testCoverage.coverageGaps.length}

**Suggested Test Cases:**

${testCasesMarkdown}

---

## Refactoring Opportunities

**Summary:** ${report.refactoring.summary}

**Opportunities Found:** ${report.refactoring.opportunities.length}

${refactoringMarkdown}

**Modernization Suggestions:**
${report.refactoring.modernizationSuggestions.map((s) => `- ${s}`).join('\n')}

---

*Report generated on ${new Date(report.timestamp).toISOString()}*
`;
    return markdown;
  }

  /**
   * Generate HTML report
   */
  static generateHTML(report: ReviewReport): string {
    const escapeHtml = (text: string): string => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    const renderIssues = (issues: Issue[]): string => {
      if (issues.length === 0) return '<p>No issues found.</p>';

      return `
        <ul class="issues-list">
          ${issues
            .map(
              (issue) => `
            <li class="issue issue-${issue.severity}">
              <div class="issue-header">
                <h4>${escapeHtml(issue.title)}</h4>
                <span class="severity-badge ${issue.severity}">${issue.severity.toUpperCase()}</span>
              </div>
              <p class="issue-location">${escapeHtml(issue.file)}:${issue.line || 'N/A'}</p>
              <p class="issue-description">${escapeHtml(issue.description)}</p>
              ${
                issue.suggestion
                  ? `<p class="issue-suggestion"><strong>Suggestion:</strong> ${escapeHtml(issue.suggestion)}</p>`
                  : ''
              }
            </li>
          `
            )
            .join('\n')}
        </ul>
      `;
    };

    const renderTestCases = () => {
      if (report.testCoverage.suggestedTestCases.length === 0)
        return '<p>No test suggestions.</p>';

      return `
        <ul class="test-cases-list">
          ${report.testCoverage.suggestedTestCases
            .map(
              (tc) => `
            <li class="test-case">
              <h4>${escapeHtml(tc.description)}</h4>
              <p><strong>Priority:</strong> <span class="priority-badge ${tc.priority}">${tc.priority.toUpperCase()}</span></p>
              <p><strong>Reason:</strong> ${escapeHtml(tc.reason)}</p>
              <p><strong>Affected Functions:</strong> ${tc.affectedFunctions.map((f) => `<code>${escapeHtml(f)}</code>`).join(', ')}</p>
            </li>
          `
            )
            .join('\n')}
        </ul>
      `;
    };

    const renderRefactoring = () => {
      if (report.refactoring.opportunities.length === 0)
        return '<p>No refactoring opportunities identified.</p>';

      return `
        <ul class="refactoring-list">
          ${report.refactoring.opportunities
            .map(
              (opp) => `
            <li class="refactoring-opp">
              <h4>${escapeHtml(opp.title)}</h4>
              <div class="metrics">
                <span class="metric">Impact: <strong>${opp.impact}</strong></span>
                <span class="metric">Effort: <strong>${opp.effort}</strong></span>
              </div>
              <p>${escapeHtml(opp.description)}</p>
              <p><strong>Files:</strong> ${opp.files.map((f) => `<code>${escapeHtml(f)}</code>`).join(', ')}</p>
              <div class="code-blocks">
                <div>
                  <strong>Current Pattern:</strong>
                  <pre><code>${escapeHtml(opp.currentPattern)}</code></pre>
                </div>
                <div>
                  <strong>Suggested Pattern:</strong>
                  <pre><code>${escapeHtml(opp.suggestedPattern)}</code></pre>
                </div>
              </div>
            </li>
          `
            )
            .join('\n')}
        </ul>
      `;
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Review Report - ${escapeHtml(report.owner)}/${escapeHtml(report.repo)} #${report.prNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    header .meta {
      display: flex;
      justify-content: center;
      gap: 30px;
      flex-wrap: wrap;
      margin-top: 20px;
      font-size: 0.95em;
      opacity: 0.95;
    }
    .score-badge {
      display: inline-block;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: white;
      color: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2em;
      font-weight: bold;
      margin: 20px auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    main {
      padding: 40px;
    }
    .summary {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    section {
      margin-bottom: 40px;
    }
    section h2 {
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
      margin-bottom: 20px;
      font-size: 1.8em;
    }
    .score-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .score-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      text-align: center;
    }
    .score-card strong {
      display: block;
      font-size: 2em;
      color: #667eea;
      margin: 10px 0;
    }
    .issues-list, .test-cases-list, .refactoring-list {
      list-style: none;
    }
    .issues-list li {
      background: #f8f9fa;
      border-left: 4px solid;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 8px;
    }
    .issue-high { border-left-color: #e74c3c; }
    .issue-medium { border-left-color: #f39c12; }
    .issue-low { border-left-color: #3498db; }
    .issue-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .issue-header h4 {
      flex: 1;
      color: #333;
      font-size: 1.1em;
    }
    .severity-badge {
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: bold;
      color: white;
    }
    .severity-badge.high { background: #e74c3c; }
    .severity-badge.medium { background: #f39c12; }
    .severity-badge.low { background: #3498db; }
    .issue-location {
      color: #7f8c8d;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      margin-bottom: 10px;
    }
    .issue-suggestion {
      background: #ecf0f1;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
      font-size: 0.95em;
    }
    .test-case, .refactoring-opp {
      background: #f8f9fa;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .priority-badge {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: bold;
      color: white;
    }
    .priority-badge.high { background: #e74c3c; }
    .priority-badge.medium { background: #f39c12; }
    .priority-badge.low { background: #3498db; }
    .metrics {
      display: flex;
      gap: 15px;
      margin: 10px 0;
    }
    .metric {
      font-size: 0.9em;
      color: #555;
    }
    code {
      background: #ecf0f1;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 10px 0;
      font-size: 0.85em;
      line-height: 1.4;
    }
    .code-blocks {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 15px;
    }
    @media (max-width: 768px) {
      .code-blocks {
        grid-template-columns: 1fr;
      }
      .meta {
        flex-direction: column;
        gap: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Code Review Report</h1>
      <div class="meta">
        <div><strong>Repository:</strong> ${escapeHtml(report.owner)}/${escapeHtml(report.repo)}</div>
        <div><strong>PR:</strong> #${report.prNumber}</div>
        <div><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</div>
      </div>
    </header>

    <main>
      <div class="score-badge">${report.overallScore}</div>

      <section class="summary">
        <h3>Summary</h3>
        <p>${escapeHtml(report.summary)}</p>
      </section>

      <section>
        <h2>Code Quality Analysis</h2>
        <div class="score-info">
          <div class="score-card">
            <strong>${report.codeQuality.score}</strong>
            <span>Quality Score</span>
          </div>
          <div class="score-card">
            <strong>${report.codeQuality.issues.length}</strong>
            <span>Issues Found</span>
          </div>
        </div>
        <p><strong>Summary:</strong> ${escapeHtml(report.codeQuality.summary)}</p>
        <h3 style="margin-top: 20px; margin-bottom: 10px;">Top Risks</h3>
        <ul style="margin-left: 20px;">
          ${report.codeQuality.topRisks.map((risk) => `<li>${escapeHtml(risk)}</li>`).join('\n')}
        </ul>
        <h3 style="margin-top: 20px; margin-bottom: 10px;">Issues</h3>
        ${renderIssues(report.codeQuality.issues)}
      </section>

      <section>
        <h2>Test Coverage Analysis</h2>
        <div class="score-info">
          <div class="score-card">
            <strong>${report.testCoverage.estimatedCoverage}%</strong>
            <span>Coverage</span>
          </div>
          <div class="score-card">
            <strong>${report.testCoverage.suggestedTestCases.length}</strong>
            <span>Test Suggestions</span>
          </div>
        </div>
        <p><strong>Summary:</strong> ${escapeHtml(report.testCoverage.summary)}</p>
        <h3 style="margin-top: 20px; margin-bottom: 10px;">Coverage Gaps</h3>
        ${renderIssues(report.testCoverage.coverageGaps)}
        <h3 style="margin-top: 20px; margin-bottom: 10px;">Suggested Test Cases</h3>
        ${renderTestCases()}
      </section>

      <section>
        <h2>Refactoring Opportunities</h2>
        <div class="score-info">
          <div class="score-card">
            <strong>${report.refactoring.opportunities.length}</strong>
            <span>Opportunities</span>
          </div>
        </div>
        <p><strong>Summary:</strong> ${escapeHtml(report.refactoring.summary)}</p>
        <h3 style="margin-top: 20px; margin-bottom: 10px;">Modernization Suggestions</h3>
        <ul style="margin-left: 20px;">
          ${report.refactoring.modernizationSuggestions.map((s) => `<li>${escapeHtml(s)}</li>`).join('\n')}
        </ul>
        <h3 style="margin-top: 20px; margin-bottom: 10px;">Refactoring Opportunities</h3>
        ${renderRefactoring()}
      </section>
    </main>
  </div>
</body>
</html>`;
    return html;
  }

  /**
   * Save reports to disk in all formats
   */
  static async saveReports(
    report: ReviewReport,
    outputDir: string = 'reports'
  ): Promise<{ json: string; markdown: string; html: string }> {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate filename
    const filename = `${report.owner}_${report.repo}_${report.prNumber}`;

    // Save JSON
    const jsonPath = path.join(outputDir, `${filename}.json`);
    const jsonContent = this.formatJSON(report);
    fs.writeFileSync(jsonPath, jsonContent, 'utf-8');

    // Save Markdown
    const mdPath = path.join(outputDir, `${filename}.md`);
    const mdContent = this.generateMarkdown(report);
    fs.writeFileSync(mdPath, mdContent, 'utf-8');

    // Save HTML
    const htmlPath = path.join(outputDir, `${filename}.html`);
    const htmlContent = this.generateHTML(report);
    fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

    return {
      json: jsonPath,
      markdown: mdPath,
      html: htmlPath,
    };
  }
}
