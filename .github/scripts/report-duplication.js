const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("GITHUB_TOKEN");
    const octokit = github.getOctokit(token);
    const context = github.context;

    if (context.payload.pull_request) {
      await octokit.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.payload.pull_request.number,
        body:
          `⚠️ Code duplication detected!\n\n` +
          `We found ${core.getInput("duplication-percent")}% duplicated code.\n` +
          `Please review the [workflow run](${context.serverUrl}/${context.repo.repo}/actions/runs/${context.runId}) for details.`,
      });
    }
  } catch (error) {
    core.warning(`Failed to create comment: ${error.message}`);
  }
}

run();
