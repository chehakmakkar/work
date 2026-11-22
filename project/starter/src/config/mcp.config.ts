/**
 * MCP Server Configuration
 *
 * This file defines the configuration for two MCP servers:
 * 1. GitHub MCP - For accessing GitHub PR data
 * 2. ESLint MCP - For analyzing code quality
 */

export const mcpConfig = {
  servers: {
    github: {
      command: 'npx' as const,
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
      },
    },
    eslint: {
      command: 'npx' as const,
      args: ['-y', '@modelcontextprotocol/server-eslint'],
      env: {},
    },
  },
};
