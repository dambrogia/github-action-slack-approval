import { AbstractInput, AvailableInputs } from '../../src/input/abstract-input';
import fs from 'fs';
import input from '../../src/input/factory';
import path from 'path';
import yaml from 'js-yaml';

const readDeclaration = (): object => {
    const file = path.join(__dirname, '..', '..', '..', 'action.yaml');
    const content = fs.readFileSync(file, 'utf-8');
    const doc = yaml.load(content) as any;
    return doc.inputs;
};

export const createMockInput = (): AbstractInput => {
    const declared = readDeclaration() as any;
    const keys = Object.keys(AvailableInputs);

    for (let i = 0; i < keys.length; i++) {
        const k = keys[i] as AvailableInputs;
        const v = declared[k] as { default: string | undefined };

        if (v.default !== undefined) {
            input.set(k, v.default);
        }
    }

    input.set(AvailableInputs.SLACK_CHANNEL, (process.env['SLACK_CHANNEL'] as string));
    input.set(AvailableInputs.SLACK_TOKEN, (process.env['SLACK_TOKEN'] as string));

    return input;
};
