# AOH Women's Convention 2026

Lightweight Cloudflare Pages project for the AOH Women's Convention 2026 public website and admin portal.

The public site keeps the downloaded source design intact and adds:

- Cloudflare Pages hosting
- Pages Functions API routes
- D1 for editable text and schedule data
- R2 for logos, banners, gallery images, PDFs, and documents
- Session-based admin authentication
- Optional Cloudflare Turnstile on login
- Draft and publish workflow

## Project Structure

```text
/index.html
/admin.html
/login.html
/assets/css/styles.css
/assets/js/main.js
/assets/js/admin.js
/assets/js/login.js
/functions/api/content.js
/functions/api/upload.js
/functions/api/login.js
/schema/database.sql
/wrangler.toml
```

## Local Preview

From the project folder:

```bash
npm run serve
```

Then open `http://127.0.0.1:3010`.

## Cloudflare Setup

### 1. Create the Cloudflare Pages project

1. In Cloudflare, create a new Pages project.
2. Connect this repository or upload the directory directly.
3. Use these build settings:

```text
Build command: npm run build
Build output directory: .
Root directory: /
```

The site is static, so the build step only confirms the files are ready.

### 2. Create the R2 bucket

Create an R2 bucket named:

```text
aoh-womens-convention-media
```

Enable public access through a custom domain or the public bucket URL, then copy that base URL for `R2_PUBLIC_BASE_URL`.

### 3. Create the D1 database

Create a D1 database named:

```text
aoh_womens_convention_db
```

### 4. Connect R2 and D1 to Pages Functions

Update [wrangler.toml](./wrangler.toml) with the real D1 database ID.

In Cloudflare Pages project settings, add:

- D1 binding: `DB`
- R2 binding: `MEDIA_BUCKET`

### 5. Add environment variables and secrets

Add these to the Pages project:

Public variable:

```text
R2_PUBLIC_BASE_URL=https://your-public-r2-domain
TURNSTILE_SITE_KEY=your-turnstile-site-key
```

Secrets:

```text
SESSION_SECRET=long-random-secret
TURNSTILE_SECRET_KEY=your-turnstile-secret
```

If you do not want Turnstile yet, leave both Turnstile values empty.

### 6. Run the D1 schema

Apply the schema:

```bash
npx wrangler d1 execute aoh_womens_convention_db --file=./schema/database.sql
```

### 7. Create the admin user

Generate a password hash:

```bash
npm run hash-password -- "your-strong-password"
```

Insert the admin user:

```bash
npx wrangler d1 execute aoh_womens_convention_db --command \
"INSERT INTO admin_users (username, password_hash, display_name) VALUES ('admin', 'PASTE_HASH_HERE', 'AOH Admin');"
```

### 8. Deploy the website

Push to the connected repository or deploy from the Cloudflare dashboard.

### 9. Test the admin portal

1. Open `/login.html`.
2. Sign in with the admin credentials.
3. Open `/admin.html`.
4. Confirm the dashboard loads current content.

### 10. Upload a test image

1. In Media Manager, choose a media slot and category.
2. Select a `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`, or `.pdf`.
3. Upload the file.
4. Confirm the preview and returned URL appear.

### 11. Update the public website from the admin portal

1. Edit content in the General, Hero, Schedule, Hotel, or Contact sections.
2. Click `Save Draft`.
3. Click `Preview Website` to open `/?preview=1`.
4. Click `Publish Changes` when ready.

## Notes

- Admin API routes require a signed session cookie.
- R2 uploads always go through the backend.
- Public content is cached for five minutes.
- Duplicate uploads are avoided through SHA-256 checksums.
- If the API is unavailable, the public site falls back to the original hardcoded content.
- The legacy React files in `src/` are not used by the Cloudflare Pages version.
