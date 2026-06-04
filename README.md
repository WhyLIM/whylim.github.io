# WhyLIM Personal Homepage

A modern, interactive personal homepage built with React, Vite, and Tailwind CSS.

![Project Preview](https://img.limina.top/temp/preview.png)

## Features

- Interactive map background showing visitor distance ([Leaflet](https://leafletjs.com/))
- Bento grid layout for profile, skills, and interests
- Smooth animations ([Framer Motion](https://www.framer.com/motion/))
- Dark/Light mode with system detection
- English/Chinese i18n support
- Responsive design
- All content configurable via `src/config.ts`

## Tech Stack

React · Vite · Tailwind CSS · Framer Motion · React Leaflet · Lucide React

## Quick Start

```bash
git clone https://github.com/WhyLIM/whylim-homepage.git
cd whylim-homepage
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Configuration

Edit `src/config.ts` to customize name, location, social links, bento cards, etc.

### Images

- **Public folder** (`public/`): Reference with `src="/my-image.png"`
- **Src assets** (`src/assets/`): Import and use in components

## Deployment

Push to `main` branch — GitHub Actions auto-deploys to GitHub Pages via the `gh-pages` branch.

For custom domains, keep `base: '/'` in `vite.config.ts` and configure your CNAME record.

## License

[MIT](LICENSE)
