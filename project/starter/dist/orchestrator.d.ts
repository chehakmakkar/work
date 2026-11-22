import { ReviewReport } from './types/index.js';
export declare class Orchestrator {
    private client;
    constructor();
    reviewPullRequest(owner: string, repo: string, prNumber: number): Promise<ReviewReport>;
}
//# sourceMappingURL=orchestrator.d.ts.map