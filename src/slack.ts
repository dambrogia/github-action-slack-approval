import { WebClient } from "@slack/web-api";
import { Message } from '@slack/web-api/dist/response/ConversationsHistoryResponse';

export default class Slack {
    private channel: string;
    private client: WebClient;

    constructor(channel: string, token: string) {
        this.channel = channel;
        this.client = new WebClient(token);
    }

    async write(text: string): Promise<{ success: boolean, response: object }> {
        const response = await this.client.chat.postMessage({
            text: text,
            channel: this.channel
        });

        return { success: response.ok, response: response };
    }

    private async getRecentMessages(): Promise<Array<Message>> {
        const response = await this.client.conversations.history({
            channel: this.channel,
            limit: 50
        });

        if (!response.ok) {
            throw Error(`Invalid reponse from slack when reading messages: ${response?.error || ''}`);
        }

        return response?.messages || [];
    }

    async* poll(timeout: number) {
        const started = Math.floor(Date.now() / 1000);
        const secondsPassed = () => Math.floor(Date.now() / 1000) - started;

        while (secondsPassed() <= timeout) {
            await new Promise(r => setTimeout(r, 10000));
            let messages = await this.getRecentMessages();

            for (let i = 0; i < messages.length; i++) {
                yield messages[i];
            }
        }
    }
}
