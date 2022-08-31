import context, { AvailableStatuses } from '../src/context';

describe('context test', () => {
    beforeEach(() => context.setRepoName('my-repo'));

    test('runtime context', () => {
        expect(context.isGithubAction()).toBe(false);
    });

    test('github repo owner', () => {
        context.setRepoOwner('my-org');
        expect(context.getRepoOwner()).toBe('my-org');
    });

    test('github repo name', () => {
        context.setRepoName('my-repo');
        expect(context.getRepoName()).toBe('my-repo');
    });

    test('github repo run id', () => {
        context.setRunId(123);
        expect(context.getRunId()).toBe(123);
    });

    test('status', () => {
        expect(context.getStatus()).toBe(AvailableStatuses.UNKOWN)
        expect(context.setStatus(AvailableStatuses.APPROVED).getStatus()).toBe(AvailableStatuses.APPROVED);
    })
});
