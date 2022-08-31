import { AbstractInput, Action, AvailableInputs } from "./abstract-input";

class MockInput extends AbstractInput {
    private data = {} as any;

    get(key: AvailableInputs): string {
        return this.data[key];
    }

    getAction(key: AvailableInputs): Action {
        return this.data[key];
    }

    set(key: AvailableInputs, value: Action | string): void {
        this.data[key] = value;
    }
}

const input = new MockInput();
export default input;
