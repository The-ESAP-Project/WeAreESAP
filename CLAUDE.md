# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WeAreESAP (向那卫星许愿) is a monorepo containing two Next.js websites for a sci-fi worldbuilding project about androids and humans:

- **`weare-website/`** — Character archive, timeline, tech docs, and relationship graphs (https://weare.esaps.net)
- **`story-website/`** — Interactive sci-fi story reading platform (https://story.esaps.net)

The two sites share a similar tech stack and patterns but are fully independent projects with separate dependencies.

## weare-website

All commands run from `weare-website/`. Uses **bun** as package manager (bun.lock present). Note: the `dev` script internally calls `pnpm run prebuild`, so **pnpm must also be installed**.

```bash
bun dev                   # Prebuild + start dev server (http://localhost:3000)
bun run build             # Production build (runs prebuild + postbuild sitemap)
bun run lint              # Biome check
bun run lint:fix          # Biome check --fix
bun run format            # Biome format --write
bun run test:unit         # Vitest (watch mode)
bun run test:unit:run     # Vitest (CI mode, single run)
bun run test:unit:coverage # Vitest with coverage report
bun run test:e2e          # Build + Playwright E2E tests
bun run test:e2e:ui       # Build + Playwright with UI
bun run test:e2e:debug    # Build + Playwright debug mode
bun run analyze           # Bundle analysis
bun run blur:generate     # Regenerate blur placeholders for images
bun run sitemap:generate  # Regenerate sitemap
```

Run a single unit test: `bun vitest run lib/__tests__/path/to/test.ts`

### Tech Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- next-intl v4 for i18n (zh-CN default, en, ja)
- ReactFlow + ELK for character relationship graphs
- Fuse.js for client-side search
- Framer Motion for animations
- Biome for linting/formatting
- Vitest (unit) + Playwright (E2E, Chromium + Firefox + Mobile Chrome)

### Architecture

**Locale routing**: All pages under `app/[locale]/`. URL structure: `/` (zh-CN), `/en/`, `/ja/`.

**Data loading**: JSON files in `data/` loaded via `lib/data-loader.ts`. Missing locales fall back to zh-CN. Character data uses a shared + locale split: `data/characters/{locale}/` for localized bios, `data/characters/relations/` for relationship definitions.

**Character relations**: `lib/relationship-parser.ts` parses relation JSON; `lib/graph-layout.ts` runs the ELK auto-layout algorithm.

**Prebuild steps**: `scripts/generate-blur-placeholders.mjs` generates base64 blur placeholders for images; `scripts/generate-build-info.mjs` writes build metadata. Both run before `next dev` and `next build`.

**Build output**: `standalone` mode for Docker deployment. Post-build generates sitemap via next-sitemap.

**Unit tests**: `lib/__tests__/` directory.

**SVG icons**: Use `components/ui/Icon.tsx` instead of inline SVGs or direct icon imports.

## story-website

All commands run from `story-website/`. Uses **bun** as package manager.

```bash
bun dev              # Prebuild + start dev server
bun run build        # Production build
bun run lint         # Biome check
bun run lint:fix     # Biome check --fix
bun run format       # Biome format --write
bun run test:unit    # Vitest (watch mode)
bun run test:unit:run # Vitest (CI mode, single run)
```

### Tech Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- next-intl v4, next-themes, Framer Motion
- Biome for linting/formatting
- Vitest for unit tests (no E2E tests)

### Architecture

**Pages**: `app/[locale]/stories/[slug]/` for story detail, `app/[locale]/stories/[slug]/[chapterId]/` for chapter reader, `app/[locale]/stories/[slug]/explore/[sceneId]/` for interactive exploration mode.

**Story data**: JSON files in `data/stories/`. Loaded via `lib/story-loader.ts` and `lib/data-loader.ts`.

**Interactive features**: `lib/branch-resolver.ts` handles branching narrative logic; `lib/unlock-engine.ts` manages chapter unlock conditions; `lib/exploration.ts` and `lib/interactive.ts` power the scene exploration system.

**Reading state**: `lib/reading-state.ts` persists reader progress (likely localStorage-based).

**SVG icons**: Use `components/ui/Icon.tsx` instead of inline SVGs or direct icon imports.
