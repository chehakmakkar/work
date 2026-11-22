/**
 * MCP Server Configuration
 *
 * This file defines the configuration for two MCP servers:
 * 1. GitHub MCP - For accessing GitHub PR data
 * 2. ESLint MCP - For analyzing code quality
 */
export declare const mcpConfig: {
    readonly servers: {
        readonly github: {
            readonly command: "npx";
            readonly args: readonly ["-y", "@modelcontextprotocol/server-github"];
            readonly env: {
                readonly GITHUB_TOKEN: string;
            };
        };
        readonly eslint: {
            readonly command: "npx";
            readonly args: readonly ["-y", "@modelcontextprotocol/server-eslint"];
            readonly env: {};
        };
    };
};
export type MCPConfig = typeof mcpConfig;
//# sourceMappingURL=mcp.config.d.ts.map