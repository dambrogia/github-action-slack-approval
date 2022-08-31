import { Action, AvailableInputs } from '../src/input/abstract-input';
import { createMockInput } from './mock/input';

describe('context test', () => {
    test('getApprovalMessage', () => {
        const input = createMockInput();
        expect(input.getApprovalMessage()).toContain('Would you like to continue');
    });

    test('getApprovedString', () => {
        const input = createMockInput();
        expect(input.getApprovedString()).toContain('github_action_approve_');
    });

    test('getFailureAction', () => {
        const input = createMockInput();
        expect(input.getFailureAction()).toContain(Action.STOP);
    });

    test('getRejectedString', () => {
        const input = createMockInput();
        expect(input.getRejectedString()).toContain('github_action_reject_');
    });

    test('getSlackChannel', () => {
        const input = createMockInput();
        // expect channel to be set -- slack test will confirm this working,
        // we just want to test the getter.
        expect(input.getSlackChannel()).not.toBe('');
    });

    test('getSlackToken', () => {
        const input = createMockInput();
        // expect token to be set -- slack test will confirm this working,
        // we just want to test the getter.
        expect(input.getSlackToken()).not.toBe('');
    });

    test('getSlackUsersAllowed', () => {
        const input = createMockInput();
        expect(input.getSlackUsersAllowed()).toBe('');
    });

    test('getSlackUsersIgnored', () => {
        const input = createMockInput();
        expect(input.getSlackUsersIgnored()).toContain('Github Action Approvals');
    });

    test('getTimeout', () => {
        const input = createMockInput();
        expect(input.getTimeout()).toBe('300');
    });

    test('getTimeoutAction', () => {
        const input = createMockInput();
        expect(input.getTimeoutAction()).toBe(Action.STOP);
    });

});
