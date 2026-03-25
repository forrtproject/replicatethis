const fs = require('fs');
const path = require('path');

const REPO = 'forrtproject/replicatethis'; 
const TOKEN = process.env.GITHUB_TOKEN;

async function fetchIssues() {
  console.log(`Fetching approved issues from ${REPO}...`);
  
  const url = `https://api.github.com/repos/${REPO}/issues?state=open&labels=status:%20approved`;
  const headers = { 'Accept': 'application/vnd.github.v3+json' };
  if (TOKEN) headers['Authorization'] = `token ${TOKEN}`;

  try {
    const res = await fetch(url, { headers });
    const issues = await res.json();
    const nominations = [];

    for (const issue of issues) {
      if (issue.pull_request) continue;
      const labels = issue.labels.map(l => l.name.toLowerCase());
      if (!labels.includes('type: replication') && !labels.includes('type: reproduction')) continue;

      const parsed = parseIssueBody(issue.body);
      const repType = labels.includes('type: replication') ? 'Replication' : 'Reproduction';
      const isClaimed = labels.includes('claimed');
      const seekingCollab = labels.includes('seeking collaborators'); // New Collaborator flag
      const upvotes = issue.reactions ? issue.reactions['+1'] : 0; // Fetch GitHub Thumbs Up
      
      const targetJournals = [];
      issue.labels.forEach(l => {
        if (l.name.toLowerCase().startsWith('journal:')) {
          targetJournals.push(l.name.split(':')[1].trim());
        }
      });
      
      let discussion = [];
      if (issue.comments > 0) {
        const commentsRes = await fetch(issue.comments_url, { headers });
        const commentsData = await commentsRes.json();
        discussion = commentsData.map(c => ({
          author: c.user.login,
          body: c.body,
          date: new Date(c.created_at).toLocaleDateString()
        }));
      }

      nominations.push({
        id: issue.number,
        title: issue.title.replace('[Nomination]: ', ''),
        url: issue.html_url,
        date: issue.created_at,
        formattedDate: new Date(issue.created_at).toLocaleDateString(),
        type: repType,
        isClaimed: isClaimed,
        seekingCollab: seekingCollab,
        upvotes: upvotes,
        targetJournals: targetJournals,
        nominator: issue.user.login,
        commentCount: issue.comments,
        discussion: discussion,
        ...parsed,
        labels: labels
      });
    }

    const calcBoard = (noms) => {
      const j = {}, d = {}, u = {};
      noms.forEach(n => {
        if (n.Journal) j[n.Journal] = (j[n.Journal] || 0) + 1;
        if (n.Discipline) d[n.Discipline] = (d[n.Discipline] || 0) + 1;
        if (n.nominator) u[n.nominator] = (u[n.nominator] || 0) + 1;
      });
      const sortObj = (obj) => Object.entries(obj).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      return { journals: sortObj(j), disciplines: sortObj(d), nominators: sortObj(u) };
    };

    const leaderboards = {
      all: calcBoard(nominations),
      replication: calcBoard(nominations.filter(n => n.type === 'Replication')),
      reproduction: calcBoard(nominations.filter(n => n.type === 'Reproduction'))
    };

    const dataDir = path.join(__dirname, '../src/_data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    fs.writeFileSync(path.join(dataDir, 'nominations.json'), JSON.stringify(nominations, null, 2));
    fs.writeFileSync(path.join(dataDir, 'leaderboards.json'), JSON.stringify(leaderboards, null, 2));
    
    console.log(`Saved ${nominations.length} nominations and generated leaderboards.`);
  } catch (error) {
    console.error("Error fetching issues:", error);
  }
}

function parseIssueBody(body) {
  const fields = {};
  if (!body) return fields;
  const sections = body.split('### ').slice(1);
  sections.forEach(sec => {
    const lines = sec.split('\n');
    const key = lines.shift().trim();
    const value = lines.join('\n').trim();
    if (value && value !== '_No response_') fields[key] = value;
  });
  return fields;
}

fetchIssues();
