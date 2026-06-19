import { requireSession } from "../_lib/auth.js";
import { json } from "../_lib/content-store.js";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "svg", "pdf"]);
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf"
]);

const CATEGORY_PATHS = {
  logos: "logos",
  banners: "banners",
  leaders: "leaders",
  gallery: "gallery",
  pdfs: "pdfs",
  documents: "pdfs"
};

function extensionOf(fileName) {
  return String(fileName || "")
    .split(".")
    .pop()
    .toLowerCase();
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function checksum(buffer) {
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function onRequestPost(context) {
  const session = await requireSession(context);
  if (session instanceof Response) return session;

  const formData = await context.request.formData();
  const file = formData.get("file");
  const category = String(formData.get("category") || "gallery");
  const mediaKey = String(formData.get("mediaKey") || "");

  if (!(file instanceof File)) {
    return json({ success: false, error: "No file uploaded." }, { status: 400 });
  }

  const extension = extensionOf(file.name);
  if (!ALLOWED_EXTENSIONS.has(extension) || !ALLOWED_MIME.has(file.type)) {
    return json({ success: false, error: "Unsupported file type." }, { status: 400 });
  }

  const maxBytes = extension === "pdf" ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return json({ success: false, error: "File exceeds the size limit." }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const hash = await checksum(buffer);
  const existing = await context.env.DB.prepare(
    "SELECT key, draft_url, published_url FROM media_assets WHERE checksum = ?1 LIMIT 1"
  )
    .bind(hash)
    .first();
  if (existing) {
    const resolvedKey = mediaKey || existing.key;
    const resolvedUrl = existing.draft_url || existing.published_url || "";
    if (mediaKey && mediaKey !== existing.key) {
      await context.env.DB.prepare(
        `INSERT INTO media_assets (
          key, category, draft_url, published_url, file_name, mime_type, size_bytes, checksum, updated_at, created_at
        ) VALUES (?1, ?2, ?3, '', ?4, ?5, ?6, ?7, ?8, ?8)
        ON CONFLICT(key) DO UPDATE SET
          category = excluded.category,
          draft_url = excluded.draft_url,
          file_name = excluded.file_name,
          mime_type = excluded.mime_type,
          size_bytes = excluded.size_bytes,
          checksum = excluded.checksum,
          updated_at = excluded.updated_at`
      )
        .bind(
          mediaKey,
          category,
          resolvedUrl,
          file.name,
          file.type,
          file.size,
          hash,
          new Date().toISOString()
        )
        .run();
    }
    return json({
      success: true,
      deduplicated: true,
      url: resolvedUrl,
      mediaKey: resolvedKey
    });
  }

  const folder = CATEGORY_PATHS[category] || "gallery";
  const cleanName = slugify(file.name.replace(/\.[^.]+$/, "")) || "upload";
  const objectKey = `womens-convention-2026/${folder}/${cleanName}-${hash.slice(0, 12)}.${extension}`;

  await context.env.MEDIA_BUCKET.put(objectKey, buffer, {
    httpMetadata: { contentType: file.type }
  });

  const publicBase = String(context.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const url = publicBase ? `${publicBase}/${objectKey}` : `/${objectKey}`;
  const storedKey = mediaKey || cleanName;

  await context.env.DB.prepare(
    `INSERT INTO media_assets (
      key, category, draft_url, published_url, file_name, mime_type, size_bytes, checksum, updated_at, created_at
    ) VALUES (?1, ?2, ?3, '', ?4, ?5, ?6, ?7, ?8, ?8)
    ON CONFLICT(key) DO UPDATE SET
      category = excluded.category,
      draft_url = excluded.draft_url,
      file_name = excluded.file_name,
      mime_type = excluded.mime_type,
      size_bytes = excluded.size_bytes,
      checksum = excluded.checksum,
      updated_at = excluded.updated_at`
  )
    .bind(storedKey, category, url, file.name, file.type, file.size, hash, new Date().toISOString())
    .run();

  return json({
    success: true,
    url,
    mediaKey: storedKey,
    fileName: file.name,
    size: file.size,
    type: file.type
  });
}
