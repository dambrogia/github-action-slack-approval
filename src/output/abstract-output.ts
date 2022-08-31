import * as core from '@actions/github';

export abstract class AbstractOutput {
    protected out: any = {};

    /**
     * Push an item into the output buffer.
     */
    push(key: string, value: string): void {
        this.out[key] = value;
    }

    /**
     * Remove an item from the output buffer.
     */
    remove(key: string): string {
        return this.out[key];
    }

    /**
     * Submit the items to the output + empty the buffer.
     */
    abstract send(): void;
}
