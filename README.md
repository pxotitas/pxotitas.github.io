# pxdritz portfolio

Personal portfolio of Chloe (pxotitas), developer and artist. The interface follows the “Quiet character” reference in `context/`, including its typography, neutral palette, artwork treatments, motion, and responsive layout.

## Stack

- React 19 with TypeScript 6 and TSX
- Vite for development and production builds
- Tailwind CSS 4 design tokens alongside the original CSS system
- GitHub Pages deployment through GitHub Actions

## Development

```bash
npm ci
npm start
```

The Vite dev server is available at `http://localhost:5173/`.

## Build

```bash
npm run build
```

The build checks TypeScript, optimizes display copies of the artwork, and writes the static application to `dist/pxotitas-portfolio/browser`. The final step generates static SEO pages for `/about/`, `/projects/`, `/gallery/`, and `/contact/`, plus the sitemap. GitHub Pages publishes that browser directory.

## Source layout

- `src/App.tsx` contains the React interface and interactive components.
- `src/app/data/` contains typed artwork and project data.
- `src/styles.css` defines Tailwind tokens and the original visual system.
- `public/assets/` contains the original artwork, font, icons, and transparent spiral favicon.
- `context/` is the preserved design reference and source material.

## License

The source code is available under the [pxdritz attribution license](LICENSE). Reuse requires credit to **pxdritz1** and a link to [this repository](https://github.com/pxotitas/pxotitas.github.io). Artwork, media, third-party dependencies, and external services may have separate terms.
