# Replicate This

A serverless, GitHub-based website for nominating research papers for replication.

## Nomination Instructions
1. Pick a study to nominate.
2. Open an issue in the project (https://github.com/forrtproject/replicatethis/issues/new?template=nomination.yml).
3. Wait for moderators to change status label to "approved". It will then automatically appear on the website.

## Claiming Instructions
1. Choose a nominated study that you would like to reproduce/replicate.
2. Go to the nomination entry, scroll down, and comment on it, that you want to claim it (comment must include claim).
3. The status of the nomination will change to `status: claimed`. Other researchers may reach out to you for cooperation
4. Comment again once you posted the results as a preprint. The nomination will then be closed.

## How to Moderate Nominations (for project admins only)
1. When a user submits via the Issue form, it is assigned `status: pending`.
2. Review the issue against the Code of Conduct.
3. If valid, remove `status: pending` and assign `status: approved`.
4. Add any optional tags (e.g., `type: replication`, `discipline: economics`).
5. The GitHub Action will immediately trigger, fetch the updated approved issues, and deploy the new version of the website.

