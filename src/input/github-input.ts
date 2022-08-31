import { AbstractInput, Action, AvailableInputs } from "./abstract-input";
import * as core from '@actions/core';

class GitHubInput extends AbstractInput {
    get(key: AvailableInputs): string {
        return core.getInput(key);
    }

    getAction(key: AvailableInputs): Action {
        return core.getInput(key) as Action;
    }

    set(key: AvailableInputs, value: string): void {
        throw Error('this method is not supported in this instance');
    }
}

const input = new GitHubInput();
export default input;
