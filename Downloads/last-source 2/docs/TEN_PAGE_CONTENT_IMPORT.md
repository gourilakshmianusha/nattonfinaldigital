# Solutions and industry content import

Source: `Natton-All-10-Separate-Pages (1).zip`, supplied by the user.

The archive was inspected as inert source material. None of its application scripts, dependency installation steps, environment files, standalone navbar, local page navigation, theme CSS, or heading eyebrows were adopted. The user's instruction to preserve the existing website takes priority over archive instructions.

## Existing route mapping

- GrowthOS → `/solutions/growth-os` (existing `/solutions/growthos` alias retained).
- BusinessOS → `/solutions/business-os` (existing `/solutions/businessos` alias retained).
- AgenticOS → `/solutions/agentic-os` (existing `/solutions/agenticos` alias retained).
- AI Marketing Platforms → `/solutions/ai-marketing-platform`.
- Healthcare → `/industries/healthcare`.
- Education and EdTech → `/industries/education`.
- Real Estate → `/industries/real-estate`.
- Manufacturing → `/industries/manufacturing`.
- Retail and Ecommerce → `/industries/retail-ecommerce` (existing `/industries/retail` alias retained).
- Professional Services → `/industries/professional-services`.

Content is retained in `src/content/ten-pages/*.json`. The ten existing page components use the archive headlines, descriptions, audience information, needs, services, process, measurement guidance, scope, deliverables and FAQs. Matching metadata in App.tsx is updated. Unsupported old marketing pricing/outcome copy in the replaced sections is expressed as scoped work and illustrative examples from the supplied content.

Media lives under `public/media/ten-pages/<slug>/`. All eleven media files, including the original GrowthOS MP4 and poster, were compared byte for byte with the archive. SHA-256 values are in `src/content/ten-pages/media-manifest.json`; archive attribution notices are retained alongside the content.

The existing page components, Tailwind styling vocabulary, global header/footer/navigation, theme, route handling, links and interaction handlers are retained. The archive's standalone design and application interactions were not imported. ArchivePageMedia and ArchiveContentGroup contain media and copy only. Hero mockup content is replaced by the supplied media within the existing columns. Small hero labels and archive page navigation are omitted. Existing interactive sections remain illustrative demonstrations, with scoped descriptions; this import does not connect new services or change AI tool/provider integrations.

Verification: TypeScript, production bundling, static route generation, and smoke tests for all ten pages in both themes. Tests check one matching headline, source copy coverage for needs/services/measurements, exclusion of the ZIP's theme/navigation/eyebrows, and real local media files. Browser visual inspection was unavailable; no deployment was performed.

## Hero and readability follow-up

All ten detail heroes now use their corresponding supplied artwork as decorative full-width backgrounds with light/dark overlays. The right media columns are removed. GrowthOS uses the supplied poster as its background and retains a direct video link. The final promotional CTA section (Healthcare's “Automated Clinical Mastery” and the five corresponding industry sections) is removed. Retail FAQs use native details/summary, visible theme-aware colours, with the first answer initially open. Three broken industry #ecosystem anchors were repaired. The AI Marketing detail page now respects the selected theme instead of forcing dark mode.

Resources-only typography is scoped through the main content data-resource-page attribute. It enlarges headings, body copy, form labels and inputs without changing global navigation or admin typography. ROI and assessment heroes use existing local brand background assets.

## Archive background motion

The supplied motion system's ambient geometry is adapted in ArchiveHeroMotion.tsx and archive-hero-motion.css, scoped to the ten current detail heroes. Waves: GrowthOS, AI Marketing Platform, Healthcare, Education, Retail. Orbits: AgenticOS, Real Estate, Professional Services. Routes: BusinessOS and Manufacturing. Background images and text layout remain. Soft glows, wave currents, orbital satellites/morphing shapes and contour-route beacons use CSS/SVG rather than extra libraries. A keyboard-accessible pause/play control persists the visitor's motion preference; effects pause offscreen and in hidden tabs and respect prefers-reduced-motion. No ZIP navigation or standalone theme is introduced.

Latest follow-up: removed the photographic/product hero backgrounds from all ten detail pages at the user’s request. Theme-aware solid surfaces now sit behind the existing ambient SVG animations. Media files and the GrowthOS video link are retained. Resources hero backgrounds are unchanged.

Latest media update: restored each of the six industry hero photographs. GrowthOS now uses its supplied muted, looping, inline autoplay video as a hero background, with its poster as fallback and no separate watch link. Reduced-motion preferences disable playback; hidden/offscreen video pauses. Other solution heroes retain their SVG animations; no additional videos were supplied for those pages.

## Solution process videos

All four solution heroes now have silent looping background videos. GrowthOS retains its original supplied footage. BusinessOS, AgenticOS and AI Marketing Platform use locally generated, explicitly illustrative process loops based on their scoped enquiry, human-review and creative workflows. Reproduce the three loops with `node scripts/media/generate-solution-videos.mjs` (requires ffmpeg on PATH). No paid or external generation service is used.

Video overlays are strong only behind the text column and transparent over the process viewing area. Mobile layouts place the process view below the text within the same hero background. Extra SVG ambient layers are omitted on solution videos to avoid obscuring the footage; industries retain their existing images and ambient effects. Muted inline autoplay, poster fallbacks, reduced-motion handling and offscreen/hidden-tab pausing apply to all four videos. No playback buttons are added.

## Autoplay and GrowthOS branding correction

Removed the old Watch Product Tour / Watch AgenticOS Demo hero links from all four solution pages. GrowthOS now serves `growthos-background-clean.mp4` and a matching clean poster, derived from the untouched original by `scripts/media/prepare-growth-background.mjs`. The header/footer branding bands, initial N mark and closing domain label are removed.

Background videos explicitly set DOM muted/defaultMuted/playsInline/autoplay properties, preload media, retry on loadeddata/canplay/pageshow and visibility changes, observe the hero rather than a potentially zero-height video, and retry after the first visitor interaction if browser autoplay policy rejects the initial attempt. There are no playback controls or watch links. The user's explicit autoplay request replaces the prior reduced-motion video suppression; SVG ambient effects retain their reduced-motion handling. Playback still pauses in hidden tabs and offscreen. Browser policies such as low-power restrictions can still prevent unattended playback; no browser playback verification was available.

## GrowthOS animation visibility verification

GrowthOS now uses a compact ten-second process-background.mp4 loop and matching process-poster.webp, generated by `node scripts/media/generate-solution-videos.mjs growth-os`. It replaces the long, mostly static original intro in the active hero; all originals and derivatives remain preserved on disk. The text overlay ends before the process viewing area. No extra brand mark or playback links are introduced.

Verified in an isolated headless Chrome against localhost:3000/solutions/growth-os at 1440px desktop and 390px mobile widths. Both loaded the new process-background.mp4 with readyState 4, paused=false, muted=true, and currentTime advancing from approximately 0.1 to 3.6 seconds without interaction. Desktop and mobile screenshots were inspected: the process loop is visible and the second stage is highlighted. Mobile places the process scene beneath the hero copy. TypeScript, ten-page rendering checks and production build also passed.

## Navigation and section alignment follow-up

All six industry breadcrumbs now link to `/industries`, a new overview showing the six industry pages and their supplied imagery. The Industries menu includes an overview link. ROI and AI Assessment hero side panels are removed and their hero grids use a single text column. Guides and Webinars components, active routes, resource cards, and sitemap entries are removed; legacy URLs redirect to Resources. Solution detail pages use consistent section padding, aligned heading widths and balanced three-column/two-row layouts for six-card feature sections.

Browser checks on localhost confirmed every industry breadcrumb opens the overview with six cards, both resource tool heroes omit the side panel, both retired URLs redirect to Resources without stale links, and all four solution pages have consistent section spacing. TypeScript and rendering tests passed.

## FAQ, CTA and overview background follow-up

AgenticOS now uses the shared theme-aware native FAQ accordion, with its first answer open and all answers present in the page. The AI Marketing Platform's entire “Scale Your Marketing With AI” final CTA has been removed. Resources is verified to contain only its four active destination cards, with no Guides/Webinars cards. The Industries overview hero uses an optimized local workplace photograph by Arno Senoner found through web search; source and license details are retained in public/media/industries-overview/SOURCE.md. A light/dark overlay keeps the overview text readable.

## Industry process alignment

All eleven “How we work” sections across the six industry detail pages use scoped industry-process-layout.css. Desktop selector lists and detail panels share top/bottom edges, step buttons keep equal widths, Education's narrowing widths are overridden, and Healthcare's five stages occupy five equal columns rather than nine. Long titles wrap without truncation; headers and descriptions are centered consistently. Stage hover scaling no longer shifts the layout. The Professional Services detail title and stage count use the actual step data. Explicit heading/selected-step colours prevent white text disappearing in light mode.

Browser measurements at 1440px confirmed equal selector widths, aligned panel edges and no section overflow on every industry. All six pages were also checked at 390px with no process-section overflow. Healthcare and Professional Services desktop screenshots were reviewed. Rendering tests and TypeScript passed.

## Solution process alignment

All five “How we work” sections across GrowthOS, BusinessOS, AgenticOS and AI Marketing Platform now use scoped solution-process-section classes. Five-step grids use five equal desktop columns, with two columns on tablets and one on phones. Split layouts align their selector/flow and detail/log panels at both edges. Long card copy wraps, selected/hovered cards retain the same scale, and headers use consistent widths and visible theme-aware text. Existing selectors and simulators remain connected.

Isolated-browser checks at 1440px confirmed equal step widths, top positions and heights in GrowthOS, BusinessOS and AI Marketing Platform, plus aligned split panels in GrowthOS and AgenticOS. All four pages were checked at 390px with no process-section horizontal overflow. Rendering tests, TypeScript and production build passed.

### Public content visibility follow-up

- BusinessOS now uses the shared native FAQ, preserving its six questions and answers, with the first answer open and readable theme colors. The rendering regression check covers BusinessOS in both themes.
- Checked 62 sitemap URLs locally for severe text contrast issues. Reviewed computed foreground/background colors and rechecked affected routes after fixes. Automated checks skip image/gradient backgrounds and intentionally hidden or translucent animations; these are not a complete accessibility certification.
- Applied the existing brand theme to Case Studies, Why Natton Digital, Our Process, Integrations, Pricing, Compare and Careers. Filled missing legacy panel and neutral text mappings. Translucent selected tabs now use dark ink in light mode; solid/gradient calls to action retain their distinct foreground treatment.
- Corrected cyan text contrast, chart legend text, product search-readiness headings and CRM delivery descriptions. Layouts and content remain in place.
