# DevRel Guide

Curated playbook of Developer Relations resources, programs, and live job listings — plus long-form essays on the systems modern DevRel and AI agent stacks are built on.

Live at [learndevrel.com](https://learndevrel.com).

## What's inside

- **Blog** — 12 long-form essays on DevRel, AI coding agents, MCP, A2A, agent sandboxes, agent memory, and backend architecture
- **Resources** — curated blog posts, GitHub repositories, and job listings, served from JSON via Next.js API routes
- **Programs** — real-world DevRel programs from leading companies, with templates and case studies
- **Scrapers** — Python scripts that refresh the resource and job listings from external sources

## Tech stack

- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS with dark/light themes
- Framer Motion for transitions
- Edge runtime for OpenGraph and Twitter card images

No client-side data viz libraries, no separate backend service. All data is served from JSON files via Next.js API routes.

## Project layout

```
devrelguide/
  frontend/
    src/app/
      blog/              # 12 blog post folders + blog-data.ts index
      programs/          # programs directory page
      resources/         # resource library page
      api/               # 4 routes: resources, jobs, update-resources, healthz
      sitemap.ts         # auto-generated from blog-data.ts + static routes
      robots.ts          # crawl policy
      layout.tsx         # root metadata + JSON-LD Organization graph
    src/components/
      layout/            # Header, Footer
      programs/          # DevRelPrograms component
      ui/                # shared UI (resource-card, hero-section, etc.)
    src/lib/
      constants.ts       # SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESC
      data.ts            # readJsonData/writeJsonData helpers
    data/                # JSON resource/job/program data
    scripts/             # Python scrapers + blog diagram generator
    public/              # static assets
```

## Getting started

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Dev server runs at `http://localhost:3000`. All API routes are served by Next.js — no separate backend.

### Build for production

```bash
npm run build
npm run start
```

## API routes

| Route | Description |
|-------|-------------|
| `GET /api/resources` | Combined blog posts, GitHub repos, and job listings (deduplicated) |
| `GET /api/jobs` | DevRel job listings only |
| `POST /api/update-resources` | Read counts from `data/devrel_resources.json` |
| `GET /api/healthz` | Health check |

## Pages

| Page | Description |
|------|-------------|
| `/` | Hero + features overview |
| `/blog` | Blog index with all 12 posts |
| `/blog/<slug>` | Individual blog posts (each with its own OG + Twitter image route) |
| `/programs` | Real-world DevRel programs directory |
| `/resources` | Curated DevRel resource library |
| `/about` | About DevRel Guide |
| `/contact` | Consultation contact form |
| `/sitemap.xml` | Auto-generated from `blog-data.ts` + static routes |
| `/robots.txt` | Allow `/`, disallow `/api/`, sitemap reference |

## Refreshing data

Resource and job data lives as JSON in `frontend/data/`. To refresh from external sources, run the Python scrapers:

```bash
cd frontend/scripts
pip install -r requirements.txt
python scraper/devrel_scraper.py
python update_resources.py
```

The scrapers write back into `frontend/data/`, which the Next.js API routes serve on the next request.

## SEO

The site ships with:

- Per-route `layout.tsx` with `title`, `description`, `canonical`, and OpenGraph metadata
- Auto-generated `sitemap.xml` covering all blog posts and static pages
- `robots.txt` that allows crawling and blocks `/api/`
- JSON-LD `Organization` + `WebSite` graph in the root layout
- Per-post OpenGraph and Twitter card images at 1200×630, rendered on the edge runtime

Site-level constants (`SITE_URL`, `SITE_NAME`, `SITE_TITLE`, `SITE_DESC`) live in `frontend/src/lib/constants.ts`.

## Deployment

Production runs on Vercel against the `main` branch.

- Project root: `frontend/`
- Install command: `npm install --legacy-peer-deps`
- Node version: 22.x

## Contributing

Pull requests welcome. For new blog posts, follow the structure of existing ones in `frontend/src/app/blog/<slug>/`:

- `page.tsx` — the post body
- `layout.tsx` — per-post metadata
- `opengraph-image.tsx` and `twitter-image.tsx` — social card images
- Add an entry at the top of `frontend/src/app/blog/blog-data.ts`

## License

MIT — see [LICENSE.txt](LICENSE.txt).
