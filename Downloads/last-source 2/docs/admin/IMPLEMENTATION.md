# Natton Digital admin implementation

The repository now contains the 18 requested admin routes, a separate responsive admin shell, Supabase Auth based server sessions, a role checked API, centrally persisted record workflows, and a guarded additive database proposal. The new database proposal has not been applied. The existing frontend Supabase address did not resolve during inspection, including an approved network retry. The user selected the existing app project rather than the different CLI project. No database, Auth, storage, provider, or production deployment changes were made.

## Reference review

The supplied DOCX text and all 18 embedded images were inspected. The UI uses its navy sidebar, 254 pixel desktop navigation, 68 pixel top bar, purple actions, white cards, compact tables, and 8 pixel spacing approach. Screenshot records, metrics, charts, and connection states were not imported as operational data. A native browser check was attempted but computer-use permissions were not granted, and the browser host was unavailable. Isolated synthetic HTML layout fixtures were generated for all 18 screens; they were not browser inspected. A full browser comparison is not recorded; source review, rendered component tests, and API fixtures do not establish pixel fidelity.

## Existing architecture findings

- Existing stack: Vite, React 19, TypeScript, Tailwind, Express, Recharts, and Supabase JS. Existing routing was extended rather than replaced.
- The public blog already uses Supabase. Its existing URL and public key were moved without changing their values to `src/admin/connection.mjs`; the shared client is in `src/utils/supabaseClient.ts`. Existing blog exports remain compatible. No new project or database was created.
- The previous admin was a browser only demonstration login. That login and browser authentication flag were removed from the admin route. The new API uses the existing project's Auth users and verified short lived access tokens in HttpOnly cookies.
- The CLI configuration references a different project. It was not repointed and no CLI schema push was used.
- The existing migration files grant anonymous writes to legacy blog tables. They are untouched because changing existing policies is outside the additive authorization. The new admin's protections do not fix or establish the security of those legacy interfaces. Tightening them requires a separately reviewed change and compatibility testing of legacy public behaviour.
- No live record values were requested. Database definitions, policies, private schemas, storage inventory, and data preservation cannot be independently verified while the project is unreachable.

## Run locally

Use the existing dependency installation, then:

```sh
npm run dev:admin
```

Open `http://localhost:3000/admin/login`. The Vite development and preview servers now mount the admin API directly on the same origin. `npm run dev`, `npm run dev:admin`, and `npm run preview` all serve the API; no second process or port 4173 proxy is required. `npm run start` serves the built website and the new API together.

No default staff password, signup backdoor, test role switch, or browser only admin bypass is included. An existing authorised Auth identity and new application membership are required. Without backend setup, login or session verification reports the actual error.

## Environment variables

Use the existing configuration for the same app Supabase project. Names only:

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` or `SUPABASE_ANON_KEY`: trusted server public connection configuration. Existing Vite connection names remain supported.
- `SUPABASE_SERVICE_ROLE_KEY`: optional trusted server or worker only key, required for the new public lead RPC and signed event queue. It is never imported into frontend code.
- `ADMIN_ORIGIN`: exact public origin when behind a deployment proxy. The default is the incoming origin. State changes require same origin and a custom request header.
- `ADMIN_RECOVERY_REDIRECT`: an already approved recovery handler in the existing Auth setup. The implementation does not modify Auth settings. The established handler completes the reset.
- `ND_ADMIN_LEAD_INGESTION_ENABLED`: opt in after database and consent tests; default false. The existing consultation destination remains the primary handler.
- `ND_ADMIN_PUBLIC_SITEMAP_ENABLED`: opt in to add newly published `/p/` routes to the existing sitemap; default false. A failed new source falls back to the existing sitemap.
- `ND_ADMIN_WEBHOOK_SECRET`: server only HMAC key for the new signed receiver.
- `NODE_ENV`, `PORT`, `SITE_URL`: standard server/deployment configuration.

Do not put server secrets in a `VITE_` variable, browser storage, source files, record JSON, or chat.

## Database setup gate

1. Restore authorised access to the app's existing project. Do not use the different CLI project by accident.
2. Run `supabase/proposals/000_read_only_inventory.sql`. Export its definition only output through an approved secure channel. Compare existing schemas, tables, columns, constraints, indexes, functions, triggers, grants, policies, extensions, buckets, and Auth setup. Capture the same inventory after installation and compare pre-existing definitions.
3. Confirm none of the `nd_admin_v1_` objects already exists. The proposal aborts on a namespace collision rather than modifying an existing object.
4. Review `supabase/proposals/20261102_nd_admin_v1_additive.sql` against the live inventory and back up the existing project through its established procedure. The file is intentionally outside `supabase/migrations` to prevent accidental CLI application to the wrong project. No previous migration was edited.
5. Apply the explicit proposal transaction only through authorised access after that review. It creates new objects only, enables RLS, and grants no anonymous table access. Public reads go through a restricted published-content projection; anonymous ingestion is not a table grant.
6. Run the operator-only `001_bootstrap_membership.sql` template with the UUID of an existing approved Auth identity. It creates only new application membership and profile rows; it never creates or changes Auth users. Application users cannot assign their own roles.
7. Run live policy tests for anonymous, editor, marketing, sales, HR, analyst, and administrator identities. Verify private resumes/evidence, self escalation, content transitions, exports, booking overlap, lead retries, and revisions. The local fixture suite is not a substitute for these tests.
8. Confirm the before/after baseline and protected records are unchanged. No full schema or protected-record preservation claim can be made from this checkout alone.

## New tables

Security and history: `nd_admin_v1_roles`, `role_permissions`, `memberships`, `profiles`, `audit_events`, and `versions`.

The following suffixes all use the same `nd_admin_v1_` prefix: `pages`, `menus`, `categories`, `services`, `posts`, `authors`, `tags`, `post_tags`, `leads`, `lead_events`, `consents`, `followups`, `jobs`, `applicants`, `application_events`, `tools`, `tool_runs`, `campaign_snapshots`, `analytics_snapshots`, `seo_scans`, `workflows`, `workflow_runs`, `webhook_events`, `async_jobs`, `media`, `case_studies`, `evidence`, `approvals`, `appointments`, `availability`, `invitations`, `integration_connections`, `settings_versions`, and `notifications`.

New records share typed identifiers, timestamps, revision numbers, status, slug uniqueness, ownership, constraints, and a module-specific JSON body. Identity and permission records are normalized. Some domain relationships are stored as explicit IDs in validated JSON; this is not a claim that every proposed relationship has a relational foreign key. Auth references originate only from new tables and use non-cascading restrictions. New triggers write append-only audit and revision rows within the original transaction. New functions implement permission checks, restricted membership grants, published projection, idempotent email-deduplicated lead intake, export auditing, signed-event enqueueing, and transaction-locked booking overlap checks.

## Screen coverage

1. Login `/admin/login`: email/password, show/hide, generic failure messages, configured TOTP challenge, recovery request, secure cookies, refresh, logout, and idle expiry. Requires reachable existing Auth. SSO is not shown without an implementation and configured provider.
2. Dashboard `/admin/dashboard`: permission scoped KPI drill-down, date filter, actual saved-lead trend, attention list, and audit activity. Live counts depend on new tables. Empty graphs contain no invented values.
3. CRM `/admin/leads`: server paginated table, six-stage board, search, service/source/status/date filters, editable contact/owner/follow-up/consent/notes fields, revisions and authorised audited CSV exports. Supplemental public intake is opt in and uses a transactional idempotency and email dedupe function. A reviewed, capped CSV import skips duplicate emails and inserts in one transaction. External reminders are not implemented.
4. Pages `/admin/pages`: draft records, slug/SEO/hero/CTA/schema/template fields, section blocks with add/remove/reordering, JSON navigation data, previews, approval/publication/scheduling states, autosave for valid existing drafts, revision comparison, and restore-as-draft. Published new content uses `/p/pages/<slug>`. Existing public pages are not automatically replaced. The nested menu editor supports labels, links, ordering and child entries. Applying draft menus to the existing public navigation and CDN-specific invalidation are not implemented.
5. Services `/admin/services`: structured fields, category/order, FAQs, benefits, process, deliverables, related links, previews and content lifecycle. Existing catalogue routes remain unchanged; new approved records can publish through the additive content route. Catalogue taxonomy is not silently reseeded.
6. Blog `/admin/blog`: drafts, plain text/Markdown controls, author/category/tags, image/alt/SEO fields, autosave, preview, revision comparison, scheduled/publication states. Raw HTML is rendered as text. An editorial month view uses scheduled dates on the current result page. A full rich text engine, taxonomy management screens, and merging new records into the legacy blog are not implemented.
7. Tools `/admin/free-tools`: central registry fields and backend ROI, CPL, and time-saved calculation tests. No provider tool is reported as active without an adapter. The existing public-tool source inventory is available for review and tests are recorded in tool-run history. Provider adapters and full automatic usage telemetry are not implemented.
8. Careers `/admin/careers` and private `/admin/applicants`: job lifecycle and applicant stages, notes, interview/consent/retention metadata. Actual private resume upload/scanning, interview emails and automatic retention deletion require additional reviewed implementation and storage setup.
9. Campaigns `/admin/campaigns`: reference-style KPI/chart/table layout with honest unconnected views and read-only snapshot records. No Google/Meta adapter or live spend is fabricated.
10. SEO `/admin/seo`: local route inventory and source checks for title/description presence/length and social images. Findings are distinct from Search Console. The scan does not claim live links, rendered H1/schema, indexing or mobile performance checks. Local scan history is saved in the new table and can be reopened. Provider metrics require further implementation.
11. Automations `/admin/automations`: central workflow registry, ownership, test/paused status, secret references, rollback fields, signed timestamped HMAC receiver and transactional durable event/job enqueueing. The worker deliberately holds unconfigured jobs; bounded, revision-checked manual retry uses exponential backoff. Provider execution, operational alerts, and dead-letter replay remain unimplemented.
12. Analytics `/admin/analytics`: timeframe filters, source-labelled snapshot list and empty acquisition/attribution panels. Charts can render saved metric observations on the current result page. Actual reporting adapters, dimension mapping and verified external metrics are not implemented.
13. Case studies `/admin/case-studies`: challenge/approach/result, approval/measurement/evidence references, lifecycle and revisions. Publication requires approval/evidence metadata. Evidence upload/scanning and substantiating numerical claims require live human review; entering a reference is not automatic proof verification.
14. Media `/admin/media`: searchable grid, existing permitted image URLs, alt text, licence/folder/tag/usage metadata, and dependency-aware metadata deletion. Upload controls explicitly explain unavailable private storage/scanning. Binary upload, transformations, duplicate hashing, signed file delivery and versioned object replacement are not implemented.
15. Appointments `/admin/appointments`: editable timezone-aware records, agenda, month calendar, filters, statuses, ownership/lead/reminder consent metadata, and proposed transactional overlap/buffer guard. Calendar counts reflect the current result page. Availability booking UI, week view, external calendar sync, and reminder delivery remain unimplemented.
16. Team `/admin/team`: invitations as unsent application records, membership directory, role matrix, restricted application membership grant/deactivation to existing Auth UUIDs, and actor MFA state. No Auth user or existing shared account is deactivated. Invitation email delivery, access review scheduling and provider-wide session revocation require authorised implementation.
17. Integrations `/admin/integrations`: eight provider cards, documentation, separate configuration references, honest not-connected states and connection requirements. OAuth/token storage/refresh, provider verification, rotation and disconnect adapters are not implemented. Existing integrations and secrets are untouched.
18. Settings `/admin/settings`: new versioned workspace settings for organisation, admin brand, routing/defaults/notifications/retention/flags. These are saved separately; they do not apply changes to existing website, domains, Auth, backups or infrastructure. Those operational adapters remain unimplemented/unverified.

## Publication and ingestion boundaries

Approved new content is returned by a narrowly projected function. Private notes, evidence references, applicant details and draft records are not in its public whitelist. `/p/<module>/<slug>` renders new published text and sections in the existing public style. No raw HTML is executed. Public API responses and views use no-store caching; opt-in sitemap integration reads only published rows.

Content transitions are validated by database triggers, not only UI controls. Editors can draft and submit for review; publishing and changing live content require publishing permission. Restore creates a new draft revision. Actual RLS, trigger, scheduling and public projection behaviour still need a live database test after installation.

The existing consultation handler runs first. When its successful result is followed by an enabled new CRM capture, a stable submission ID is sent. The new server validates/rate limits submissions, requires consent, prevents retries duplicating leads, records repeat enquiries and retains each contact-consent event. No marketing opt-in is inferred, and no message is sent.

## Verification

`npm run test:admin` runs unit tests, a synthetic localhost Supabase HTTP fixture for API boundary tests, and server-rendered component tests. The fixture never contacts Supabase, creates a database, imports real contacts, or changes the production connection. It verifies permission rejection, unauthenticated access, cross-origin rejection, input validation, CSV safety, HMAC handling, actual calculator arithmetic, login semantics, role-aware navigation and static proposal constraints.

`node node_modules/typescript/bin/tsc --noEmit` and `npm run build` validate application compilation. Browser interaction, full screenshot fidelity, live Auth/MFA/recovery, live RLS, migration syntax execution, cross-device persistence, concurrent booking and protected-record preservation are not established by these checks.

## Deployment and rollback

No production deployment is performed. Deploy a staging copy using the existing project and separately reviewed new objects, with HTTPS, the correct `ADMIN_ORIGIN`, secret injection on the server, and separate trusted-worker scheduling. Install the new SQL only after the baseline gate. Serve Express behind the established proxy; a static-only deployment cannot run these APIs. Verify existing public routes, forms, redirects, and styling before release.

Application rollback restores the previous application files and disables the new optional intake/sitemap/worker flags. Retain new tables and operational records until they are backed up and an owner approves retention/removal. No destructive rollback script is supplied. Never drop or roll back existing Auth, blog, storage, policy, or provider objects as part of this implementation.
