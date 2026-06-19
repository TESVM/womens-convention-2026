import { requireSession } from "../_lib/auth.js";
import { getContent, json, publishDraft, saveDraft } from "../_lib/content-store.js";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const mode = url.searchParams.get("mode") === "preview" ? "preview" : "published";

  if (mode === "preview") {
    const session = await requireSession(context);
    if (session instanceof Response) return session;
  }

  if (mode === "published") {
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), context.request);
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const content = await getContent(context.env, mode);
    const response = json({ success: true, mode, content }, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" }
    });
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  const content = await getContent(context.env, mode);
  return json({ success: true, mode, content });
}

export async function onRequestPost(context) {
  const session = await requireSession(context);
  if (session instanceof Response) return session;

  const body = await context.request.json();
  const action = body.action || "save-draft";
  const content = body.payload || {};

  if (!content.site) {
    return json({ success: false, error: "Missing content payload." }, { status: 400 });
  }

  await saveDraft(context.env, content);
  if (action === "publish") await publishDraft(context.env);

  const preview = await getContent(context.env, "preview");
  return json({
    success: true,
    action,
    content: preview,
    message: action === "publish" ? "Changes published." : "Draft saved."
  });
}
