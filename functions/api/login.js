import {
  buildSessionCookie,
  clearSessionCookie,
  createSessionCookie,
  verifyPassword,
  verifyTurnstile,
  readSession
} from "../_lib/auth.js";
import { json } from "../_lib/content-store.js";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  if (url.searchParams.get("action") === "logout") {
    return json(
      { success: true, loggedIn: false },
      { headers: { "Set-Cookie": clearSessionCookie() } }
    );
  }

  const session = await readSession(context.request, context.env.SESSION_SECRET);
  return json({
    success: true,
    loggedIn: Boolean(session),
    user: session || null,
    turnstileSiteKey: context.env.TURNSTILE_SITE_KEY || ""
  });
}

export async function onRequestPost(context) {
  const contentType = context.request.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await context.request.json()
    : Object.fromEntries(await context.request.formData());

  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  const turnstileToken = String(body.turnstileToken || "");

  if (!username || !password) {
    return json({ success: false, error: "Username and password are required." }, { status: 400 });
  }

  const turnstileValid = await verifyTurnstile(
    turnstileToken,
    context.env.TURNSTILE_SECRET_KEY,
    context.request.headers.get("CF-Connecting-IP") || ""
  );
  if (!turnstileValid) {
    return json({ success: false, error: "Turnstile verification failed." }, { status: 400 });
  }

  const user = await context.env.DB.prepare(
    "SELECT username, display_name, password_hash FROM admin_users WHERE username = ?1 LIMIT 1"
  )
    .bind(username)
    .first();

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return json({ success: false, error: "Invalid username or password." }, { status: 401 });
  }

  const token = await createSessionCookie(user, context.env.SESSION_SECRET);
  return json(
    { success: true, loggedIn: true, user: { username: user.username, name: user.display_name } },
    { headers: { "Set-Cookie": buildSessionCookie(token) } }
  );
}
