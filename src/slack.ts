import { WebClient } from '@slack/web-api'
import { Message } from '@slack/web-api/dist/response/ConversationsHistoryResponse'
import * as core from '@actions/core'

// eslint-disable-next-line no-shadow
export enum Action {
  APPROVE = 'approve',
  REJECT = 'reject'
}

type SlackConfig = {
  appId: string
  channel: string
  historyLimit: number
  pollPause: number
  pollTimeout: number
  timeoutAction: Action
  errorAction: Action
}

export default class Slack {
  private client: WebClient
  private channelId: undefined | string
  private config: SlackConfig

  constructor(token: string, config: SlackConfig) {
    this.client = new WebClient(token)
    this.config = config
  }

  /**
   * This is static because it contains no properties and uses all static data.
   * It's just put here so we can view the output format easily in our tests.
   */
  static getApprovalRequestMessage(
    repository: string,
    runId: string,
    approvalText: string,
    rejectionText: string
  ): string {
    return [
      '```',
      `Approval request: https://github.com/${repository}/actions/runs/${runId}`,
      `To approve this request, respond with: ${approvalText}`,
      `To reject this request, respond with: ${rejectionText}`,
      '```'
    ].join('\n')
  }

  async write(text: string): Promise<{ success: boolean; response: object }> {
    const channel = !this.config.channel.startsWith('#')
      ? `#${this.config.channel}`
      : this.config.channel

    const response = await this.client.chat.postMessage({
      text,
      channel
    })

    return { success: response.ok, response }
  }

  private async getChannelId(
    cursor: string | undefined
  ): Promise<string | undefined> {
    // cache this for later lookup since this method is called in a loop
    if (this.channelId !== undefined) {
      return this.channelId
    }

    const conversations = await this.client.conversations.list({
      limit: 200,
      cursor
    })

    const target = this.config.channel.startsWith('#')
      ? this.config.channel.substring(1)
      : this.config.channel

    if (conversations.channels && conversations.channels.length > 0) {
      for (let i = 0; i < conversations.channels.length; i++) {
        const channel = conversations.channels[i]

        if (channel.name === target) {
          this.channelId = channel.id
          return channel.id
        }
      }
    }

    if (
      conversations.response_metadata &&
      conversations.response_metadata?.next_cursor
    ) {
      return await this.getChannelId(
        conversations.response_metadata?.next_cursor
      )
    }

    return undefined
  }

  private async getRecentMessages(): Promise<Message[]> {
    const channelId = await this.getChannelId(undefined)

    if (channelId === undefined) {
      throw Error(`could not find slack channel: ${this.config.channel}`)
    }

    const response = await this.client.conversations.history({
      channel: channelId,
      limit: this.config.historyLimit
    })

    if (!response.ok) {
      throw Error(
        `Invalid reponse from slack when reading messages: ${
          response?.error || 'unknown'
        }`
      )
    }

    return response?.messages || []
  }

  // eslint-disable-next-line no-undef
  private async *poll(): AsyncGenerator<Message> {
    const started = Math.floor(Date.now())
    const secondsPassed = (): number => Math.floor(Date.now()) - started
    let i = 0

    while (secondsPassed() <= this.config.pollTimeout) {
      if (i++ > 0) {
        await new Promise(r => setTimeout(r, this.config.pollPause))
      }

      const messages = await this.getRecentMessages()

      for (let j = 0; j < messages.length; j++) {
        yield messages[j]
      }
    }
  }

  getErrorAction(): Action {
    return this.config.errorAction
  }

  getTimeoutAction(): Action {
    return this.config.timeoutAction
  }

  async approve(
    approvalNeedle: string,
    rejectionNeedle: string
  ): Promise<boolean | null> {
    try {
      for await (const message of this.poll()) {
        if (message && message?.bot_profile?.app_id !== this.config.appId) {
          if (message?.text?.includes(approvalNeedle) !== false) {
            return true
          } else if (message?.text?.includes(rejectionNeedle) !== false) {
            return false
          }
        }
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : 'unknown error'
      core.notice(`Error occured: ${error}`)
      return this.getErrorAction() === Action.APPROVE
    }

    return this.getTimeoutAction() === Action.APPROVE
  }
}
