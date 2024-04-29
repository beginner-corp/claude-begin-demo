# Claude x Begin

## Deploy Claude from scratch to AWS in under 5 minutes


### Prerequisites

- Access to the [Anthropic Console](https://console.anthropic.com/) to create a Claude API Key
- Are [logged into Begin](https://begin.com/deploy/docs/getting-started/installing-the-begin-cli)


### Setup

1. Install dependencies: `npm i`
2. Create an environment: `npx begin create -e demo`
3. Add your Claude API key: `npx begin env create --env demo --name ANTHROPIC_API_KEY --value $your_claude_key`
4. [Optional] Test locally:
  - Create a local env file for testing locally: `echo $your_claude_key > .env`
  - Start the local dev server: `npx begin dev`
5. Deploy: `npx begin deploy -e demo`
