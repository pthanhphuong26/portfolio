# Pham Thanh Phuong — Portfolio

A lightweight Vite portfolio built with semantic HTML, CSS, and JavaScript.

## Project structure

```text
.
├── assets/
│   ├── css/styles.css            # Visual design and responsive styles
│   ├── images/                   # Project and brand images
│   └── js/main.js                # Navigation and reveal behavior
├── scripts/
│   └── validate.mjs              # Checks HTML structure and local assets
├── index.html                    # Page content and accessible markup
├── package.json                  # Vite dependency and development commands
└── package-lock.json             # Reproducible dependency versions
```

## Update the portfolio

- Edit the hero, featured projects, and social links in `index.html`.
- Edit the theme tokens at the top of `assets/css/styles.css` to change the main
  colors or content width. Other spacing, layout, and responsive rules live in
  the same file.
- Add project images to `assets/images/` and reference them with a relative path.
- Keep behavior changes in `assets/js/main.js`.

Project cards use the `.project-card` structure in `index.html`. Copy the existing
BillĐi card when adding another project, then update its image, tags, description,
and links.

## Develop locally

Node.js 24 or newer is required. Install dependencies once:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

Create and preview an optimized production build:

```bash
npm run build
npm run preview
```

Use a different development port when needed:

```powershell
npm run dev -- --port 5000
```

Before committing, run:

```bash
npm run check
```

This checks JavaScript syntax, validates the source site, runs a Vite production
build, and validates the generated site for missing assets, duplicate IDs,
unsafe external links, missing image alt text, and accidental inline CSS or
JavaScript.

## Deploy to Vercel

Deployment settings live in `vercel.json`. Vercel installs with `npm ci`, builds
with `npm run check` (so a failed validation blocks the deploy), and serves
`dist/`. Hashed files under `/assets/` are cached for a year; every response
also gets basic security headers. Vercel uses Node.js 24 because of the
`engines` field in `package.json`.

Deploys run from GitHub Actions (`.github/workflows/deploy.yml`). Each push to
`main` deploys to production; every pull request gets a preview URL, shown in
the workflow run summary. Vercel's own Git auto-deploys are turned off in
`vercel.json` (`git.deploymentEnabled: false`) so nothing deploys twice.

### One-time setup

1. Create a Vercel project and link this folder to it:

   ```bash
   npm i -g vercel
   vercel link
   ```

   This writes `.vercel/project.json` (git-ignored) containing `orgId` and
   `projectId`.

2. Create a token at <https://vercel.com/account/tokens>.

3. Add three repository secrets under GitHub → Settings → Secrets and
   variables → Actions:

   | Secret              | Value                                   |
   | ------------------- | --------------------------------------- |
   | `VERCEL_TOKEN`      | The token from step 2                   |
   | `VERCEL_ORG_ID`     | `orgId` from `.vercel/project.json`     |
   | `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

### Manual deploy

```bash
vercel             # preview deployment
vercel --prod      # production deployment
```
