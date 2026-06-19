# Cloudflare Setup Guide

This guide is written in plain language.

## What You Already Have

The website files are already built in this folder:

`/Users/tes/womens convention 2026`

That means:

- The public website is ready.
- The admin login page is ready.
- The admin dashboard is ready.
- The Cloudflare backend files are ready.
- The database schema is ready.

What is **not** done yet is the part that has to happen inside **your Cloudflare account**.

## What You Need To Create In Cloudflare

You need 3 things:

1. A **Pages project**
2. An **R2 bucket**
3. A **D1 database**

## Part 1: Create the R2 Bucket

1. Log in to Cloudflare.
2. On the left side, click **R2**.
3. Click **Create bucket**.
4. Name it exactly:

`aoh-womens-convention-media`

5. Click **Create bucket**.

After that:

6. Open the bucket.
7. Find the option for a **public domain** or **custom domain**.
8. Turn that on.
9. Copy the public URL.

You will need that URL later.

## Part 2: Create the D1 Database

1. In Cloudflare, click **Workers & Pages**.
2. Find **D1**.
3. Click **Create database**.
4. Name it exactly:

`aoh_womens_convention_db`

5. Create it.

After that:

6. Open the database.
7. Copy the **Database ID**.

You will paste that into `wrangler.toml`.

## Part 3: Create the Pages Project

1. In Cloudflare, go to **Workers & Pages**.
2. Click **Create application**.
3. Choose **Pages**.
4. Connect your GitHub repo if this project is in GitHub.

If it is not in GitHub yet, you can still upload it later, but GitHub is easier.

## Part 4: Update the Local Config File

Open this file:

[`wrangler.toml`](/Users/tes/womens%20convention%202026/wrangler.toml)

Replace:

- `REPLACE_WITH_D1_DATABASE_ID`
- `https://REPLACE-WITH-YOUR-R2-PUBLIC-DOMAIN`

with your real values from Cloudflare.

## Part 5: Add the Database Tables

Open Terminal and run:

```bash
cd '/Users/tes/womens convention 2026'
npx wrangler d1 execute aoh_womens_convention_db --file=./schema/database.sql
```

This creates the tables your admin panel needs.

## Part 6: Create Your Admin Password

Run this:

```bash
cd '/Users/tes/womens convention 2026'
node ./scripts/create-admin-sql.mjs admin "Pick-A-Strong-Password"
```

That command will print a full SQL line for you.

Copy that SQL line.

Then run it:

```bash
npx wrangler d1 execute aoh_womens_convention_db --command "PASTE_THE_SQL_HERE"
```

Now your admin login will exist.

## Part 7: Add Secrets and Variables in Cloudflare Pages

Inside your Cloudflare Pages project settings, add these:

### Secrets

- `SESSION_SECRET`
- `TURNSTILE_SECRET_KEY` (only if you want Turnstile now)

### Variables

- `R2_PUBLIC_BASE_URL`
- `TURNSTILE_SITE_KEY` (only if you want Turnstile now)

You can use this file as a reminder:

[`/.dev.vars.example`](/Users/tes/womens%20convention%202026/.dev.vars.example)

## Part 8: Add Bindings

Inside the Pages project settings, add:

### D1 Binding

- Binding name: `DB`
- Database: `aoh_womens_convention_db`

### R2 Binding

- Binding name: `MEDIA_BUCKET`
- Bucket: `aoh-womens-convention-media`

## Part 9: Build Settings

In Cloudflare Pages, use:

- Build command: `npm run build`
- Build output directory: `.`

## Part 10: Deploy

After the project is connected and the settings are saved:

1. Trigger a deploy
2. Wait for Cloudflare to finish
3. Open your site URL

## Part 11: Test the Admin

After deploy:

1. Open `/login.html`
2. Sign in with your admin username and password
3. Open `/admin.html`
4. Change a field
5. Click **Save Draft**
6. Click **Preview Website**
7. Click **Publish Changes**

## Part 12: Upload a Test Image

In the admin panel:

1. Go to **Media Manager**
2. Pick a media slot
3. Pick a file
4. Click **Upload New File**
5. Save draft
6. Publish changes

## What I Could Not Do For You

I could not do these parts because they require access to **your Cloudflare account**:

- create the Pages project in Cloudflare
- create the R2 bucket in Cloudflare
- create the D1 database in Cloudflare
- add Cloudflare secrets
- attach Cloudflare bindings
- click the deploy button

## If You Want The Easiest Next Step

Do this first:

1. Create the R2 bucket
2. Create the D1 database
3. Send me the:
   - D1 database ID
   - R2 public URL

Then I can tell you exactly what to paste into `wrangler.toml`.
