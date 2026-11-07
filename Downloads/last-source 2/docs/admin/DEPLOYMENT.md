# Deploy the website, admin and tools together

The API uses the existing Supabase database. Deploying the complete app with the same project and server secrets keeps published blogs, tool settings, submissions, enquiries, appointments and admin memberships shared across devices. No database reset, new project or new admin account is needed. A `dist`-only upload cannot run the API.

## Server environment (both hosts)

Copy the existing values from your private local `.env` into the host's environment settings. Do not upload `.env` to a public repository or put secrets into `VITE_` variables.

- `NODE_ENV=production`
- `SUPABASE_URL`: the configured **new admin workspace** project URL (not an old website project).
- `SUPABASE_ANON_KEY` or `SUPABASE_PUBLISHABLE_KEY`: matching public API key.
- `ND_GROWTH_INGEST_KEY`: the existing scoped storage key. Reuse it; generating an unregistered replacement breaks persistence.
- `GOOGLE_PSI_KEY`: the existing PageSpeed Insights key for Website Grader.
- `ADMIN_ORIGIN`: the exact deployed HTTPS origin, e.g. `https://nattondigital.com`, without a trailing slash. Update when changing domains.
- `SITE_URL`: the same canonical HTTPS origin.
- Copy enabled feature flags and other configured server credentials from `.env`, including `ND_ADMIN_LEAD_INGESTION_ENABLED`, `ND_ADMIN_PUBLIC_SITEMAP_ENABLED`, and `SUPABASE_SERVICE_ROLE_KEY` only if your enabled ingestion workflow requires it.
- Optional: `ADMIN_RECOVERY_REDIRECT`, using an approved redirect already allowed in Supabase Auth. If the domain changes, add the appropriate recovery URL to the existing project's Auth redirect allowlist before using recovery.

Set secrets for the production runtime/functions, not only the build. Keep the same Supabase project and keys together. Ordinary password login uses server-side authentication and same-origin HttpOnly cookies.

## Netlify

1. Deploy the **whole repository** through Netlify's Git integration or the Netlify CLI, including `netlify.toml` and `netlify/functions/api.mjs`. Dragging only `dist` into a static upload does not deploy functions.
2. Use Node 22.18+; the included config selects Node 22. Build command: `npm run build`. Publish directory: `dist`.
3. Add the environment values above in the site's environment settings, with Functions/runtime scope. Set `ADMIN_ORIGIN` to the actual production domain or Netlify site origin you will use.
4. Deploy/redeploy. `netlify.toml` routes `/api/*` to the Express function before the frontend fallback. It includes runtime source files, PDF fonts and sitemap files.
5. Run the checks below on the deployed domain. Keep usage within your existing plan; this setup does not enable billing or buy services.

Netlify's synchronous function execution limit still applies to long website crawls and PageSpeed calls. Slow external sites can time out; use a persistent Node host for workloads exceeding that limit. In-memory API throttles are per function instance, while submitted records are stored in Supabase.

## Hostinger hPanel / another Node server

1. Choose the host's **Node.js Web App** deployment, using an existing plan that supports Node. A PHP/static-only `public_html` upload will not execute `server.mjs`.
2. Upload/import the complete source, `package.json`, lockfile, `server/`, `src/`, `assets/`, `public/` and build scripts. Exclude local `.env`, `node_modules` and logs.
3. Select Node 22.18+ (or Node 24), install with `npm ci`, build with `npm run build`.
4. Set the private environment values above. Startup command: `npm start`; entry file, if requested: `server.mjs`. The server listens on the host-provided `PORT` (local default 4173).
5. Route the public HTTPS domain to that Node application, including `/api/*`. Start/restart the app and run the checks below. Do not configure the domain to serve only `dist` separately.

If the existing plan lacks Node, use a host that already supports this app; no paid upgrade is performed by these changes.

## Verify after deployment

1. Open `/api/tools/health`: JSON should report reachable database, configured storage and PageSpeed configuration.
2. Open `/api/tools`: confirm actual tools load. Open `/api/admin/status`: confirm JSON, not the homepage.
3. Sign in at `/admin` with the existing admin account. Refresh and confirm the session and workspace membership remain valid.
4. Check published blogs, create a real tool run, and check the saved fields in Admin → Free Growth Tools. Verify an actual contact/assessment submission appears in the configured admin module.
5. Run Website Grader and SEO/AEO Audit, then download a PDF. Verify a signed-out browser cannot access the admin workspace or another visitor's private report.
6. Open a solution, industry and blog URL directly and refresh it. Confirm normal pages and API requests both resolve.

Troubleshooting: HTML from an API URL means routing/functions are missing. `invalid_origin` means `ADMIN_ORIGIN` differs from the browser's origin. `setup_required`/empty workspace usually means the wrong Supabase project was configured. Storage-key errors mean the existing scoped key was not copied. Provider HTTP 403/429 requires checking the existing Google key restrictions or quota.

References: [Netlify Express deployment](https://docs.netlify.com/build/frameworks/framework-setup-guides/express/), [Hostinger Node app deployment](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

## Database error after a successful Netlify deploy

The API now defaults to the approved `natton-digital-admin` project (`rrukretdwracijqvkopp`), using its public publishable key. Older builds defaulted to a different website project when function runtime variables were absent. Redeploy the updated full repository to apply this correction. Explicit environment overrides still take precedence.

1. In Netlify → Project configuration → Environment variables, inspect `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_ANON_KEY`, and any `VITE_SUPABASE_*` overrides. Remove stale values or set the matching URL/key for the new workspace. Prefer `SUPABASE_PUBLISHABLE_KEY` over legacy anon keys.
2. Set the values through the Netlify UI, CLI or API, with Functions runtime scope where scope controls are available. Variables in `netlify.toml` are build settings and are not passed to function runtime.
3. Keep `ND_GROWTH_INGEST_KEY` set privately in Netlify so submissions persist. Copy its existing value from local `.env`; it is not included in source. Keep `GOOGLE_PSI_KEY` configured for Website Grader.
4. Trigger a new full deployment. Check `/api/tools/health` and `/api/tools`, then sign in again at `/admin` to replace any cookies from an older project connection.
5. If `database_configuration` is returned, resolve mismatched URL/key values. If `setup_required` appears, verify that you selected the already-configured workspace rather than running migrations on another project. No database reset is needed.

Netlify reference: [Functions environment variables](https://docs.netlify.com/build/functions/environment-variables/).

## Import the missing live-tool settings

Run `node scripts/admin/prepare-netlify-env.mjs https://stellular-choux-3e713c.netlify.app` locally. It creates the ignored, mode-600 `.env.netlify-import` file from existing private settings. It does not print keys or create/change any database credentials.

In Netlify → Project configuration → Environment variables → Import from a .env file, import that private file. Apply to Production and Functions/runtime (or all scopes where per-scope selection is unavailable), then redeploy. Never upload this file as a public site asset or commit it. Existing stale URL/anon-key overrides should be removed; the imported publishable key takes precedence.

On this site's most recent live check, `/api/tools/health` showed a reachable database but `storage: needs_configuration` and `pagespeed: false`. These explain the shared submission error and unavailable Website Grader. After import/redeploy it should show `storage: configured` and `pagespeed: true`. That confirms presence; submit a real run to verify the credentials and provider quota.

## hPanel automatic private configuration

The Node startup now loads `.env.production` from the application root automatically, followed by local `.env` defaults. Hosting-provided environment variables take precedence. Loading works even when hPanel starts Node from another working directory.

A private `.env.production` has been prepared locally using existing configured keys. To regenerate it, run `node scripts/admin/prepare-hpanel-env.mjs`. Deploy it alongside `server.mjs` in the **private Node application root**, outside publicly served folders. It is ignored by Git and must not go into `dist`, `public`, a frontend bundle or a public repository. Configure a Node Web App with `npm start`; no manual copying of individual keys is needed when the private file is included. Static/PHP-only hosting cannot execute this API.

The generated file omits localhost and Netlify origin settings. The server derives same-origin checks from the HTTPS request through the hosting proxy. If hPanel already has a stale `ADMIN_ORIGIN` or Supabase override, remove or correct that host setting because host variables intentionally take precedence. After startup, `/api/tools/health` should report configured storage and PageSpeed. On Netlify, continue using the private environment import, since Netlify Functions do not automatically receive local deployment files or build-time secrets.
