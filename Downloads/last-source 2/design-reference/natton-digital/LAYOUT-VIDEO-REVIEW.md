# Natton website layout and hero film review

## Delivered

- BusinessOS: 58-second film in its solution hero.
- AgenticOS: 82-second film in its solution hero.
- AI Marketing Platforms: 84-second film in its solution hero.
- Full-width, uncropped 16:9 playback, native controls, posters and English caption tracks. Films wait for a visitor to play; audio starts muted. GrowthOS original media is retained.
- Shared bold, locally served display typography and centered section titles with their supporting introductions. Long body copy, cards and dashboard data retain their reading alignment.
- Overview and product feature titles moved above the content grids; equal-height capability and need cards.
- All 32 existing FAQ sections rebuilt with a dark gridded backdrop, contour linework, a numbered answer index, clear expanded states and a compact project/contact strip. Existing page-specific answers retained.
- AI Marketing SaaS dark-hero contrast corrected, including the headline, introduction, secondary link and reassurance text.
- Corrected the homepage strategy CTA and all eight product delivery-step contact buttons to the existing external contact destination, preventing links to a missing local contact page.
- Existing background animation assets and card hover transforms retained.

## Validation

The browser scan in `qa/layout-audit-20261106.json` checks every one of the 38 generated documents at 1360, 768 and 390 pixels: 114 route/width combinations. No horizontal document overflow, off-center section titles, unequal card rows, missing H1s or broken loaded images were detected. Card titles in directories are intentionally excluded from section-title centering. Lazy imagery is additionally covered by local asset checks.

Representative desktop and mobile layouts were visually inspected, and native FAQ expansion was exercised. All three delivery MP4s decoded completely without errors; browser metadata confirmed 1920×1080 H.264 video and their full duration.

## Design reference

The FAQ treatment draws on the dark, high-contrast hierarchy and clear accordion states in Debasish Biswal’s [FAQ Section – Web + Mobile UI](https://dribbble.com/shots/26208614-FAQ-Section-Web-Mobile-UI), with original Natton linework and layout. The Awwwards reference pages did not load through the research service; no claim of reviewing their inaccessible visuals is made.
