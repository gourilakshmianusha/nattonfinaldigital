# Product interface artwork

This edition updates the eight products in the supplied menu. It retains the existing page copy, original seven style sheets, glass surfaces, colour variables, feature demonstrations and interaction controllers. The four earlier bundle pages, industries and services remain unchanged.

## Hero mapping

| Product | Interface story |
| --- | --- |
| AI Marketing SaaS | A project brief, document draft, editorial comment and approval checks |
| CRM & AI Automation SaaS | A four-stage opportunity board with dummy deal values, owners and follow-up tasks |
| Conversational AI Hub | A shared inbox with channel marks, conversation history and a named team handover |
| WhatsApp Automation | A template editor beside the customer message and reply preview |
| AI Calling Agents | A scripted voice-console excerpt with waveform, transcript and handover context |
| Cloud Telephony Platform | An IVR route with Sales, Support and Bookings queues and sample call records |
| RCS Messaging Platform | A rich-card campaign builder with product media, suggested actions and fallback checks |
| AI Agents & Automation | A connected node editor with input data, structured output, execution log and human approval |

These are live HTML/SVG interface illustrations with clearly marked dummy data. They are not screenshots of a deployed Natton platform, client results, live calls or real customer records. No backend, messaging or AI API is called by a hero.

## Card artwork

64 capability illustrations are selected from their heading: pipeline movement, voice signals, routing, messages, review checks, records, calendars, sources, drafts, forms, rich cards and reporting. Existing card links, carousel controls, swipe behaviour, delivery tabs and page-motion controls are retained. New artwork animates while visible and follows the existing pause control and reduced-motion preference.

## Technical references reviewed

- n8n execution views: https://docs.n8n.io/build/understand-workflows/understand-executions/view-executions-for-a-single-workflow.md
- n8n AI agent documentation: https://docs.n8n.io/
- Google RCS rich cards: https://developers.google.com/business-communications/rcs-business-messaging/guides/learn/rich-cards

The references inform interface concepts such as execution status, connected tools, message suggestions and capability checks. The artwork is an original, simplified composition, not a copy of a vendor interface. Platform glyphs retain the canonical local assets and licences already included in `public/media/brands/`.

## Page weight

Product pages are separate JavaScript chunks, and their styles load only on the product-platform routes. The new heroes use HTML/CSS/SVG rather than large background videos or generated screenshots. No new font, animation framework, 3D runtime or remote-media dependency is introduced. The existing Lucide icons used by the supplied delivery and search-readiness components are tree-shaken. Browser checks cover all eight pages at phone, tablet and desktop widths.
