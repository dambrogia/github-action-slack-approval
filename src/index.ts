import * as core from '@actions/core'
import Slack, { Action } from './slack'

async function run(): Promise<void> {
  const errorAction =
    core.getInput('errorAction') === Action.APPROVE
      ? Action.APPROVE
      : Action.REJECT

  function setOutput(
    approved: boolean,
    rejected: boolean,
    error: boolean
  ): void {
    core.setOutput('approved', approved ? '1' : '0')
    core.setOutput('rejected', rejected ? '1' : '0')
    core.setOutput('error', error ? '1' : '0')
  }

  try {
    const approvalPrefix = core.getInput('approvalPrefix')
    const rejectionPrefix = core.getInput('rejectionPrefix')
    const repository = core.getInput('repository')
    const runId = core.getInput('runId')
    const slackAppId = core.getInput('slackAppId')
    const slackChannel = core.getInput('slackChannel')
    const slackHistoryLimit = core.getInput('slackHistoryLimit')
    const slackPollPause = core.getInput('slackPollPause')
    const slackPollTimeout = core.getInput('slackPollTimeout')
    const slackToken = core.getInput('slackToken')
    const timeoutAction = core.getInput('timeoutAction')

    const slackClient = new Slack(slackToken, {
      appId: slackAppId,
      channel: slackChannel,
      historyLimit: Number(slackHistoryLimit),
      pollPause: Number(slackPollPause),
      pollTimeout: Number(slackPollTimeout),
      errorAction:
        errorAction === Action.APPROVE ? Action.APPROVE : Action.REJECT,
      timeoutAction:
        timeoutAction === Action.APPROVE ? Action.APPROVE : Action.REJECT
    })

    const approvalText = `${approvalPrefix}${runId}`
    const rejectionText = `${rejectionPrefix}${runId}`
    const approvalRequestMessage = Slack.getApprovalRequestMessage(
      repository,
      runId,
      approvalText,
      rejectionText
    )

    await slackClient.write(approvalRequestMessage)
    const update = (state: string): void => {
      try {
        slackClient.write(`Run id ${runId} has been ${state}.`)
      } catch (e) {
        core.notice(`failed message ${state} status update`)
      }
    }

    if (await slackClient.approve(approvalText, rejectionText)) {
      setOutput(true, false, false)
      update('approved')
    } else {
      setOutput(false, true, false)
      update('rejected')
    }
  } catch (error) {
    if (error instanceof Error && errorAction === Action.REJECT) {
      core.setFailed(error.message)
    }

    setOutput(
      errorAction === Action.APPROVE,
      errorAction === Action.REJECT,
      true
    )
  }
}

run()
