import { expect, test } from '@jest/globals'
import { describe } from 'node:test'
import Slack, { Action } from './slack'

describe('Slack integration', () => {
  const d = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 10)
  const testId = `${d}-${rand}`

  const slackClient = new Slack(process.env.SLACK_TOKEN ?? '', {
    channel: process.env.SLACK_CHANNEL ?? '',
    historyLimit: 3,
    pollPause: 500,
    pollTimeout: 2000,
    // for testing, check our existing message written by the bot,
    // so we don't want to set the correct app id to ignore bot messages
    // so this will be an invalid id
    appId: 'invalidId',
    errorAction: Action.REJECT,
    timeoutAction: Action.REJECT
  })

  test('write', async () => {
    const response = await slackClient.write(`test write (${testId})`)
    expect(response.success).toBeTruthy()
  })

  test('approvals', async () => {
    const approvalMessage = `approve-${testId}`
    const rejectionMessage = `reject-${testId}`
    const invalidMessage = 'THIS_MESSAGE_DOES_NOT_EXIST'
    const message = Slack.getApprovalRequestMessage(
      'repo-owner/repo',
      'foobar123',
      approvalMessage,
      rejectionMessage
    )

    const response = await slackClient.write(message)
    expect(response.success).toBeTruthy()

    const approval = await slackClient.approve(approvalMessage, invalidMessage)
    expect(approval).toBeTruthy()

    const rejection = await slackClient.approve(
      invalidMessage,
      rejectionMessage
    )
    expect(rejection).toBeFalsy()

    const timedout = await slackClient.approve(invalidMessage, invalidMessage)
    const timeoutApproved = slackClient.getTimeoutAction() === Action.APPROVE
    expect(timedout).toBe(timeoutApproved)
  })
})
