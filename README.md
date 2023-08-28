# GitHub Action Slack Approval

![GitHub Action Slack Approvals](https://github.com/dambrogia/github-actions-slack-approval/actions/workflows/ci.yml/badge.svg)
![GitHub Action Slack Approvals test coverage](https://github.com/dambrogia/github-actions-slack-approval/badges/coverage.svg)

This is a small action that will allow you to prevent your actions from moving along until they are approved by a slack message.

## Using this action

```yaml
name: Example Build Job

on:
  pull_request:
    branches: [ main ]

jobs:
  example-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Slack Approval
        uses: dambrogia/github-actions-slack-approval@0.0.1
        with:
          approvalPrefix: approve-
          errorAction: reject
          rejectionPrefix: reject-
          repository: ${{ github.repository }}
          runId: ${{ github.run_id }}
          slackAppId: ${{ secrets.mySlackAppId }}
          slackChannel: '#my-slack-channel'
          slackHistoryLimit: '15'
          slackPollPause: '10000' # 10 seconds between polling requests
          slackPollTimeout: '300000' # 5 min timeout
          timeoutAction: reject

      # use the outputs, see action.yaml for more info on input/outputs:
      # ${{ steps.slack-approvals.outputs.approved }}
      # ${{ steps.slack-approvals.outputs.rejected }}
      # ${{ steps.slack-approvals.outputs.error }}

      - name: Set Node.js 16.x
        uses: actions/setup-node@v3.6.0
        if: ${{ steps.slack-approvals.outputs.approved }}
        with:
          node-version: 16.x

      - name: Build, tag, and push docker image to Amazon ECR
        run: |
          docker build -t my-image:my-tag .
          docker push my-image:my-tag
```

## Possible issues and improvements

1. Run ID is being used right now for uniqueness in the approval/rejection messages. However, run ID is not unique across retry attempts, so if retried it's likely that the old approval would be picked up and the workflow would prematurely continue.
2. Provide information on creating a Slack app in your workspace. Possibly create public app for this so others can install it?
3. Improve experience with slack app ID for skipping approval consideration on messages posted by the bot.
