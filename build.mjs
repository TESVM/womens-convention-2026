import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { build } from "esbuild";

await build({
  entryPoints: ["./src/main.jsx"],
  bundle: true,
  format: "esm",
  target: ["es2020"],
  outfile: "./app.js",
  loader: {
    ".svg": "file",
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".webp": "file"
  },
  assetNames: "assets/[name]-[hash]",
  jsx: "automatic"
});

const tailwindBinary =
  process.platform === "win32"
    ? existsSync(".\\node_modules\\.bin\\tailwindcss.cmd")
      ? ".\\node_modules\\.bin\\tailwindcss.cmd"
      : "..\\node_modules\\.bin\\tailwindcss.cmd"
    : existsSync("./node_modules/.bin/tailwindcss")
      ? "./node_modules/.bin/tailwindcss"
      : "../node_modules/.bin/tailwindcss";

const tailwindCommand = `${tailwindBinary} -i ./src/index.css -o ./styles.css --minify`;

execSync(tailwindCommand, {
  cwd: process.cwd(),
  stdio: "inherit"
});
