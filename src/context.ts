import * as github from '@actions/github';

export enum AvailableStatuses {
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    FAILED = 'FAILED',
    TIMED_OUT = 'TIMED_OUT',
    UNKOWN = 'UNKOWN',
}

class Context {
    repoOwner: string = '';
    repoName: string = '';
    runId: number = 0;
    status: AvailableStatuses = AvailableStatuses.UNKOWN;

    isGithubAction(): boolean {
        return ! isNaN(github.context.runId);
    }

    getRepoOwner(): string {
        return this.repoOwner;
    }

    setRepoOwner(owner: string): this {
        this.repoOwner = owner;
        return this;
    }

    getRepoName(): string {
        return this.repoName
    }

    setRepoName(name: string): this {
        this.repoName = name;
        return this;
    }

    getRunId(): number {
        return this.runId;
    }

    setRunId(runId: number): this {
        this.runId = runId;
        return this;
    }

    getStatus(): AvailableStatuses {
        return this.status;
    }

    setStatus(status: AvailableStatuses): this {
        this.status = status;
        return this;
    }
}

const context = new Context();
export default context;
