import { AbstractOutput } from "./abstract-output";

class MockOuput extends AbstractOutput {
    send(): void {
        // do nothing, just mocking output for github
    }
}

const output = new MockOuput();
export default output;
