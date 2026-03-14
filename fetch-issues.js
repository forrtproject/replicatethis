
const fs = require('fs');
const path = require('path');

const REPO = process.env.GITHUB_REPOSITORY || 'your-username/your-repo';
const TOKEN = process.env.GITHUB_TOKEN;

async function fetchIssues() {
  const url = `https://api.github.com/repos/${REPO}/issues?state=all&labels=status:%20approved`;
  const headers = { 'Accept': 'application/vnd.github.v3+json' };
  if (TOKEN) headers['Authorization'] = `token ${TOKEN}`;

  const res = await fetch(url, { headers });
  const issues = await res.json();
  
  const nominations = [];
  const leaderboards = { journals: {}, disciplines: {}, papers: {} };

  for (const issue of issues) {
    if (issue.pull_request) continue; // Skip PRs

    const parsed = parseIssueBody(issue.body);
    const doiData = parsed.DOI ? await fetchCrossref(parsed.DOI) : {};

    const nom = {
      id: issue.number,
      title: doiData.title || issue.title.replace('[Nomination]: ', ''),
      authors: doiData.authors || 'Unknown Authors',
      url: issue.html_url,
      ...parsed,
      labels: issue.labels.map(l => l.name)
    };
    nominations.push(nom);

    // Update Leaderboards
    if (nom.Journal) leaderboards.journals[nom.Journal] = (leaderboards.journals[nom.Journal] || 0) + 1;
    if (nom.Discipline) leaderboards.disciplines[nom.Discipline] = (leaderboards.disciplines[nom.Discipline] || 0) + 1;
    if (nom.DOI) {
      if (!leaderboards.papers[nom.DOI]) leaderboards.papers[nom.DOI] = { title: nom.title, count: 0 };
      leaderboards.papers[nom.DOI].count++;
    }
  }

  // Ensure _data directory exists
  const dataDir = path.join(__dirname, '../src/_data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(path.join(dataDir, 'nominations.json'), JSON.stringify(nominations, null, 2));
  fs.writeFileSync(path.join(dataDir, 'leaderboards.json'), JSON.stringify(leaderboards, null, 2));
}

function parseIssueBody(body) {
  const fields = {};
  const sections = body.split('### ').slice(1);
  sections.forEach(sec => {
    const lines = sec.split('\n');
    const key = lines.shift().trim();
    const value = lines.join('\n').trim();
    if (value && value !== '_No response_') fields[key] = value;
  });
  return fields;
}

async function fetchCrossref(doi) {
  try {
    const res = await fetch(`https://api.crossref.org/works/${doi}`);
    if (!res.ok) return {};
    const data = await res.json();
    const authors = data.message.author ? data.message.author.map(a => `${a.given} ${a.family}`).join(', ') : '';
    return { title: data.message.title[0], authors };
  } catch (e) {
    return {};
  }
}

fetchIssues();
