# Natton Digital — complete source, published version 30

This package contains the complete React + Vite website source from commit
`1124de2e9ac3ffcf7384bc710c3b961816c0c796`, including all website images, fonts,
logos, animation frames, video files and captions. These notes describe the
current version; README.md also contains historical implementation notes.

## Open and run locally

1. Extract the ZIP completely.
2. Open the extracted `natton-digital` folder in VS Code. This is the folder containing package.json.
3. Install Node.js 24, or use Node.js 22.12 or later. The installed Vite version requires Node ^20.19.0 or >=22.12.0.
4. In VS Code, choose Terminal → New Terminal and run:

```sh
npm ci
npm run dev
```

Open the localhost address printed in the terminal, normally http://localhost:5173/.
Keep the terminal running while you work. Stop the server with Ctrl+C.

## Create and preview the production build

```sh
npm run build
npm run preview
```

Open the preview address printed in the terminal. The production output is `dist/`.
The prebuild step clears only reproducible output (`dist/` and `.ssr-build/`).
The build then creates server-rendered HTML for 53 documents, route metadata,
styles, robots.txt and sitemap.xml. Do not remove the SSR build or prerender step.
Do not open index.html directly with a file:// URL; use the commands above.

For a static host such as Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- Set `VITE_SITE_URL` in the build environment to your final HTTPS website origin
  before building, so canonical URLs, social metadata and the sitemap use the right domain.

`.openai/hosting.json` identifies the existing Natton Site. Review that configuration
before publishing this source as a different Site.

## Included page families

- Homepage and shared navigation/footer
- 13 service detail pages
- Eight product-platform detail pages
- GrowthOS, BusinessOS, AgenticOS and AI Marketing Platforms solution pages
- Six industry detail pages
- About Us, Contact and consultation request pages
- Resources hub, Free Growth Tools, six-step AI readiness assessment, ROI calculators
- Blog index and four complete guides
- Solution comparison, delivery process and privacy information
- Directory pages and the 404 document

## Where to edit

- `src/homepage/`: homepage, shared header/footer and menu content
- `src/services/`: service page content, templates and styling
- `src/product-platforms/`: the eight product-platform pages and demonstrations
- `src/solutions/`: solution pages, video hero player and workflow examples
- `src/data/`: approved solution and industry content
- `src/resources/`: company pages, forms, articles, calculators and assessment
- `src/performance/`: viewport animation pausing, frame scheduling and scroll optimizations
- `public/`: all images, fonts, logos, video files, captions and homepage animation frames
- `scripts/`: build, prerendering and verification scripts

Keep the `public/` paths intact when moving the code; the website uses those exact asset URLs.

## Current behavior

Videos show a poster, headline and prominent Play button. Clicking moves the text above
and starts the full-width film. Five-second rewind/forward and native video controls remain.
The homepage animation retains its original image sequence and renders only when needed.
Offscreen decorative animations pause. The initial JavaScript entry was reduced by about 60%.

The enquiry form validates the details and prepares an email or WhatsApp message.
The visitor reviews and sends in their chosen app. It does not store submissions in a website
inbox or confirm a consultation booking automatically. No backend credentials are required.
The calculators, assessment and interface demonstrations work locally in the browser.

## Verification

The published source passed the production build and these checks:

```sh
node scripts/verify-scroll-performance.mjs
node scripts/verify-homepage.mjs
node scripts/verify-solutions.mjs
node scripts/verify-service-copy.mjs
node scripts/verify-product-interfaces.mjs
node scripts/verify-resources.mjs
python scripts/verify-layout-video.py
python scripts/validate-static.py
```

Run `npm run build` first. The last two checks require Python 3.

`PERFORMANCE-REVIEW.md` explains the scroll optimizations.
`RESTORATION-REVIEW.md` explains the restored pages and enquiry form behavior.

## Package contents

This is source plus all website media. Dependencies are reproduced from package-lock.json
with `npm ci`. node_modules, npm/Vite caches, Git history, intermediate SSR output and compiled
dist output are deliberately excluded. The original video-production projects and unrelated
workspace files are not needed to run the website and are not included.
