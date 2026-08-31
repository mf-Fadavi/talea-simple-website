import { writeFile, mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "out");
const defaultLocale = "en";

async function main() {
  try {
    await access(outDir);
  } catch {
    console.log("No out/ directory found, skipping root redirect (not a static export build).");
    return;
  }

  const basePath = process.env.GITHUB_PAGES === "true" ? "/talea-simple-website" : "";
  const target = `${basePath}/${defaultLocale}/`;

  const html = `<!doctype html>
<html lang="${defaultLocale}">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="canonical" href="${target}">
<script>window.location.replace(${JSON.stringify(target)});</script>
</head>
<body></body>
</html>
`;

  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "index.html"), html, "utf-8");
  console.log(`Wrote out/index.html redirecting to ${target}`);
}

main();
