import { cloneDefaultContent } from "./default-content.js";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function nowIso() {
  return new Date().toISOString();
}

function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers || {}) }
  });
}

export async function getContent(env, mode = "published") {
  const content = cloneDefaultContent();
  const valueColumn = mode === "preview" ? "draft_value" : "published_value";
  const sectionColumn = mode === "preview" ? "draft_content" : "published_content";

  const settingsRows = await env.DB.prepare(
    `SELECT key, ${valueColumn} AS value FROM site_settings`
  ).all();
  for (const row of settingsRows.results || []) {
    if (row.key in content.site) content.site[row.key] = row.value || content.site[row.key];
  }

  const sectionRows = await env.DB.prepare(
    `SELECT key, ${sectionColumn} AS value FROM sections WHERE page_slug = 'home'`
  ).all();
  for (const row of sectionRows.results || []) {
    const parsed = parseJson(row.value, {});
    if (Array.isArray(parsed)) {
      content[row.key] = parsed;
    } else {
      content[row.key] = { ...(content[row.key] || {}), ...parsed };
    }
  }

  const mediaRows = await env.DB.prepare(
    `SELECT key, COALESCE(${mode === "preview" ? "draft_url" : "published_url"}, draft_url, published_url) AS url
     FROM media_assets`
  ).all();
  for (const row of mediaRows.results || []) {
    if (row.key) content.media[row.key] = row.url || "";
  }

  const pageRow = await env.DB.prepare(
    "SELECT last_updated_at, last_published_at FROM pages WHERE slug = 'home' LIMIT 1"
  ).first();
  content.site.lastUpdated =
    mode === "preview" ? pageRow?.last_updated_at || "" : pageRow?.last_published_at || "";

  return content;
}

async function saveSiteSettings(env, site) {
  const keys = Object.keys(site || {});
  for (const key of keys) {
    const value = site[key] == null ? "" : String(site[key]);
    await env.DB.prepare(
      `INSERT INTO site_settings (key, draft_value, published_value, updated_at)
       VALUES (?1, ?2, COALESCE((SELECT published_value FROM site_settings WHERE key = ?1), ''), ?3)
       ON CONFLICT(key) DO UPDATE SET draft_value = excluded.draft_value, updated_at = excluded.updated_at`
    )
      .bind(key, value, nowIso())
      .run();
  }
}

async function saveSections(env, content) {
  const sectionKeys = [
    "hero",
    "about",
    "themeBand",
    "schedule",
    "register",
    "hotel",
    "gallery",
    "contact"
  ];
  for (const key of sectionKeys) {
    const draftContent = JSON.stringify(content[key] || {});
    await env.DB.prepare(
      `INSERT INTO sections (page_slug, key, draft_content, published_content, updated_at)
       VALUES ('home', ?1, ?2, COALESCE((SELECT published_content FROM sections WHERE page_slug = 'home' AND key = ?1), '{}'), ?3)
       ON CONFLICT(page_slug, key) DO UPDATE SET draft_content = excluded.draft_content, updated_at = excluded.updated_at`
    )
      .bind(key, draftContent, nowIso())
      .run();
  }

  for (const key of ["testimonials", "faq"]) {
    const draftContent = JSON.stringify(content[key] || []);
    await env.DB.prepare(
      `INSERT INTO sections (page_slug, key, draft_content, published_content, updated_at)
       VALUES ('home', ?1, ?2, COALESCE((SELECT published_content FROM sections WHERE page_slug = 'home' AND key = ?1), '[]'), ?3)
       ON CONFLICT(page_slug, key) DO UPDATE SET draft_content = excluded.draft_content, updated_at = excluded.updated_at`
    )
      .bind(key, draftContent, nowIso())
      .run();
  }
}

async function saveSchedule(env, schedule) {
  await env.DB.prepare("DELETE FROM schedule_items").run();
  const insert = env.DB.prepare(
    `INSERT INTO schedule_items (
      day_key, sort_order, draft_time, draft_title, draft_description,
      published_time, published_title, published_description, updated_at
    ) VALUES (?1, ?2, ?3, ?4, ?5, '', '', '', ?6)`
  );
  for (const day of schedule.days || []) {
    for (const [index, item] of (day.items || []).entries()) {
      await insert
        .bind(
          day.key,
          index,
          item.time || "",
          item.title || "",
          item.description || "",
          nowIso()
        )
        .run();
    }
  }
}

async function saveMedia(env, media) {
  for (const [key, url] of Object.entries(media || {})) {
    await env.DB.prepare(
      `INSERT INTO media_assets (
        key, category, draft_url, published_url, file_name, mime_type, size_bytes, checksum, updated_at, created_at
      ) VALUES (
        ?1, COALESCE((SELECT category FROM media_assets WHERE key = ?1), 'misc'),
        ?2, COALESCE((SELECT published_url FROM media_assets WHERE key = ?1), ''),
        COALESCE((SELECT file_name FROM media_assets WHERE key = ?1), ''),
        COALESCE((SELECT mime_type FROM media_assets WHERE key = ?1), ''),
        COALESCE((SELECT size_bytes FROM media_assets WHERE key = ?1), 0),
        COALESCE((SELECT checksum FROM media_assets WHERE key = ?1), ''),
        ?3, COALESCE((SELECT created_at FROM media_assets WHERE key = ?1), ?3)
      )
      ON CONFLICT(key) DO UPDATE SET draft_url = excluded.draft_url, updated_at = excluded.updated_at`
    )
      .bind(key, url || "", nowIso())
      .run();
  }
}

export async function saveDraft(env, content) {
  await saveSiteSettings(env, content.site || {});
  await saveSections(env, content);
  await saveSchedule(env, content.schedule || { days: [] });
  await saveMedia(env, content.media || {});
  await env.DB.prepare(
    `INSERT INTO pages (slug, title, status, last_updated_at, last_published_at)
     VALUES ('home', ?1, 'draft', ?2, COALESCE((SELECT last_published_at FROM pages WHERE slug = 'home'), ''))
     ON CONFLICT(slug) DO UPDATE SET title = excluded.title, status = 'draft', last_updated_at = excluded.last_updated_at`
  )
    .bind(content.site?.title || "AOH Women's Convention 2026", nowIso())
    .run();
}

export async function publishDraft(env) {
  await env.DB.prepare(
    "UPDATE site_settings SET published_value = draft_value, updated_at = ?1"
  )
    .bind(nowIso())
    .run();
  await env.DB.prepare(
    "UPDATE sections SET published_content = draft_content, updated_at = ?1"
  )
    .bind(nowIso())
    .run();
  await env.DB.prepare(
    `UPDATE schedule_items
     SET published_time = draft_time, published_title = draft_title,
         published_description = draft_description, updated_at = ?1`
  )
    .bind(nowIso())
    .run();
  await env.DB.prepare(
    "UPDATE media_assets SET published_url = draft_url, updated_at = ?1"
  )
    .bind(nowIso())
    .run();
  const titleRow = await env.DB.prepare(
    "SELECT draft_value FROM site_settings WHERE key = 'title' LIMIT 1"
  ).first();
  await env.DB.prepare(
    `INSERT INTO pages (slug, title, status, last_updated_at, last_published_at)
     VALUES ('home', ?2, 'published', ?1, ?1)
     ON CONFLICT(slug) DO UPDATE SET title = ?2, status = 'published', last_updated_at = ?1, last_published_at = ?1`
  )
    .bind(nowIso(), titleRow?.draft_value || "AOH Women's Convention 2026")
    .run();
}
