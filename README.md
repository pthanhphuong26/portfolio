# Pham Thanh Phuong — Portfolio

A dependency-free static portfolio built with semantic HTML, CSS, and JavaScript.

## Project structure

```text
.
├── .github/workflows/deploy.yml  # CI and cPanel deployment
├── assets/
│   ├── css/styles.css            # Visual design and responsive styles
│   ├── images/                   # Project and brand images
│   └── js/main.js                # Navigation and reveal behavior
├── scripts/
│   ├── build.mjs                 # Creates the deployable dist/ directory
│   ├── deploy-cpanel.sh          # Activates a versioned release over SSH
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

## CI/CD with cPanel

The workflow in `.github/workflows/deploy.yml` validates every pull request and
push to `main`. When cPanel deployment is enabled, a successful `main` build is
packaged, uploaded over SSH, activated as `CPANEL_APP_ROOT/current`, and checked
through the public production URL.

### cPanel setup

The cPanel account must support SSH access. Create or import a dedicated
deployment public key in **Security → SSH Access → Manage SSH Keys**, then
authorize it. Configure the portfolio domain's document root as:

```text
CPANEL_APP_ROOT/current
```

For example, if `CPANEL_APP_ROOT` is
`/home/account/public_html/portfolio`, use
`public_html/portfolio/current` as the domain document root. Keep this directory
dedicated to the portfolio because deployments replace its `current` directory.

### GitHub configuration

Create a GitHub environment named `production`. Add these environment variables:

| Variable | Example | Purpose |
| --- | --- | --- |
| `PRODUCTION_URL` | `https://portfolio.example.com` | Public HTTPS URL used by deployment verification |
| `CPANEL_APP_ROOT` | `/home/account/public_html/portfolio` | Root containing versioned releases and `current` |
| `CPANEL_SSH_PORT` | `22` | cPanel SSH port |

Add these environment secrets:

| Secret | Purpose |
| --- | --- |
| `CPANEL_HOST` | SSH hostname without a protocol |
| `CPANEL_USER` | Restricted cPanel SSH username |
| `CPANEL_SSH_PRIVATE_KEY` | Private half of the dedicated deployment key |
| `CPANEL_KNOWN_HOSTS` | Verified SSH host-key entry for the server |

Generate `CPANEL_KNOWN_HOSTS` from a trusted machine and compare the fingerprint
with the hosting provider before saving it. Do not trust an unverified
`ssh-keyscan` result inside the workflow.

Finally, create the repository-level Actions variable
`CPANEL_DEPLOY_ENABLED=true`. The deployment job remains safely disabled while
this variable is missing or set to another value. Run the workflow manually or
push to `main` after all variables and secrets are configured.

### Releases and rollback

Each deployment is retained under `CPANEL_APP_ROOT/releases/<commit-sha>`. The
previous live directory remains at `CPANEL_APP_ROOT/.current-previous`, allowing
an SSH administrator to restore it if a rollback is needed.
