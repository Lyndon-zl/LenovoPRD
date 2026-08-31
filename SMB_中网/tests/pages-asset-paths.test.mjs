import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist/client");
const textExtensions = new Set([".css", ".html", ".js", ".mjs"]);
const rootAssetPattern = /(^|[^A-Za-z0-9_./-])\/assets\//;

function collectTextFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTextFiles(path);
    return textExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

test("GitHub Pages bundle contains no root-relative asset URLs", () => {
  const files = collectTextFiles(output);
  const contents = files.map((path) => readFileSync(path, "utf8"));
  const offenders = files
    .filter((_, index) => rootAssetPattern.test(contents[index]))
    .map((path) => path.slice(output.length + 1));

  assert.deepEqual(offenders, []);
  assert.ok(contents.some((content) => content.includes("/LenovoPRD/assets/products/thinkpad-t14p-gen3.png")));
  assert.ok(contents.some((content) => content.includes("/LenovoPRD/assets/iphone/Bezel.png")));
  const indexHtml = readFileSync(join(output, "index.html"), "utf8");
  assert.match(indexHtml, /\/LenovoPRD\/assets\/index-[^"/]+-pages-[0-9a-f]{8}\.js/);
});
