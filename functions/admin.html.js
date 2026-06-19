import { readSession } from "./_lib/auth.js";

export async function onRequest(context) {
  const session = await readSession(context.request, context.env.SESSION_SECRET);
  if (!session) {
    return Response.redirect(new URL("/login.html?redirect=/admin.html", context.request.url), 302);
  }
  return context.next();
}
