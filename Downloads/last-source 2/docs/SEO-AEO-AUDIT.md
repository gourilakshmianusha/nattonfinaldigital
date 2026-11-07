# SEO + AEO Audit v2

The public tool retains its existing resource layouts and styles. Results come from server-side HTTP inspection, optional Chromium-rendered DOM, Google PageSpeed Insights, and the visitor's own authorized Search Console account. No generated rankings or fallback scores are used.

## Scoring contract

Version: `seo-aeo/2.0.0`. The machine-readable formula and weights are published at `/api/tools/seo-aeo/methodology`.

Per-page custom score = 100 × passed weight / evaluated weight. It is unavailable unless at least 80/100 rule weight is evaluated, the response is successful HTML, at least 40 readable characters are present, and any required JavaScript rendering succeeds. Aggregate custom scores are the arithmetic mean of eligible inspected pages only, and are suppressed if any inspected page cannot be scored or the submitted page was not inspected. Partial discovery is explicitly labeled; this is never an assertion that all website URLs were found.

Technical weights: HTTP 20, observed indexability 20, title 15, description 10, canonical 10, H1/hierarchy 10, language 5, alt attributes 10.

Custom AEO weights: adjacent answer text 20, logical headings 15, explicit definition/sourced factual markers 15, recognized structured markup 15, crawlability 15, author/source information 10, parseable date markers 10. These are observable readiness markers, not a semantic fact-check or any AI engine's ranking. Date ages are recorded but do not enter scoring, so unchanged evidence produces stable scores. Unresolved vocabulary checks are unavailable rather than assumed to pass.

Scores depend on inspected bytes/status/headers/rendered DOM and the pinned audit version, never request IDs, timestamps or random values. Google Lighthouse SEO remains a separate provider measurement for the exact submitted URL and mobile strategy. Provider failures retain null values and explicit reasons. No-data Search Console rows never become fabricated zero metrics.

## Crawl and evidence

The exact submitted URL (path and query preserved) is fetched first, following checked HTTP redirects. Each redirect and final URL is recorded. DNS is resolved and pinned for each HTTP request; mixed/private networks, credentials, secret query parameters and nonstandard ports are rejected. Robots rules are checked per path and redirect. Crawl scope is final same-origin public HTML, maximum 100 pages, 1,000 discovered URLs, five sitemap documents and 35 seconds by default. The report lists failed, blocked, skipped and remaining URLs plus every inspected robots/sitemap document. Limits make coverage partial.

Pages with executable scripts use Playwright Chromium, even when the initial HTML is nonempty. All browser HTTP requests are intercepted and fulfilled by the pinned HTTP client; service workers, WebSockets, unsafe methods, cross-origin documents/data and large/unbounded resources are blocked. No browser cookies or authorization headers are forwarded to audited websites. A failed/missing browser results in unscorable content, never a synthetic rendered-page score.

Structured evidence includes JSON-LD, Microdata (including nested scopes/itemref) and basic Schema.org RDFa vocab/prefix declarations. A pinned official Schema.org vocabulary validates recognized types, properties and domains, with selected range/date checks and local Article/BreadcrumbList Google profiles. Advanced context transformations and rich-result profiles outside the supported subset are explicitly not fully evaluated. Presence, local validity and Google rich-result eligibility are independent. Eligibility is Not measured: a link to Google's Rich Results Test is supplied per URL, and passing local tests never guarantees a Google rich result.

## Deployment

Keep existing persistent tools storage configured. Set `GOOGLE_PSI_KEY` for actual Lighthouse SEO. Install Chromium on each server/container with `npx playwright install --with-deps chromium`; provision enough runtime memory and request duration for crawl plus provider requests. Serverless deployments must package the browser and cannot assume a developer's browser cache is present.

For Search Console configure `SEO_GSC_CLIENT_ID`, `SEO_GSC_CLIENT_SECRET`, and `SEO_GSC_REDIRECT_URI`, enable the Search Console API in that Google project, and register the callback `/api/tools/seo-aeo/search-console/callback` on your own site. Use HTTPS and a stable `ND_GROWTH_INGEST_KEY` for encrypted, HttpOnly session cookies. The tool's Connect action requests only `webmasters.readonly`, and Google presents user consent. Tokens are never included in audit inputs/results/PDF/CSV. Tokens expire within an hour; reconnect when needed. Do not substitute an administrator's token for visitor authorization.

Search Analytics is scoped to the exact submitted page on an authorized matching property, final web-search data for 28 days ending three days before the observation date (Google reporting dates use Pacific time). AI-engine mentions/citations are Not measured because no verifiable monitoring is connected.

PDF and CSV downloads require the existing visitor ownership cookie. CSV includes every URL record, page check, score calculation, structured-data item and visibility status. Both exports retain null/unavailable reasons. PDF generation failure is reported independently of saved audit results.

## Verification

Run `node --test tests/growth/audits.test.mjs tests/growth/seo-evidence.test.mjs` with Chromium installed, plus the existing growth API and frontend suites. Fixtures cover valid/invalid markup, explicit noindex, blocked URLs, exact query URLs, deterministic scoring, no-data/failed providers, visitor-scoped Search Console metrics and an actual JS-rendered synthetic page with intercepted resources.

Independent live comparison: compare recorded HTTP/status/metadata with curl and a separate HTML parser; compare `scores.lighthouse` with the official PSI SEO category for the exact URL/device/time; use the per-page Rich Results Test links for Google's independent validation. Live Lighthouse runs can differ with the site/network/provider version. Record the observed timestamp and version rather than expecting all future live runs to be identical. Google Rich Results Test is interactive; no undocumented API or fabricated approval is used.

Sources: [Schema.org data model](https://schema.org/docs/datamodel.html), [Lighthouse PSI response](https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed), [Article properties](https://developers.google.com/search/docs/appearance/structured-data/article), [Breadcrumb properties](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [Search Analytics API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), [read-only OAuth](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing).
