import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.mjs \"your-password\"");
  process.exit(1);
}

const iterations = 120000;
const salt = randomBytes(16).toString("hex");
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256")
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/g, "");

console.log(`pbkdf2$${iterations}$${salt}$${hash}`);
