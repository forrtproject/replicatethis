---
layout: base.njk
title: Replicate This
templateEngineOverride: njk, md
---

<div style="text-align: center; max-width: 700px; margin: 0 auto 60px auto;">

  <p style="font-size: 2.2rem; font-style: italic; line-height: 1.4; margin-bottom: 30px; color: var(--text);">
    Informing the scientific process through collaborative reproduction and replication.
  </p>

  <p style="color: var(--text-muted); font-size: 1.2rem; margin-bottom: 40px;">
    An ongoing community registry for nominating published research papers that merit independent verification across all disciplines.
  </p>

</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin-bottom: 40px;">

<h3 style="text-align: center; margin-bottom: 30px;">How it works</h3>

1. **Nominate:** Submit a structured GitHub Issue detailing a paper's DOI and why it should be replicated.
2. **Moderate:** Maintainers review submissions for scientific merit and adherence to our Code of Conduct.
3. **Publish:** Approved nominations are automatically indexed on this website and leaderboards are updated.
4. **Replicate:** Discuss and claim a nominated study, and replicate it alone or with fellow researchers.

<div style="text-align: center; margin-top: 50px;">
  <a href="https://github.com/forrtproject/replicatethis/issues/new?template=nomination.yml" style="display: inline-block; padding: 12px 24px; border: 1px solid var(--gold); text-decoration: none; color: var(--gold); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">Nominate a Study</a>
  <a href="{{ '/browse/' | url }}" style="display: inline-block; padding: 12px 24px; border: 1px solid var(--border); text-decoration: none; color: var(--text); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">Browse Registry</a>
</div>
