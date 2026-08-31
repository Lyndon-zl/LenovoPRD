#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist/client");
const base = process.argv[2] ?? "/LenovoPRD/";
const textExtensions = new Set([".css", ".html", ".js", ".mjs"]);
const rootAssetPattern = /(^|[^A-Za-z0-9_./-])\/assets\//g;

if (!base.startsWith("/") || !base.endsWith("/")) {
  throw new Error(`Pages base must start and end with "/": ${base}`);
}

function collectTextFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTextFiles(path);
    return textExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

let replacements = 0;
const rewrittenJavaScript = [];

for (const path of collectTextFiles(output)) {
  const source = readFileSync(path, "utf8");
  const updated = source.replace(rootAssetPattern, (_, prefix) => {
    replacements += 1;
    return `${prefix}${base}assets/`;
  });

  if (updated !== source) {
    writeFileSync(path, updated);
    if (extname(path) === ".js") rewrittenJavaScript.push(path);
  }
}

if (replacements === 0) {
  throw new Error("No root-relative asset URLs were found in the Pages bundle.");
}

const renamedAssets = rewrittenJavaScript.map((path) => {
  const contents = readFileSync(path);
  const digest = createHash("sha256").update(contents).digest("hex").slice(0, 8);
  const previousName = basename(path);
  const nextName = `${basename(path, ".js")}-pages-${digest}.js`;
  const nextPath = join(dirname(path), nextName);
  renameSync(path, nextPath);
  return { previousName, nextName };
});

for (const path of collectTextFiles(output)) {
  const source = readFileSync(path, "utf8");
  const updated = renamedAssets.reduce(
    (content, { previousName, nextName }) => content.replaceAll(previousName, nextName),
    source,
  );
  if (updated !== source) writeFileSync(path, updated);
}

console.log(
  `Rewrote ${replacements} asset URLs for ${base} and fingerprinted ${renamedAssets.length} scripts.`,
);
