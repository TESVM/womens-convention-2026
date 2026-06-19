const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

async function derivePasswordHash(password, salt, iterations) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return toBase64Url(new Uint8Array(bits));
}

export async function verifyPassword(password, storedHash) {
  const [scheme, iterationsText, salt, expected] = String(storedHash || "").split("$");
  if (scheme !== "pbkdf2" || !iterationsText || !salt || !expected) return false;
  const actual = await derivePasswordHash(password, salt, Number(iterationsText));
  return actual === expected;
}

export async function createPasswordHash(password, salt, iterations = 120000) {
  const actualSalt = salt || crypto.randomUUID().replace(/-/g, "");
  const hash = await derivePasswordHash(password, actualSalt, iterations);
  return `pbkdf2$${iterations}$${actualSalt}$${hash}`;
}

export function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const parts = cookieHeader.split(/;\s*/);
  for (const part of parts) {
    const [key, ...rest] = part.split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

export async function createSessionCookie(user, secret) {
  const payload = {
    sub: user.username,
    name: user.display_name || user.username,
    exp: Date.now() + 1000 * 60 * 60 * 12
  };
  const encodedPayload = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await hmac(secret, encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export async function readSession(request, secret) {
  const token = getCookie(request, "aoh_admin_session");
  if (!token || !secret) return null;
  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) return null;
  const expected = await hmac(secret, encodedPayload);
  if (expected !== providedSignature) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload)));
    if (!payload?.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function requireSession(context) {
  const session = await readSession(context.request, context.env.SESSION_SECRET);
  if (!session) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  return session;
}

export function clearSessionCookie() {
  return "aoh_admin_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";
}

export function buildSessionCookie(token) {
  return `aoh_admin_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=43200`;
}

export async function verifyTurnstile(token, secret, ip) {
  if (!secret) return true;
  if (!token) return false;
  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  if (ip) form.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form
  });
  if (!response.ok) return false;
  const result = await response.json();
  return Boolean(result?.success);
}
