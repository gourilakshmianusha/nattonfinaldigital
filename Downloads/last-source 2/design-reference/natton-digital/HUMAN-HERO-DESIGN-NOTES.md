# Service-page human scenes and contextual illustrations

This edition replaces the abstract glass-object heroes with people performing recognisable tasks. Original service copy and section order remain in `src/services/page-copy.json`. The images are illustrative generated scenes, and the interface overlays are examples. Basil House is an illustrative restaurant, not a client claim.

## References reviewed

- [Hero Collective on Awwwards](https://www.awwwards.com/sites/hero-collective): photographic storytelling and a clear hierarchy between large type, imagery and interaction.
- [BRIEF — Digital Agency Hero on Dribbble](https://dribbble.com/shots/24846054-BRIEF-Digital-Agency-Hero): a composed hero with distinct foreground and background roles.
- [Digital Marketing Agency Hero on Dribbble](https://dribbble.com/shots/25295052-Hero-Section-for-Digital-Marketing-Agency): service positioning expressed through the first screen.

Reference pages were used for design study; no reference artwork is included in the site.

## Applied direction

- Google Business Profile: a customer searches for `best restaurant near me`, a phone UI reveals restaurant details, and the physical restaurant appears in the scene.
- Social: people share a phone while Instagram, Facebook, X, Reddit, Threads and LinkedIn connect to the device.
- SEO and paid search: a person uses a laptop, with a legible Google search or advertising example layered into the scene.
- Website development and ecommerce: people work on the website or fulfil an order, with responsive browser or store previews.
- Content, design, email, analytics and AI growth: editorial work, print samples, follow-up, customer journeys and team review are shown with relevant human scenes.

The cards choose miniature search results, page editors, enquiries, calendars, review conversations, source checks, brand samples or customer actions from their meaning. Repeated atom/orbit and bar-chart decoration has been removed from service cards.

## Brand assets

Google wordmark: downloaded from Google's published `https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png`. Platform glyphs: Font Awesome Free Brands 7.3.1. SVG paths retain their shapes. Attribution and licence are in `public/media/brands/`. Brand names identify the illustrated platforms and do not indicate endorsement.

## Editing

`src/services/HumanServiceHero.jsx` defines story overlays; `ServiceVisual.jsx` selects contextual card illustrations. `realism.css` holds the presentation. New photos are in `public/media/services/people/`; each has a responsive 960-pixel variant. Full generation prompts and image descriptions are in `HUMAN-HERO-ARTWORK.json`.
