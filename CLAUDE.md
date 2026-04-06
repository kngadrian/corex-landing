# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS sales funnel for ClawBrand AI (CoreX product). No build system, no package.json, no JavaScript framework. Each page is a self-contained landing page deployed to Vercel.

## Deployment

- **Platform:** Vercel via GitHub Actions (`.github/workflows/deploy-vercel.yml`)
- **Trigger:** Push to `master` or `main`, or manual workflow dispatch
- **Secrets:** `VERCEL_TOKEN`, `VERCEL_TEAM_ID`, `VERCEL_PROJECT_ID` (GitHub Actions secrets)
- There is no build step — files are served as-is

## Architecture

### Page Structure

Each subdirectory is a standalone landing page with its own `index.html` and `styles.css`:

| Directory       | Purpose                              |
|-----------------|--------------------------------------|
| `/` (root)      | Coming soon / launch announcement    |
| `/special/`     | Main product sales page              |
| `/professional/`| OTO #1 — PRO upgrade ($97)           |
| `/bundle/`      | OTO #2 — All-in-one bundle ($297)    |
| `/club/`        | OTO #3 — Template Club subscription  |
| `/agency/`      | OTO #4 — Agency mode ($197)          |
| `/reseller/`    | OTO #5 — Reseller rights             |
| `/partners/`    | Affiliate program signup             |
| `/prelaunch/`   | Webinar registration page            |

Pages share **no common stylesheet or template** — each is fully independent. When making cross-page changes (e.g., updating the logo, nav, or footer), you must edit each page individually.

### Shared Assets

- `/images/` — Global image assets (logos, agent images, backgrounds)
- Root SVG files — Logo variants (`corex-logo.svg`, `corex-logo-white.svg`)

## Tech Stack

- **HTML5 / CSS3** — No preprocessors
- **Vanilla JavaScript** — Inline `<script>` blocks for countdown timers, Intersection Observer animations, video sound toggles
- **CDN dependencies:** Google Fonts (Inter, Libre Baskerville), Tabler Icons (`@tabler/icons-webfont`), Bootstrap 5.3.0 (some pages)
- **Video:** Vimeo embeds with custom sound toggle overlay

## Styling Conventions

- **Primary CTA gradient:** `linear-gradient(90deg, #df4ea6, #fbe364)` (pink → yellow)
- **Secondary gradient:** `linear-gradient(90deg, #4f46e5, #2563eb)` (purple → blue)
- **Typography:** Inter (body), Libre Baskerville (serif accents/italics)
- **Fluid sizing:** `clamp()` for responsive headings
- **Responsive breakpoints:** 1100px, 992px, 768px
- CSS custom properties defined per-page in `:root`
- Page-specific class prefixes: `.oto_` (professional), `.bnd_` (bundle), `.ag_` (agency), `.cl_` (club), `.rs_` (reseller)

## Common Page Patterns

Each OTO page follows a consistent structure: alert bar with countdown → nav with logo + CTA → hero with video + headline → feature sections → pricing → trust badges (guarantee, rating) → footer. Countdown timers use `sessionStorage` to persist across page reloads within a session.
