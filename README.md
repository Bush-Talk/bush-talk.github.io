# Bush Talk

Static site for [Bush Talk](https://bushtalkinfo.com), with a browser-based CMS at
`/admin` so content can be edited without touching code.

- **Astro** — static output, no server, no adapter
- **Sveltia CMS** — client-side editor that commits straight to GitHub
- **HubSpot** — enquiry form posts to the unauthenticated Forms v3 endpoint

Nothing here runs server-side. That's deliberate: it keeps hosting free and means
there is no secret in the bundle to protect.

## Running it

Node 22+ is required (see `.nvmrc`).

```bash
nvm use          # or: nvm install
npm install
npm run dev      # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Serve the built site |

## Editing content

Two ways in.

**Locally** — content is Markdown and JSON under `src/content/` and `src/data/`.
Edit the files directly.

**In the browser** — run `npm run dev` and open `http://localhost:4321/admin`.
Sveltia can read and write your local checkout through the browser's File System
Access API (Chrome/Edge), so you get the real editor without deploying anything.

Once deployed, the same editor lives at `yoursite.com/admin` and commits to GitHub.

### Content model

| Where | What | Shows up on |
| --- | --- | --- |
| `src/content/programs/` | Programs | `/programs`, home |
| `src/content/workshops/` | Weaving workshops | `/weaving-workshops` |
| `src/content/testimonials/` | Reviews | `/reviews`, home |
| `src/content/pages/` | Free-form pages | `/<filename>` |
| `src/data/site.json` | Contact details, footer | everywhere |
| `src/data/home.json` | Home page copy | `/` |

Dated workshops drop off the site automatically once the date passes, so old ones
can be left in place rather than deleted. Anything with `draft: true` is excluded
from the build.

> **Two schemas, one content model.** `src/content.config.ts` (validation) and
> `public/admin/config.yml` (the editor's form fields) describe the same thing.
> Sveltia can't read the Astro schemas, so **change one and you must change the
> other** — otherwise the build rejects what the editor saves.

## Still to do

1. **Point the CMS at the repo.** In `public/admin/config.yml`, set `backend.repo`
   to `owner/repo`.
2. **Set up editor login.** Until then, sign in at `/admin` with a GitHub personal
   access token. See the auth options below.
3. **Connect HubSpot.** Copy `.env.example` to `.env` and fill in the portal ID and
   form GUID. Until that's done the contact form shows a notice instead of sending.
   The `enquiry_type` field expects a custom contact property in HubSpot — create it
   under Settings → Properties, or remove the field.
4. **Add real images.** Everything currently renders a gradient placeholder. Images
   uploaded through the CMS land in `public/uploads/`.
5. **Deploy.** Not set up yet.

### Editor login options

| Option | Editor needs | Setup |
| --- | --- | --- |
| Personal access token | nothing | Mint a fine-grained PAT scoped to this repo with `Contents: Read and write`. Simplest, but it's a shared long-lived credential. |
| GitHub OAuth | a GitHub account + 2FA | Deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth), set `backend.base_url`. |
| Cloudflare Access | an email address | [sveltia-cms-cloudflare-access-auth](https://github.com/hollesse/sveltia-cms-cloudflare-access-auth) — email code login, short-lived tokens, per-person revocation. |

## Notes on content

Copy is taken from the existing bushtalkinfo.com and Wix sites. A few things were
changed and are worth a look:

- **Acknowledgement of Country** — "Wurundjerdi" corrected to **Wurundjeri**, and
  "who's" to "whose".
- **Melissa Langford / Longford** — spelled both ways across the old site. Using
  **Langford**; worth confirming.
- **Mullam / Mullum Primary** — same. Using **Mullum**.
- **Workshop dates** — the dated workshops had all passed, so they're set to 2027
  placeholders to keep the section visible. Replace with real dates.
- **Contact details** — taken from bushtalkinfo.com. The Wix site's
  `hello@bushtalk.com.au` / `+61 400 000 000` are placeholders and weren't used.
