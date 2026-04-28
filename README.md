# National Women's Conference 2026

Standalone React landing page for the National Women's Conference 2026 hosted by Apostolic Overcoming Holy Church of God, Inc.

## Local development

Install dependencies:

```bash
npm install
```

Build the static site:

```bash
npm run build
```

Preview locally from the project folder:

```bash
python3 -m http.server 3010
```

Then open `http://127.0.0.1:3010`.

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow that deploys the site to GitHub Pages whenever changes are pushed to `main`.
