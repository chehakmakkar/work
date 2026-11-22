import { Orchestrator } from './orchestrator.js';
import { ReportGenerator } from './utils/report-generator.js';
import { Logger } from './utils/logger.js';

/**
 * Validates command-line arguments
 */
function validateArguments(args: string[]): { owner: string; repo: string; prNumber: number } {
  if (args.length < 3) {
    console.error('❌ Error: Missing required arguments');
    console.error('\nUsage: npm run dev -- <owner> <repo> <prNumber>');
    console.error('Example: npm run dev -- octocat Hello-World 1');
    console.error('\nArguments:');
    console.error('  <owner>    - GitHub repository owner');
    console.error('  <repo>     - GitHub repository name');
    console.error('  <prNumber> - Pull request number (must be a positive integer)');
    process.exit(1);
  }

  const [owner, repo, prNumberStr] = args;

  // Validate owner and repo are not empty
  if (!owner || !repo) {
    console.error('❌ Error: Owner and repo must not be empty');
    process.exit(1);
  }

  // Validate PR number
  const prNumber = parseInt(prNumberStr, 10);
  if (isNaN(prNumber) || prNumber <= 0) {
    console.error('❌ Error: PR number must be a valid positive integer');
    console.error(`   Received: "${prNumberStr}"`);
    process.exit(1);
  }

  return { owner, repo, prNumber };
}

/**
 * Validates authentication configuration
 */
function validateAuthentication(): void {
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasAwsAccessKey = !!process.env.AWS_ACCESS_KEY_ID;
  const hasAwsSecretKey = !!process.env.AWS_SECRET_ACCESS_KEY;
  const hasAwsRegion = !!process.env.AWS_REGION;

  if (!hasAnthropicKey && (!hasAwsAccessKey || !hasAwsSecretKey)) {
    console.error('❌ Error: No authentication configured');
    console.error('\nYou must configure ONE of the following:');
    console.error('\n1. Anthropic API:');
    console.error('   export ANTHROPIC_API_KEY=sk-...');
    console.error('\n2. AWS Bedrock:');
    console.error('   export AWS_ACCESS_KEY_ID=...');
    console.error('   export AWS_SECRET_ACCESS_KEY=...');
    console.error('   export AWS_REGION=us-east-1 (optional)');
    process.exit(1);
  }

  if (hasAnthropicKey) {
    Logger.info('Authentication: Using Anthropic API');
  } else if (hasAwsAccessKey && hasAwsSecretKey) {
    Logger.info('Authentication: Using AWS Bedrock', {
      region: hasAwsRegion ? process.env.AWS_REGION : 'us-east-1 (default)',
    });
  }
}

/**
 * Validates model configuration
 */
function validateModelConfiguration(): void {
  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-5-20251101';

  if (!model) {
    console.error('❌ Error: No model configured');
    console.error('\nSet the ANTHROPIC_MODEL environment variable:');
    console.error('  export ANTHROPIC_MODEL=claude-opus-4-5-20251101');
    console.error('\nOr for AWS Bedrock:');
    console.error('  export ANTHROPIC_MODEL=anthropic.claude-opus-4-1-20250805');
    process.exit(1);
  }

  Logger.info('Model configured', { model });
}

async function main() {
  try {
    // Validate arguments
    const args = process.argv.slice(2);
    const { owner, repo, prNumber } = validateArguments(args);

    console.log('\n📋 Code Review System - Part 2');
    console.log('═══════════════════════════════════════\n');

    // Validate authentication
    validateAuthentication();

    // Validate model configuration
    validateModelConfiguration();

    // Create orchestrator and run review
    Logger.info('Starting code review', { owner, repo, prNumber });
    console.log(`\n🔍 Analyzing PR: ${owner}/${repo}#${prNumber}\n`);

    const orchestrator = new Orchestrator();
    const report = await orchestrator.reviewPullRequest(owner, repo, prNumber);

    // Output summary
    console.log('\n✅ Code Review Completed\n');
    console.log(`Overall Score: ${report.overallScore}/100`);
    console.log(`Code Quality: ${report.codeQuality.score}/100`);
    console.log(`Test Coverage: ${report.testCoverage.estimatedCoverage}%`);
    console.log(`Refactoring Opportunities: ${report.refactoring.opportunities.length}\n`);

    // Generate and save reports
    console.log('📝 Generating reports...');
    const paths = await ReportGenerator.saveReports(report);

    console.log('\n✅ Reports saved:\n');
    console.log(`  📄 JSON:     ${paths.json}`);
    console.log(`  📋 Markdown: ${paths.markdown}`);
    console.log(`  🌐 HTML:     ${paths.html}\n`);

    // Print summary
    console.log('═══════════════════════════════════════');
    console.log('\n📌 Summary:');
    console.log(`${report.summary}\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during code review:\n');

    if (error instanceof Error) {
      console.error(`${error.name}: ${error.message}`);

      if (error.stack && process.env.DEBUG) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }
    } else {
      console.error(String(error));
    }

    console.error(
      '\nTip: Run with DEBUG=1 for more details:\n  DEBUG=1 npm run dev -- <owner> <repo> <prNumber>\n'
    );
    process.exit(1);
  }
}

main().catch((error) => {
  Logger.error('Uncaught error', error);
  process.exit(1);
});
