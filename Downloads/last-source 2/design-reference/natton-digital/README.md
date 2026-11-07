# Natton Digital — Homepage and connected pages

A React + Vite website preview with the redesigned homepage, 13 service pages, eight product-platform pages, four product-bundle pages and six industry pages.

The original homepage hero component, CSS, canvas controller and image sequence are preserved. The work begins below that hero. The same brand navigation and footer frame the connected pages without replacing their approved content, colour themes or demonstrations.

## Run in VS Code

Use Node.js 22.18+ or a compatible current LTS release. Open this folder and run:

```sh
npm install
npm run dev
```

For a production build:

```sh
npm run build
node scripts/verify-homepage.mjs
node scripts/verify-service-copy.mjs
node scripts/verify-product-interfaces.mjs
npm run preview
```

## Routes

- `/`: homepage, including the unchanged hero.
- `/services/`: the 13 service pages.
- `/products/platforms/`: the eight products in the supplied menu.
- `/products/`: the four tailored bundle pages.
- `/industries/`: the six industry pages.
- `/page-collection/`: the earlier product and industry review collection.

The original hero's consultation action points to the existing Natton contact route through its original callback. The process action jumps to the homepage process section. New contact links use the existing Natton Digital contact page; this preview does not add a form backend.

## Main files

- `src/homepage/HomePage.jsx`: homepage body, shared navigation/footer, outcome/client marquees, tools, search and process interactions.
- `src/homepage/homepage.css`: existing shared shell styling.
- `src/homepage/homepage-redesign.css`: homepage-only manager-review redesign.
- `src/homepage/WorkExamples.jsx`: illustrative CRM, campaign, task and customer examples.
- `src/homepage/home-data.json`: current menu links.
- `src/homepage/home-themes.js`: destination colour mapping for cards and menu items.
- `src/homepage/original/`: unchanged hero source. Keep these files intact while the hero is deferred.
- `HOMEPAGE-HERO-PRESERVATION.json`: hashes for the original hero sources and assets.
- `HOMEPAGE-REVIEW.json`: browser and preservation checks.
- `HOMEPAGE-DESIGN-NOTES.md`: reference interpretation and implementation decisions.

## Integration

The homepage uses the original logo, an Inter-based type stack and a consistent off-white foundation. Each offering previews the colour family of its destination. Straight, stacked outcome marquees sit after How we work; a separate section lists service and solution tools with logos and no links. Our Clientele uses all eight source logos in a compact marquee. The approved Why choose us content is restored. CSS transforms, pause, visibility and reduced-motion handling do not need another animation library.

`SharedSiteFrame` provides the same header and footer around body-only detail pages. If integrating into the full original site, retain one global header/footer rather than rendering both shells. `HomePage` contains the unchanged hero; the body starts at `homepage-body`.

Copy the included public assets with their directory paths. New body photographs are existing compressed WebP images and load lazily. Client logos come from the supplied website source. Interface examples use dummy content and do not call external APIs, send messages or execute an agent.

Set `VITE_SITE_URL` before building for the final production origin. Keep the SSR page-module registration and per-route stylesheet handling in the existing build scripts so the initial HTML is complete and styled.

The original full website archive and the earlier standalone downloads are not overwritten by this package.

## Homepage manager-review redesign

The homepage body uses stronger navy/teal typography, deliberate service/product accents, compact marquees and smaller tool tiles. Decorative icon diagrams are replaced by labelled example workspaces and customer records. The sales-pipeline button moves a fictitious lead into follow-up; process tabs show example briefs, scopes, launch checks and review notes. These are browser-local demonstrations and do not operate a CRM or call any external API. A new generated illustrative CRM office scene is provided as 960px/1280px WebP variants; the rest of the photography is reused. Original hero hashes and all connected detail content remain checked.
