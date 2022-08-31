import { AbstractOutput } from "./abstract-output";
import * as core from '@actions/core';

class GitHubOutput extends AbstractOutput {
    send(): void {
        const keys = Object.keys(this.out);

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const v = this.out[k];
            core.setOutput(k, v);
        }
    }
}

const output = new GitHubOutput();
export default output;
