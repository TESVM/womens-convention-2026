# Setup Notes

This file records exactly what has been done so far for the AOH Women's Convention 2026 Cloudflare setup.

## Local Project Work Completed

The following files and features were created or updated in this project:

- Public website moved into static Cloudflare-friendly structure
- Admin login page created
- Admin dashboard page created
- Shared CSS updated for admin and login styling
- Public site JavaScript updated to load content from API with fallback content
- Cloudflare Pages Functions created for:
  - login
  - content
  - upload
- D1 schema created
- R2 upload logic created
- Session auth logic created
- Admin helper scripts created
- Cloudflare setup guides created

Important local files:

- [`index.html`](/Users/tes/womens%20convention%202026/index.html)
- [`admin.html`](/Users/tes/womens%20convention%202026/admin.html)
- [`login.html`](/Users/tes/womens%20convention%202026/login.html)
- [`assets/css/styles.css`](/Users/tes/womens%20convention%202026/assets/css/styles.css)
- [`assets/js/main.js`](/Users/tes/womens%20convention%202026/assets/js/main.js)
- [`assets/js/admin.js`](/Users/tes/womens%20convention%202026/assets/js/admin.js)
- [`assets/js/login.js`](/Users/tes/womens%20convention%202026/assets/js/login.js)
- [`functions/api/content.js`](/Users/tes/womens%20convention%202026/functions/api/content.js)
- [`functions/api/upload.js`](/Users/tes/womens%20convention%202026/functions/api/upload.js)
- [`functions/api/login.js`](/Users/tes/womens%20convention%202026/functions/api/login.js)
- [`functions/admin.html.js`](/Users/tes/womens%20convention%202026/functions/admin.html.js)
- [`functions/_lib/content-store.js`](/Users/tes/womens%20convention%202026/functions/_lib/content-store.js)
- [`functions/_lib/auth.js`](/Users/tes/womens%20convention%202026/functions/_lib/auth.js)
- [`functions/_lib/default-content.js`](/Users/tes/womens%20convention%202026/functions/_lib/default-content.js)
- [`schema/database.sql`](/Users/tes/womens%20convention%202026/schema/database.sql)
- [`wrangler.toml`](/Users/tes/womens%20convention%202026/wrangler.toml)
- [`CLOUDFLARE_SETUP.md`](/Users/tes/womens%20convention%202026/CLOUDFLARE_SETUP.md)
- [`README.md`](/Users/tes/womens%20convention%202026/README.md)

## Cloudflare Resources Created

These were created in the user's Cloudflare account:

### R2 Bucket

- Bucket name:
  `aoh-womens-convention-media`

- Public Development URL enabled:
  `https://pub-b3b93974fe9544bd9e4ebccbe6725604.r2.dev`

This value was saved into:

- [`wrangler.toml`](/Users/tes/womens%20convention%202026/wrangler.toml)
- [`.dev.vars.example`](/Users/tes/womens%20convention%202026/.dev.vars.example)

### D1 Database

- Database name:
  `aoh_womens_convention_db`

- Database ID:
  `35b81cc5-59fa-4fba-ab5b-dfef19a1c5b4`

This value was saved into:

- [`wrangler.toml`](/Users/tes/womens%20convention%202026/wrangler.toml)

## Values Now Stored in wrangler.toml

Current Cloudflare values set in [`wrangler.toml`](/Users/tes/womens%20convention%202026/wrangler.toml):

- `database_name = "aoh_womens_convention_db"`
- `database_id = "35b81cc5-59fa-4fba-ab5b-dfef19a1c5b4"`
- `bucket_name = "aoh-womens-convention-media"`
- `R2_PUBLIC_BASE_URL = "https://pub-b3b93974fe9544bd9e4ebccbe6725604.r2.dev"`

## Admin User Hash Generated

An admin SQL insert statement was generated locally using:

```bash
npm run create-admin-sql -- admin "Pick-A-Strong-Password"
```

Generated SQL:

```sql
INSERT INTO admin_users (username, password_hash, display_name) VALUES ('admin', 'pbkdf2$120000$bb5a486d1357878c895f19784f98b2f9$pJcZuXaInli-tLRe9x5CYYcDAjlKEfMaOECqzdQ4o4g', 'AOH Admin');
```

## Commands Attempted

### Successful command

This command successfully generated the admin SQL:

```bash
cd '/Users/tes/womens convention 2026'
npm run create-admin-sql -- admin "Pick-A-Strong-Password"
```

### Commands that failed

Raw SQL was pasted directly into Terminal by itself. That failed because SQL is not a shell command:

```sql
INSERT INTO admin_users (username, password_hash, display_name) VALUES ('admin', 'pbkdf2$120000$bb5a486d1357878c895f19784f98b2f9$pJcZuXaInli-tLRe9x5CYYcDAjlKEfMaOECqzdQ4o4g', 'AOH Admin');
```

This also failed because it ran against the local database and the tables were not created there:

```bash
npx wrangler d1 execute aoh_womens_convention_db --command "INSERT INTO admin_users (username, password_hash, display_name) VALUES ('admin', 'pbkdf2$120000$bb5a486d1357878c895f19784f98b2f9$pJcZuXaInli-tLRe9x5CYYcDAjlKEfMaOECqzdQ4o4g', 'AOH Admin');"
```

Error seen:

- `no such table: admin_users`

This happened because the schema had not been run yet, and also because `--remote` was missing.

Another attempt failed because the command was split across lines:

```bash
npx wrangler d1 execute aoh_womens_convention_db --remote --file=./schema/
database.sql
```

Error seen:

- `Unable to read SQL text file "./schema/"`
- `zsh: command not found: database.sql`

This happened because the file path must stay on one line:

Correct version:

```bash
npx wrangler d1 execute aoh_womens_convention_db --remote --file=./schema/database.sql
```

Another attempt failed because the `--command` text was split onto a new line.

## What Still Needs To Be Done

These steps are still not finished:

1. Run the D1 schema on the remote database:

```bash
npx wrangler d1 execute aoh_womens_convention_db --remote --file=./schema/database.sql
```

2. Insert the admin user on the remote database:

```bash
npx wrangler d1 execute aoh_womens_convention_db --remote --command "INSERT INTO admin_users (username, password_hash, display_name) VALUES ('admin', 'pbkdf2$120000$bb5a486d1357878c895f19784f98b2f9$pJcZuXaInli-tLRe9x5CYYcDAjlKEfMaOECqzdQ4o4g', 'AOH Admin');"
```

3. Create the Cloudflare Pages project
4. Add the D1 binding `DB`
5. Add the R2 binding `MEDIA_BUCKET`
6. Add the secret `SESSION_SECRET`
7. Optionally add Turnstile keys
8. Deploy the site
9. Test:
   - `/login.html`
   - `/admin.html`
   - file upload
   - save draft
   - preview
   - publish

## Most Important Reminder

When using the `wrangler d1 execute` commands:

- Paste each command as one single line
- Do not split `--file=./schema/database.sql`
- Do not paste raw SQL directly into Terminal by itself
