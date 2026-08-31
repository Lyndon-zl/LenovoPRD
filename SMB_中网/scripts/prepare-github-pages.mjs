#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
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

for (const path of collectTextFiles(output)) {
  const source = readFileSync(path, "utf8");
  const updated = source.replace(rootAssetPattern, (_, prefix) => {
    replacements += 1;
    return `${prefix}${base}assets/`;
  });

  if (updated !== source) writeFileSync(path, updated);
}

if (replacements === 0) {
  throw new Error("No root-relative asset URLs were found in the Pages bundle.");
}

console.log(`Rewrote ${replacements} asset URLs for ${base}.`);
