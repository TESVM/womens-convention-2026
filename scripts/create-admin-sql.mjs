import { pbkdf2Sync, randomBytes } from "node:crypto";

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error('Usage: node ./scripts/create-admin-sql.mjs admin "Your-Password"');
  process.exit(1);
}

const iterations = 120000;
const salt = randomBytes(16).toString("hex");
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256")
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/g, "");

const passwordHash = `pbkdf2$${iterations}$${salt}$${hash}`;
const sql = `INSERT INTO admin_users (username, password_hash, display_name) VALUES ('${username.replace(/'/g, "''")}', '${passwordHash}', 'AOH Admin');`;

console.log("");
console.log("Copy this SQL command:");
console.log(sql);
console.log("");
