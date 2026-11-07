# Scroll performance and build cleanup

The site has four direct packages: React, React DOM, Lucide React and Vite. All are used. `npm ls --depth=0` and an offline prune found no extraneous direct packages. No npm cache or node_modules directory was part of the deployed static site. Clearing a development download cache does not improve visitor scroll rendering.

## Changes

- The initial JavaScript entry decreased from 603,346 to 242,714 bytes (60%). Service, solution and industry page rendering now loads as a separate collection chunk. The server still renders all 53 documents and their route-specific styles before hydration.
- The original homepage cinema now requests frames only on scroll, resize, image arrival or while its interpolation is settling. It leaves no perpetual requestAnimationFrame callback at rest and stops offscreen/hidden. Its decoded image cache limit changes from 38 to 18 desktop frames and 22 to 10 mobile frames, with four concurrent image loads instead of six. The original 194 image assets, camera mapping, colors and canvas pixel ratio remain unchanged.
- A shared IntersectionObserver pauses decorative CSS loops outside a 100px viewport margin. It also handles lazy-mounted sections, document visibility and removed-node cleanup. It preserves section dimensions and does not introduce content-visibility placeholders or scroll-jacking.
- Live backdrop blur is removed from sticky/large cards, navigation and opaque FAQ panels; existing gradients, rims, hover colors, photos and background artwork remain.
- Solution card scaling batches layout reads before style writes, skips unchanged values and sleeps when its section is offscreen. Mobile layouts avoid this unnecessary scroll handler. The product section navigation reads its threshold once per frame and updates classes only when its active section changes.
- The unused prototype hub is excluded from client/server page globs.
- Public media is no longer copied into the intermediate SSR directory: that output decreased from about 60MB to 1.9MB. A prebuild clean removes reproducible output to prevent stale pages and QA files surviving successive builds. The local Vite cache was cleared; package versions were retained. Tool caches/logs are explicitly ignored.

## Verification

Production build and all eight verification scripts pass. Checks cover 53 documents, all local route/asset/anchor links, one H1 per page, 39 FAQ sections, 211 answers, 439 approved solution strings, 980 original service strings, eight product interfaces and the unchanged homepage image/video assets.

Nine performance regression cases verify idle scheduling, settling, deduplication, offscreen cancellation, resume, unmount, image-arrival updates, initial bundle budget, SSR media duplication and exclusion of QA/cache from deployment. Browser checks cover the preserved homepage cinema, representative product/service routes, cards, and mobile video expansion/pause/five-second seek with no horizontal overflow.

Recorded DOM/CSS workload observations are in qa/scroll-workload-20261106.json. At matching preview-page tops: homepage offscreen running animations changed from 9 to 0; AI Agents from 9 to 0. AI Agents backdrop blur surfaces changed from 21 to 0; BusinessOS from 26 to 2 (its initial Play treatment remains). These are rendering-work observations, not a target-device FPS benchmark. No universal frame-rate or measured device latency claim is made.
