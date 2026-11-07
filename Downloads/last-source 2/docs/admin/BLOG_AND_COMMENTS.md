# Shared blog and reader comments

Implemented on 2 November 2026 in the local application. No production deployment, paid services, legacy database changes, or sample-content imports were performed.

## Publishing articles

Use Admin → Blog & resources → Articles. Create a draft with its title, slug, summary, Markdown content, author, category, tags, optional image, and SEO title/description. Save, submit for review, approve, and publish using an account with publishing permission. The public Resources → Blogs page reads only published `nd_admin_v1_posts` through restricted database functions. Its public article links use `/blog?article=<slug>`.

The redesigned public page supports search, categories, pagination, featured article layout, responsive reading layout, and light/dark themes. It refreshes shared content every 30 seconds while visible and on window focus. Publishing, archiving, and edits use the existing content workflow; drafts are not public. The admin's public article link opens this new reader.

The previous browser-local post store, automatic illustrative seeding, sample comments, simulated AI/audio/download tools, and legacy `blog_posts` connection were removed from the active blog service. No existing browser-local or legacy database records were erased or imported. There are currently no published articles in the new database, so the page correctly starts empty.

## Reader comments

- A reader signs up with a display name, email, and password, confirms their email, then signs in on an article. Auth sessions use dedicated HttpOnly cookies, separate from staff sessions. Passwords and session tokens are never saved in blog records or returned to client JavaScript. Reader forms opt out of the site's global lead-form capture.
- Comments are saved in `nd_admin_v1_blog_comments`, not browser storage, and begin as pending. A confirmed email proves control of the email address; it does not establish the truth of a comment or verify a display name as a legal identity.
- Only approved comments on currently published posts are publicly readable. Public responses exclude email addresses, Auth IDs, and moderation metadata. Reader comments are rendered as plain text.
- Active staff accounts cannot submit reader comments through the database function. There is no staff comment-creation endpoint or form, and authenticated roles cannot directly insert, update, or delete comment rows.
- Admin → Blog & resources → Comments lists pending, approved, rejected, and spam submissions. Staff with blog publishing permission can moderate. Original text and attribution cannot be rewritten through moderation. Decisions increment the revision and record an audit event; stale updates are rejected.
- Submission uses idempotency keys, duplicate-content constraints, a honeypot, same-origin mutation checks, and account-level database throttling (3 comments per 10 minutes and 20 per day). HTTP endpoints also have process-local rate limits.

Supabase's existing email sending quota applies to reader signup and confirmation. A reported rate limit is shown as an error, never a successful signup or comment. No paid email service was enabled. No reader account was created for testing.

## Database and verification

Applied `nd_admin_v1_blog_comments` only on `rrukretdwracijqvkopp`. SQL is retained in `supabase/proposals/20261102_nd_admin_v1_blog_comments.sql`. The new table has RLS. Anonymous execution is limited to the intentional published-post, category, and approved-comment projections; reader submission and staff moderation require authenticated identities and database authorization.

Validation: TypeScript, production build, 31 admin/API/UI tests, live local public and admin API requests, and the rollback-only `tests/admin/blog-database-check.sql`. The database regression checks cover draft filtering, private-field exclusion, unconfirmed-user rejection, duplicate/idempotency behavior, persistent throttling, staff fabrication denial, moderation authorization, stale revisions, unchanged reader text, and hiding comments when a post is unpublished. The transaction was rolled back and record counts confirmed zero posts/comments and two existing Auth users afterward. Independent public and staff HTTP sessions both read the shared backend successfully.

Browser automation was unavailable, so responsive CSS was not visually verified in an actual browser. Reader email delivery and multi-device browser interaction were not exercised. To make this available on a public domain, deploy the updated frontend and Node API together with the new project's server connection configuration and HTTPS; a static-only deployment cannot serve these APIs. The existing production deployment remains unchanged.
