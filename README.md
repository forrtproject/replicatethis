# Replicate This

A serverless, GitHub-based website for nominating research papers for replication.

## Deployment Instructions
1. Upload all these files to a new GitHub repository.
2. Go to **Settings > Pages**. Under "Build and deployment", set **Source** to **GitHub Actions**.
3. Go to **Settings > General** and ensure "Issues" is enabled.
4. Go to **Issues > Labels** and create `status: approved`, `status: pending`, `status: rejected`, etc.
5. Edit `src/submit.md` to point to your repository's issue URL.
6. The GitHub Action will run automatically and deploy the site.

## How to Moderate Nominations
1. When a user submits via the Issue form, it is assigned `status: pending`.
2. Review the issue against the Code of Conduct.
3. If valid, remove `status: pending` and assign `status: approved`.
4. Add any optional tags (e.g., `type: replication`, `discipline: economics`).
5. The GitHub Action will immediately trigger, fetch the updated approved issues, and deploy the new version of the website.

## Local Development
Run `npm install`, then run `npm run serve`. A local server will start at `http://localhost:8080`.
