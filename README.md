# Pham Thanh Phuong — Portfolio

A dependency-free static portfolio built with semantic HTML, CSS, and JavaScript.

## Project structure

```text
.
├── .github/workflows/deploy.yml  # CI and GitHub Pages deployment
├── assets/
│   ├── css/styles.css            # Visual design and responsive styles
│   ├── images/                   # Project and brand images
│   └── js/main.js                # Navigation and reveal behavior
├── scripts/
│   ├── build.mjs                 # Creates the deployable dist/ directory
│   ├── serve.mjs                 # Starts a local preview server
│   └── validate.mjs              # Checks HTML structure and local assets
├── index.html                    # Page content and accessible markup
└── package.json                  # Development commands
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

Node.js 24 or newer is required. No dependency installation is needed.

```bash
npm run dev
```

Open `http://127.0.0.1:4173`. Use a different port when needed:

```powershell
$env:PORT=5000; npm run dev
```

On macOS or Linux, use `PORT=5000 npm run dev`.

Before committing, run:

```bash
npm run check
```

This checks the JavaScript syntax, creates `dist/`, and validates the generated
site for missing assets, duplicate IDs, unsafe external links, missing image alt
text, and accidental inline CSS or JavaScript.

## CI/CD with GitHub Pages

The workflow in `.github/workflows/deploy.yml` validates every pull request and
every push to `main`. A successful push to `main` builds `dist/` and deploys it
to the `github-pages` environment.

For the first deployment:

1. Push this folder as the root of a GitHub repository using `main` as its default branch.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Run the workflow manually or push a commit to `main`.

The workflow deploys to the repository's standard GitHub Pages URL. Configure a
custom portfolio domain separately in the repository's Pages settings if needed.
