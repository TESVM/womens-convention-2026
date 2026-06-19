async function fetchSession() {
  const response = await fetch("/api/login", { credentials: "include" });
  if (!response.ok) return { loggedIn: false };
  return response.json();
}

function getRedirectTarget() {
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  return redirect || "/admin.html";
}

function readTurnstileToken() {
  const field = document.querySelector('[name="cf-turnstile-response"]');
  return field ? field.value : "";
}

async function init() {
  const session = await fetchSession();
  if (session.loggedIn) {
    window.location.href = getRedirectTarget();
    return;
  }

  const form = document.getElementById("loginForm");
  const status = document.getElementById("loginStatus");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Signing in...";

    const payload = Object.fromEntries(new FormData(form));
    payload.turnstileToken = readTurnstileToken();

    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      status.textContent = result.error || "Unable to sign in.";
      return;
    }

    status.textContent = "Signed in. Redirecting...";
    window.location.href = getRedirectTarget();
  });

  if (session.turnstileSiteKey) {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) {
        window.turnstile.render("#turnstileContainer", {
          sitekey: session.turnstileSiteKey
        });
      }
    };
    document.head.appendChild(script);
  }
}

init();
