# New Supabase project setup

The user has authorised a new database connection as an alternative to the unreachable existing project. This supersedes the earlier restriction against creating a new project. No project, account, connection, or production database has been created or changed yet.

## Required access

The Supabase integration was discovered but is not installed or connected. Install it and authenticate with the account that should own the new project. Account sign-up and any agreement acceptance must be completed by the account owner. Do not paste passwords, management tokens, or service keys into chat.

After authenticated access is available, inspect the available organisations and project-creation options. Create a separately named project without enabling paid services. If no appropriate no-charge project option is available, stop that provisioning step and report the requirement rather than making a purchase.

## Source data boundary

Do not delete, reset, rename, or modify the existing project. Copy actual records only from an authorised source-project connection or a verified export. The repository's illustrative blog posts, simulated tool metrics, and screenshot samples are not production database records and must not be substituted for a database backup.

The repository contains public website source, images, and service definitions. These can be inventoried independently, but do not establish that leads, applicants, auth users, private files, or historical events have been backed up. No protected records were read or exported during the preparation of this note.

## Provisioning sequence

1. Confirm the owning account, organisation, project name, supported location, and no-charge plan through the connected integration.
2. Create the new project and inspect its schema, Auth configuration, and storage before installing application objects.
3. Review and apply `supabase/proposals/20261102_nd_admin_v1_additive.sql` on the NEW verified target only. It creates 40 application-owned tables with RLS, permissions, revisions, audit events, and supporting functions. It has not been executed against any database.
4. Establish the first administrator using an authorised existing identity in the new project's Auth system, then create application membership through the operator-only template. Never restore the old browser-only demo password.
5. Inventory the authorised old database/export. Map public content, private operational records, users, and private storage independently. Keep original IDs, ownership, consent, dates, and source metadata where supported. Plan identity migration separately rather than copying password data into application tables.
6. Import into new objects transactionally with count checks, duplicate checks, and permission tests. Never overwrite source records. Verify private file access and public published-only projections before switching traffic.
7. Configure the new project URL and public key consistently for the frontend and trusted server. Inject server-only credentials through the approved secret mechanism. Preserve the old configuration securely for rollback; do not expose credentials in source or logs.
8. Verify real sign-in, RLS, cross-device persistence, public forms, content publication, existing routes, and backups before any production cutover.

## Current state

Updated 2 November 2026: Supabase is connected and the new database has been provisioned. This status supersedes the historical access and unexecuted-proposal statements above and in IMPLEMENTATION.md.

- Owner organization confirmed by the user: `atomceatomce's projects` (`vercel_icfg_m60ONtfKZGnJu3TjvxgMqS8a`), Free plan. Creation quote: $0/month. No paid services were enabled.
- New project: `natton-digital-admin`, ID `rrukretdwracijqvkopp`, Mumbai (`ap-south-1`), verified `ACTIVE_HEALTHY`.
- API URL: `https://rrukretdwracijqvkopp.supabase.co`.
- Inspected five pre-existing projects without modifying them. The new target had no public application tables, Auth users, storage buckets, or stored objects before installation.
- Applied `nd_admin_v1_additive` (migration `20261102101147`) only to the new target. Verified 40 application tables, all with RLS, six role definitions, and zero anonymous table grants.
- Applied `nd_admin_v1_explicit_function_permissions`; the corresponding SQL is saved alongside the original proposal. Supabase default privileges had explicitly granted anonymous execution beyond PUBLIC. Verified that only `nd_admin_v1_published` remains anonymously executable among the application functions; its read-only anonymous pages query succeeded and returned zero records.
- At the user's request, created the Auth account `atomceatomce@gmail.com` through the signup API and verified its active `super_admin` membership and application profile. Email confirmation is pending; Supabase reported that a confirmation email was sent. No Auth provider settings were changed. Passwords are not recorded in this document or application source.
- Local ignored `.env` now directs the admin server to the new project's URL and publishable key. Restart the development server to load it. Public frontend connection defaults and production deployment were not changed.
- The initial administrator confirmed their email. At the user's request, the same Auth identity's password was changed and an email change to `nattondigital@gmail.com` was initiated through the authenticated Auth API. Supabase sent the email-change confirmation; until completed, the current login email remains `atomceatomce@gmail.com`. The existing membership is retained. No password is recorded here.
- No production records were imported, no storage was copied, and no application connection or production traffic was switched. A verified authorized source/export, administrator identity, secret configuration, and live role/workflow tests remain necessary before cutover.

The frontend/API transport issue is fixed for development and preview, and its local tests pass. Creating a new project alone does not recover inaccessible old data.

## Blog and comments update

The local public blog now reads published admin posts from the new project rather than sample/browser-local content. The new comments table and restricted functions are installed, with verified-email reader submission and audited staff moderation. See `BLOG_AND_COMMENTS.md` for the publishing workflow, checks, email quota limitation, and deployment requirements. No sample posts/comments were retained after rollback-only checks, and no production deployment was performed.
