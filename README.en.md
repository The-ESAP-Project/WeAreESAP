# We Are ESAP

> **向那卫星许愿**

**English** | **[中文](README.md)**

---

## About

**The ESAP Project** is a sci-fi worldbuilding project about androids and humans coexisting in a future shaped by feedscatteron particles, fluid titanium, and the search for what it means to exist.

In this world: feedscatteron particles redefined computation, fluid titanium sustains consciousness, and data towers hold the memories of everyone connected. 1547, 1548, 1549 — three consecutive numbers, each independent, yet standing side by side.

**Visit**: [weare.esaps.net](https://weare.esaps.net)

### What's on the Site

- **Character Profiles** — 14 members with full bios, personalities, stories, and a relationship graph
- **Timeline** — 2021–2026, from "the beginning" to "we" to "building the skeleton"
- **Tech Lore** — Feedscatteron particles, fluid titanium, data towers, energy systems, orbital infrastructure, and more (10 modules)
- **Organizations** — ESAP Core, Carbon-Based Club, PASE, BEU, Polaris Squad, and more (6 orgs)
- **Trilingual** — Simplified Chinese (default), English, Japanese

### Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://motion.dev/) |
| i18n | [next-intl](https://next-intl.dev/) |
| Data Visualization | [ReactFlow](https://reactflow.dev/) + [ELK](https://github.com/kieler/elkjs) (character relationship graphs) |
| Testing | [Vitest](https://vitest.dev/) (unit), [Playwright](https://playwright.dev/) (E2E) |
| Data | JSON-driven content, organized by locale |

### Local Development

Requires Node.js >= 18.17 and [pnpm](https://pnpm.sh/).

```bash
git clone https://github.com/The-ESAP-Project/WeAreESAP.git
cd WeAreESAP/weare-website

pnpm install
pnpm dev              # Dev server → http://localhost:3000
pnpm run build        # Production build
pnpm run test:unit    # Unit tests
pnpm run test:e2e     # E2E tests
```

### Project Structure

```
WeAreESAP/
├── weare-website/            # Next.js project
│   ├── app/[locale]/         # Pages (locale-based routing)
│   ├── components/           # React components (feature-based)
│   ├── data/
│   │   ├── characters/       # Character data (zh-CN / en / ja)
│   │   ├── timeline/         # Timeline events
│   │   ├── tech/             # Tech lore
│   │   └── organizations/    # Organization profiles
│   ├── messages/             # UI translations (next-intl)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and data loaders
│   ├── types/                # TypeScript type definitions
│   └── public/               # Static assets
├── docs/                     # Worldbuilding documents
├── CONTRIBUTING.md           # Contribution guide
└── LICENSE                   # Apache 2.0
```

### Contributing

We welcome contributions of all kinds — character designs, code, translations, documentation.

- Submit character proposals or report issues: [Issues](https://github.com/The-ESAP-Project/WeAreESAP/issues/new/choose)
- Code and content: Fork → Branch → PR
- Full guide: [CONTRIBUTING.md](CONTRIBUTING.md)

### License

Code is licensed under **[Apache License 2.0](LICENSE)**.

Worldbuilding and character content is licensed under **[CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)**.

---

<div align="center">

*"There were no stars in the sky, so we made one."*

**The ESAP Project** | [weare.esaps.net](https://weare.esaps.net)

© 2021–2026 AptS:1547, AptS:1548, and contributors

</div>
