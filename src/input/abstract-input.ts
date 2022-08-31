export enum Action {
    STOP = 'STOP',
    CONTINUE = 'CONTINUE',
}

export enum AvailableInputs {
    APPROVAL_MESSAGE = 'APPROVAL_MESSAGE',
    APPROVED_STRING = 'APPROVED_STRING',
    FAILURE_ACTION = 'FAILURE_ACTION',
    REJECTED_STRING = 'REJECTED_STRING',
    SLACK_CHANNEL = 'SLACK_CHANNEL',
    SLACK_TOKEN = 'SLACK_TOKEN',
    SLACK_USERS_ALLOWED = 'SLACK_USERS_ALLOWED',
    SLACK_USERS_IGNORED = 'SLACK_USERS_IGNORED',
    TIMEOUT = 'TIMEOUT',
    TIMEOUT_ACTION = 'TIMEOUT_ACTION',
}

export abstract class AbstractInput {
    abstract get(key: AvailableInputs): string;
    abstract getAction(key: AvailableInputs): Action;
    abstract set(key: AvailableInputs, value: Action | string): void;

    getApprovalMessage(): string {
        return this.get(AvailableInputs.APPROVAL_MESSAGE);
    }

    getApprovedString(): string {
        return this.get(AvailableInputs.APPROVED_STRING);
    }

    getFailureAction(): Action {
        return this.getAction(AvailableInputs.FAILURE_ACTION);
    }

    getRejectedString(): string {
        return this.get(AvailableInputs.REJECTED_STRING);
    }

    getSlackChannel(): string {
        return this.get(AvailableInputs.SLACK_CHANNEL);
    }

    getSlackToken(): string {
        return this.get(AvailableInputs.SLACK_TOKEN);
    }

    getSlackUsersAllowed(): string {
        return this.get(AvailableInputs.SLACK_USERS_ALLOWED);
    }

    getSlackUsersIgnored(): string {
        return this.get(AvailableInputs.SLACK_USERS_IGNORED);
    }

    getTimeout(): string {
        return this.get(AvailableInputs.TIMEOUT);
    }

    getTimeoutAction(): Action {
        return this.getAction(AvailableInputs.TIMEOUT_ACTION);
    }
}
