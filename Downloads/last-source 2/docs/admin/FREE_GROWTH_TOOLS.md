# Free Growth Tools implementation

Implemented in the local Natton Digital checkout on 2 November 2026. The existing React/Vite/Express app, Supabase authentication, main navigation, logo, footer, AI product destinations, and provider connection records are retained. No new hosting project, paid service, API subscription, OAuth consent, email send, call, or production deployment was created.

## Public routes and behaviour

- `/free-tools`: nine database-backed cards, featured tools, categories, search, status, and query-based detail views (`?tool=lead_value`, for example).
- `/roi-calculator`: eight selectable calculators. WhatsApp reuses the same `whatsapp_roi` engine as the free hub; there are 16 distinct system IDs rather than two inconsistent WhatsApp implementations.
- `/ai-readiness-assessment`: six-stage survey, explicit N/A handling, shared scoring engine, progress, previous/next navigation, optional device-local draft save/restore, and saved results.

The nine free tool IDs are `ai_readiness`, `website_grader`, `seo_aeo_audit`, `crm_score`, `roi_calculator`, `whatsapp_roi`, `ai_agent_cost`, `lead_value`, and `marketing_budget`.

The eight ROI experiences are `revenue_growth`, `marketing_roi`, `automation_savings`, `ai_employee_savings`, `whatsapp_roi`, `ai_calling_roi`, `sales_productivity`, and `support_savings`.

Prefilled forecast inputs are illustrative defaults, not measured customer data. Every run requires an explicit Calculate/Analyze action. Questionnaire answers initially remain unanswered. Results include input snapshots, source type, assumptions, warnings, recommendations, methodology version, request ID and timestamp. Financial calculations retain negative values and distinguish revenue, contribution, ROI, ROAS and unavailable denominators. Currency labels do not imply foreign-exchange conversion. Most financial inputs are monthly; weekly/hourly inputs are explicitly labelled, and result views annualise eligible flows only.

Both hubs and the full assessment use the same registry, validation and calculation engine. Tool defaults are administrator-editable only within code-owned field schemas. IDs and formula implementations cannot be edited through settings. Changed readiness weights create a new methodology record; older submissions keep their original configuration and results.

## Reports, enquiries and privacy

Completed runs persist inputs, results, provenance, method/configuration snapshot and a real PDF. Reports include existing Natton branding, an openly licensed bundled font, results, inputs, methods, assumptions and applicable recommendations/cash-flow/evidence. A PDF download action appears only after a real ready report is stored. Failed generation retains the result and supports bounded retries with audit history.

Public downloads use a dedicated HttpOnly, SameSite browser capability cookie and server-side ownership checks. Report IDs alone do not authorise access. URLs do not contain personal details or secret download tokens. This uses cookie-authenticated streaming instead of making PDF objects public or embedding credentials in signed URLs. Anonymous report access is specific to that browser capability; clearing it or moving to a different device does not grant access to private reports. Authorised staff can access saved submissions and reports across devices through the existing admin login.

Tools work without customer contact details. Optional enquiries store a server-assigned lead ID, name, email, optional phone/company, inquiry purpose, original contact consent, separately optional marketing consent and timestamp. One enquiry is associated with one completed result; retries return the same record, rather than merging people by similar names. Staff may update follow-up status, internal note and an existing active staff owner. Original contact and consent values cannot be edited in that workflow. Reader/tool forms opt out of the site's general lead-form collector.

No outbound email, Sheets append, CRM write or WhatsApp message is enabled by this implementation. Email templates are editable drafts; a read-only provider connection test is not evidence of an email being delivered. Existing integration settings remain the source for approved account connections. Contact delivery and external account enrichment require a separate configured, authorised adapter and appropriate consent.

Data minimisation: no raw IP addresses, passwords, API keys or browser session tokens are stored with submissions. Coarse device categories are inferred only from received user agents. Server-held ingestion key material is never returned by ordinary APIs. IP quotas use a keyed hash, and report ownership uses a hash of the random browser capability.

Retention rule: disabling or hiding a tool preserves its historical submissions. This release performs no automatic deletion of operational records or consent history. Access remains restricted while the owner selects an approved retention schedule and handles deletion requests through an authorised operator with a reviewed backup/retention procedure. No broad deletion endpoint is exposed. This is not a claim of automatic retention compliance or cross-device anonymous identity recovery.

## Admin routes

The existing shell now contains Free Growth Tools with these ten nested destinations:

- `/admin/free-growth-tools`: overview, real saved totals, availability, trends, recent runs/errors.
- `/admin/free-growth-tools/manage`: title, ID, category, description, availability, usage, method version, ordering and configuration.
- `/admin/free-growth-tools/submissions`: search, pagination, tool/status/date filters, saved inputs/results, report status and CSV export.
- `/admin/free-growth-tools/leads`: consented enquiries, private contact details, follow-up, note, ownership and export.
- `/admin/free-growth-tools/reports`: ready/failed reports, authorised downloads, retry limits and history.
- `/admin/free-growth-tools/roi-calculators`: management of the eight ROI experiences.
- `/admin/free-growth-tools/ai-readiness`: filtered response list, score/domain details, company when supplied, original rubric snapshot and export.
- `/admin/free-growth-tools/integrations`: configuration references, verified status, last check and actual test actions.
- `/admin/free-growth-tools/analytics`: saved usage, completion/lead/report rates, observed device categories, trends and analytics CSV export.
- `/admin/free-growth-tools/configuration`: approved defaults, supported currencies, icon, intro/helper text, report branding, template drafts, weights, method history and confirmed reset-to-defaults editor.

`/admin/free-tools` continues to open the new platform for compatibility. The old generic inventory tables and endpoints were not removed. There is one staff shell and one shared Supabase project, not a second admin application. The growth-specific normalized tables carry the new contracts without rewriting the earlier generic inventory or audit history; new audit events reuse `nd_admin_v1_audit_events`.

Read/write/export access uses the existing `free-tools` permissions. Enquiry contact access additionally requires the existing `leads` permission, and enquiry export requires lead export permission. Revisions prevent stale updates. All ten routes reject private API access without a valid staff session; public page shells contain no private data.

## API contracts

Public catalogue and execution:

- `GET /api/tools`, `GET /api/tools/:id`, `GET /api/tools/health`.
- `POST /api/tools/:id/run` with `{ "requestId": "<UUID>", "inputs": { ... } }`.
- The source-document aliases also work as POST routes: `/api/tools/ai-readiness`, `website-grader`, `seo-aeo-audit`, `crm-maturity`, `business-roi`, `whatsapp-roi`, `ai-agent-cost`, `lead-value`, `marketing-budget`.
- `GET /api/tools/results/:id`: result and report metadata for the current browser owner.
- `POST /api/tools/results/:id/lead`: validated contact fields, `deliveryConsent: true`, and separately `marketingConsent`.
- `POST /api/reports` with `submissionId` requests/retries the report of an owned completed result.
- `GET /api/reports/:id/download` streams a valid private PDF, using the current browser ownership cookie.

A successful run returns `result`, `submissionId`, and `{ id, status }` report metadata. `result` contains `requestId`, `toolId`, `toolTitle`, `generatedAt`, `method`, `methodologyVersion`, `inputs`, `currency`, `period`, `metrics`, `assumptions`, `methodology`, `warnings`, `recommendations`, `dataSources`, and tool-specific detail. Shared TypeScript request/result interfaces are in `src/growth/types.ts`; runtime schemas are in `src/growth/schemas.mjs`.

For example, deterministic test inputs of 100 leads, 10% baseline conversion, 20% scenario conversion, INR 1,000 sale value, 50% margin, INR 100 additional monthly operating cost and INR 1,000 setup yield baseline monthly contribution INR 5,000, scenario contribution INR 10,000, monthly net benefit INR 4,900 and first-year net benefit INR 57,800. These are a documented formula test, not measured customer outcomes.

Admin:

- `GET /api/admin/growth-tools`; `PATCH /api/admin/growth-tools/:id`.
- `GET /api/admin/growth-tools/{submissions,leads,reports,methods}`.
- `PATCH /api/admin/growth-tools/leads/:id` (status/note/owner/revision only).
- `GET /api/admin/growth-tools/reports/:id/download` and `/history`.
- `POST /api/admin/growth-tools/reports/:id/retry`.
- `GET /api/admin/growth-tools/analytics` and `/analytics/export`.
- `GET /api/admin/growth-tools/export/{submissions,leads,reports}`.
- `GET /api/admin/growth-tools/integrations`; `POST /api/admin/growth-tools/integrations/:id/test`.

List filters use `from`, `to`, `tool`, `status`, `q` and `page`. Queries return exact counts and 12-row pages. CSV exports apply filters, cap at 1,000 rows, protect spreadsheet cells from formulas and record an audit event. Dates are UTC with an explicit maximum 366-day range. Method history is paginated and follows the same date-window contract.

## External integrations and observed verification

- SEO/AEO technical inspection works without provider credentials. A real bounded inspection of `https://nattondigital.com` returned HTTP 200, extracted its public title, found three observed issues and observed XML at `/sitemap.xml`. This was not recorded as a customer submission.
- Google PageSpeed Insights is implemented against the official v5 API but currently not connected because `GOOGLE_PSI_KEY` is absent. It returns real Lighthouse laboratory scores and evidence when configured, and does not fabricate results when unavailable. Optional CrUX is separately controlled by `GOOGLE_CRUX_KEY`, with real-user data and insufficient-data states distinguished from lab data.
- Existing Search Console, GA4, HighLevel, Google Ads, WhatsApp and email read-only adapters are reused without changing stored connections, permissions or AI product links. Their current states are not connected. New OAuth scopes or provider applications were not created. HubSpot has no configured approved adapter and is explicitly marked not connected.
- The PDF engine passed its actual admin test by generating a real in-memory PDF. That test records a health observation, not a customer or sample submission.
- The original destination inventory is in `docs/admin/growth-existing-links.json`; those product/solution/contact links remain in the public experience. `src/components/Header.tsx`, `src/utils/googleSheets.ts`, `src/utils/googleAuth.ts`, and `server/admin/providers.mjs` were not edited.

PSI reference: https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed
CrUX reference: https://developer.chrome.com/docs/crux/api
Robots rules reference: https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec

The crawler pins DNS-validated public addresses to outbound sockets, checks redirects again, rejects private/reserved/mixed DNS targets and credentials/custom ports, respects supported robots groups/rules, imposes host/IP limits, bounds responses/pages/time, and never executes website JavaScript. It reports fetched evidence, not actual Google indexing, AI rankings or unobserved search traffic. PSI responses are briefly cached with the actual observation time. Provider quota/timeout errors remain errors.

## Database and server setup

Applied only on `rrukretdwracijqvkopp` using the connected Supabase integration. The additive application schema consists of:

- `nd_growth_tools`, `nd_growth_methods`, `nd_growth_submissions`, `nd_growth_reports`, `nd_growth_leads`, `nd_growth_integration_checks`.
- `nd_growth_private.ingress_keys` stores only a SHA-256 digest of a server-only scoped ingestion key.

RLS is enabled on every new table. Anonymous roles cannot directly read private submissions, leads or PDF data, or mutate configuration. The public catalogue is a restricted projection. Publicly callable ingestion/owned-result RPCs require the high-entropy server-held scoped key; ownership, quotas and allowed operations are checked in the database. Staff mutation functions check existing module permissions. No general service-role credential was exposed or needed for public ingestion.

The local ignored `.env` has the scoped key and was restricted to owner-only filesystem permissions. Names-only production setup is in `.env.example`. Do not expose any of these secrets through Vite variables, chat, logs, source control or ordinary settings endpoints.

Apply the SQL proposal files in order on a verified target:

1. `supabase/proposals/20261102_growth_tools.sql`
2. `supabase/proposals/20261102_growth_analytics.sql`
3. `supabase/proposals/20261102_growth_hardening.sql`
4. `supabase/proposals/20261102_growth_report_history.sql`
5. `supabase/proposals/20261102_growth_configuration_fix.sql`
6. `supabase/proposals/20261102_growth_lead_receipts.sql`

Then generate/inject `ND_GROWTH_INGEST_KEY`. `node scripts/admin/growth-storage-key.mjs` securely creates/reuses a local key and prints only its hash SQL; apply that SQL to the same intended project. In production inject the key from your secret mechanism and keep the matching digest in the private table. Never use a sample key or commit `.env`. Reusing an existing live database requires inventory/review; these initial CREATE migrations are not intended to overwrite existing objects.

Run locally with `npm run dev`; the existing Vite plugin mounts the Node APIs. Production requires Node (22.18+ / 24 recommended), `npm run build`, then `npm run start` with HTTPS and the same server Supabase URL/public key/scoped ingestion key. Deploy server code and dependencies, `dist`, `public` and `assets/fonts`; PDF branding/font lookup assumes the project root as working directory. Set `ADMIN_ORIGIN` to the actual public origin behind an approved proxy. Configure only known trusted proxy hops if forwarded client addresses are required; do not blindly trust arbitrary forwarding headers. An all-users shared proxy IP otherwise shares the IP quota.

A static-only host cannot run audits, private PDF downloads or persistence. No production hosting was changed here. Rollback restores the prior application/configuration; preserve the new operational tables until backup and an explicit owner-approved retention/removal decision. Existing blog, Auth, storage, other projects and provider settings are not part of rollback.

## Verification

Commands:

```sh
npm run test:growth
npm run test:admin
node node_modules/typescript/bin/tsc --noEmit
npm run build
```

27 growth tests and 31 existing admin tests passed. Coverage includes all tool forms and the eight ROI experiences, formula examples, zero/negative cases, questionnaire completeness/N/A, currency/config bounds, report bytes and ownership, consent, CSRF, fake/unconfigured result prevention, shared enable/disable behaviour, and all ten admin view shells. HTTP fixtures are explicitly synthetic and do not establish live Supabase JWT verification on their own.

`tests/growth/database-check.sql` was run through the real database and rolled back. It checks private grants, scoped-key rejection, reservations, idempotency, ownership, report/lead persistence, consent, role checks, disable propagation, methodology history and saved analytics. Fixtures, temporary key changes and configuration mutations were rolled back; existing user-created activity was preserved.

Live local requests verified the catalogue, growth management, submissions, leads, reports, methods, integration states, analytics and CSV export. The three public routes and nested admin routes return HTTP 200. A real server-side website audit succeeded. A generated two-page report was rendered and both pages were visually reviewed; font/symbol issues were corrected.

Browser access host was unavailable. Desktop/mobile browser interaction and visual layout were not verified in a real browser. Live PSI/CrUX/account OAuth/email/CRM delivery remains unverified or unavailable without the relevant authorised configuration. Existing Firebase/grpc dependency advisories remain outside this implementation; the newly added Zod version was upgraded to patched 4.6.7 rather than changing unrelated Firebase integrations.

Supabase advisor notices for intentional public SECURITY DEFINER projections and key-gated RPCs remain expected; do not treat an executable RPC as an unguarded anonymous table grant. The private key table intentionally has no read policies. Existing Auth leaked-password-protection configuration was not changed. Relevant advisor references: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable and https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy.

## File inventory

Changed: `src/pages/FreeTools.tsx`, `src/pages/Tools.tsx`, `src/pages/AiReadinessAssessmentPage.tsx`, `src/admin/AdminApplication.tsx`, `src/admin/modules.mjs`, `src/components/Breadcrumbs.tsx`, `src/App.tsx`, `server/admin/api.mjs`, `vite.config.ts`, `package.json`, `package-lock.json`, `.env.example`. The local ignored `.env` contains no frontend-exposed secret.

New public/shared code: `src/growth/registry.mjs`, `schemas.mjs`, `engine.mjs`, `types.ts`, `client.ts`, `PublicTools.tsx`, `growth.css`.

New admin/backend: `src/admin/GrowthTools.tsx`, `src/admin/growth-admin.css`, `server/growth/api.mjs`, `server/growth/audits.mjs`, `server/growth/reports.mjs`, `scripts/admin/growth-storage-key.mjs`.

New tests: `tests/growth/engine.test.mjs`, `api.test.mjs`, `audits.test.mjs`, `ui.test.mjs`, `database-check.sql`.

New support files: the six SQL proposals above, `assets/fonts/NotoSansDevanagari.ttf`, `assets/fonts/OFL-NotoSansDevanagari.txt`, `docs/admin/growth-existing-links.json`, and this runbook.

## November 3: forms and appointment requests

All submitted tool inputs and results are stored in Free Growth Tools → Tool Submissions. Open a row for every field and the original saved result. Staff can access these database records across devices. Unsubmitted assessment drafts remain local to the visitor.

Contact and Book Demo await database persistence before showing success. Their existing external form destination remains a secondary delivery. Appointments → Requested contains unscheduled requests, contact details, and the complete original request_snapshot. Preferred dates are not confirmed reservations. Assign an owner and valid start/end times to schedule. Staff edits preserve original snapshots.

Consented tool follow-ups, including AI Readiness, save both a growth lead and an appointment request atomically, with tool inputs and result metrics. Anonymous tool usage alone does not create a contactable appointment. The additive migration is supabase/proposals/20261103_website_appointment_requests.sql. Existing records were not removed or backfilled.

SEO audits allow bounded decoded HTML up to 4 MiB and support compressed responses. Optional sitemaps have a separate 512 KiB limit; inspection failures no longer erase main-page findings. The supplied https://saralsaiastrologer.com/ now completes. Its sitemap redirects to the home page, so no sitemap XML is observed.

## Website Grader setup, step by step

1. Select an existing authorised Google Cloud project. Do not enable billing or purchase services for this setup.
2. Go to APIs & Services → Library and enable PageSpeed Insights API (pagespeedonline.googleapis.com). Stop if Google requests a paid upgrade.
3. Go to Credentials and create an API key. Restrict API access to PageSpeed Insights API. If the server has a stable outbound IP, restrict the key to that IP. Browser-referrer restrictions do not suit server-side requests.
4. Put GOOGLE_PSI_KEY=your-key in the ignored server .env, or your hosting server secrets. Never prefix it with VITE_ or put it in frontend code or chat.
5. Restart the local Node/Vite server, or restart the hosted deployment with the new secret.
6. In Admin → Free Growth Tools → Integrations & API Settings, test Google PageSpeed. Run Website Grader with a public URL using mobile and desktop. Verify the saved submission and PDF.
7. Optional CrUX field measurements need GOOGLE_CRUX_KEY separately. They are not required for Lighthouse scores. This does not enable email or CRM delivery.

The Website Grader adapter is implemented. Real measurements require the server key; no sample scores are substituted. No paid services were enabled.

Official setup: https://developers.google.com/speed/docs/insights/v5/get-started
API reference: https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed

## Individual tool search

Site-wide search fetches the current public catalogue when opened, indexes visible tool titles and common aliases, ranks exact matches first, and opens the individual tool via its canonical deep link. Hidden tools are excluded. Tool catalogue failures show a retry option instead of invented results. Existing product and provider links are unchanged.

Free Growth Tools search recognises names, punctuation and aliases such as “SEO audit”, “PageSpeed” and “AI assessment”. An exact name returns that tool only; broad terms show ranked matches. Searching clears the previous category filter and also searches the ROI-only catalogue. Press Enter or choose Open Tool to open the result. ROI tools open in /roi-calculator?tool=<id>, ordinary free tools in /free-tools?tool=<id>, and AI Readiness in /ai-readiness-assessment. Legacy tool query aliases are accepted.

Search ranking/visibility/deep-link tests and existing tool UI tests passed. Local browser checks verified global search opens Website Grader, SEO + AEO Audit, Automation Savings and AI Readiness, and exact Free Tools search opens the matching ROI calculator on Enter. No tool run or form submission was created by these checks.

### Automatic website discovery

SEO + AEO Audit no longer asks visitors for a maximum page count. It automatically follows same-origin HTML links at every depth and discovers pages from robots sitemap directives, sitemap indexes and URL lists. It checks robots rules and rejects unsafe targets and off-site redirects. A run inspects up to 100 public pages within a 35-second crawl budget, with at most three concurrent page requests and five sitemap documents. It records inspected, discovered, skipped and remaining URLs in `coverage`, with explicit partial-result warnings. Unlinked, login-only and JavaScript-only content cannot be claimed as covered. Legacy explicit 1–5 page requests remain accepted for compatibility; new UI inputs omit that property even when old admin defaults include it.

The existing Website Grader uses real Google PageSpeed data for the entered page, separate from this site crawl. Its private Google key and persistent-storage key must be present in Netlify Functions runtime. See DEPLOYMENT.md for private environment import.
