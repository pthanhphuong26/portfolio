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
