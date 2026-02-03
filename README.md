# DevRel Guide

A comprehensive web application for Developer Relations (DevRel) resources, tools, and visualizations designed to help DevRel professionals, teams, and organizations effectively bridge the gap between developers and business.

## What is DevRel Guide?

![GIF](/frontend/public/images/homepage.gif)

This application serves as a centralized hub for Developer Relations resources, providing tools, templates, strategies, and metrics to help DevRel professionals excel in their roles. Whether you're new to DevRel or an experienced professional, this application offers valuable resources to enhance your DevRel efforts.

## Key Features

### Resource Library
- 400+ curated DevRel blog posts, articles, and guides
- 500+ GitHub programs and open-source DevRel tools
- 40+ current job listings from companies like MongoDB, Tailscale, Stripe, Pinecone, and more
- Categorized resources with search and pagination

### Interactive Visualizations
- 30 visualization types including career paths, community graphs, skills matrices, and ecosystem maps
- Custom visualization builder for creating personalized dashboards
- Metrics tracking for DevRel performance and ROI

### DevRel Whitepaper
- Free downloadable comprehensive guide on Developer Relations
- Covers strategy, execution, and measuring impact

### Programs Directory
- Real-world DevRel programs from leading companies
- Community metrics and engagement strategies

## Tech Stack

- **Next.js 15** with App Router and API routes
- **React 18** with TypeScript
- **Tailwind CSS** with dark/light theme support
- **D3.js**, **Nivo**, and **Recharts** for data visualizations
- **Framer Motion** for animations

## Project Structure

```
devrelguide/
  frontend/
    src/
      app/                    # Next.js pages and API routes
        api/                  # 19 API routes (resources, jobs, visualizations)
      components/             # React components
        visualizations/       # 30 visualization components
        ui/                   # Shared UI components
        layout/               # Header, footer, navigation
      lib/                    # Utilities, data helpers, visualization generators
    data/                     # JSON data files (resources, jobs, visualizations)
    public/                   # Static assets and whitepaper
  scripts/                    # Offline Python scraping tools (optional)
```

## Getting Started

```bash
cd frontend
npm install      # or pnpm install
npm run dev      # Start development server at http://localhost:3000
```

No separate backend needed. All API routes run within Next.js.

### Build for Production

```bash
npm run build
npm run start
```

## API Routes

| Route | Description |
|-------|-------------|
| `GET /api/resources` | Combined blog posts, GitHub repos, and job listings |
| `GET /api/jobs` | DevRel job listings |
| `GET /api/visualizations/*` | Visualization data (metrics, career-path, community-graph, etc.) |
| `POST /api/generate-pdf` | Markdown to HTML conversion |
| `POST /api/analyze-data` | Resource data analysis |
| `POST /api/verify-links` | Link verification |
| `GET /api/healthz` | Health check |

## Pages

| Page | Description |
|------|-------------|
| `/` | Home page with hero, features overview |
| `/resources` | Resource library with blog posts, GitHub programs, job listings |
| `/visualizations` | 30 interactive DevRel visualizations |
| `/builder/*` | Custom visualization builders (community, ecosystem, journey, metrics, etc.) |
| `/whitepaper` | DevRel whitepaper download |
| `/programs` | Real-world DevRel programs directory |
| `/contact` | Consultation contact form |

## Data Sources

Resource data is stored as JSON files in `frontend/data/` and served via API routes. To refresh data from external sources, use the optional Python scraping scripts in `scripts/`:

```bash
cd scripts
pip install -r requirements.txt
python scraper/devrel_scraper.py
```

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to suggest improvements or report bugs.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
