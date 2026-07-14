// Fetches real, hotlinkable artwork images from the Met Museum's open-access
// API (no key required) and writes a flat JSON dataset the app can import.
// Run with: node scripts/fetch-artworks.mjs

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SEARCH_URL = "https://collectionapi.metmuseum.org/public/collection/v1/search";
const OBJECT_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

const QUERIES = [
  { term: "african art", category: "african-art" },
  { term: "painting", category: "painting" },
  { term: "sculpture", category: "sculpture" },
  { term: "textile", category: "textile" },
  { term: "ceramics", category: "ceramics" },
];

const PER_QUERY_TARGET = 9; // aim for ~9 verified works per query => 45 total
const MAX_CANDIDATES_PER_QUERY = 40; // give up after checking this many IDs
const REQUEST_DELAY_MS = 60; // stay well under the Met API's rate limit

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.json();
}

async function imageIsReachable(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) return true;
    // Some CDNs reject HEAD; fall back to a ranged GET.
    if (res.status === 405 || res.status === 403) {
      const rangedRes = await fetch(url, { headers: { Range: "bytes=0-0" } });
      return rangedRes.ok || rangedRes.status === 206;
    }
    return false;
  } catch {
    return false;
  }
}

function randomPrice() {
  const min = 50_000;
  const max = 2_000_000;
  const raw = Math.random() * (max - min) + min;
  return Math.round(raw / 5_000) * 5_000; // round to nearest ₦5,000
}

async function collectForQuery({ term, category }, seenObjectIDs) {
  console.log(`\n[search] "${term}"`);
  const { objectIDs } = await fetchJson(
    `${SEARCH_URL}?q=${encodeURIComponent(term)}&hasImages=true`
  );

  if (!objectIDs || objectIDs.length === 0) {
    console.log(`  no results for "${term}"`);
    return [];
  }

  const candidates = objectIDs.slice(0, MAX_CANDIDATES_PER_QUERY);
  const results = [];

  for (const objectID of candidates) {
    if (results.length >= PER_QUERY_TARGET) break;

    if (seenObjectIDs.has(objectID)) {
      console.log(`  [skip] ${objectID}: already collected under another query`);
      continue;
    }

    await sleep(REQUEST_DELAY_MS);
    let obj;
    try {
      obj = await fetchJson(`${OBJECT_URL}/${objectID}`);
    } catch (err) {
      console.log(`  [skip] ${objectID}: fetch failed (${err.message})`);
      continue;
    }

    const image = obj.primaryImageSmall;
    if (!image || typeof image !== "string" || image.trim() === "") {
      console.log(`  [skip] ${objectID}: no primaryImageSmall`);
      continue;
    }

    const reachable = await imageIsReachable(image);
    if (!reachable) {
      console.log(`  [skip] ${objectID}: image URL not reachable`);
      continue;
    }

    seenObjectIDs.add(objectID);
    results.push({
      id: `met-${objectID}`,
      title: obj.title?.trim() || "Untitled",
      artist: obj.artistDisplayName?.trim() || "Unknown Artist",
      image,
      imageLarge: obj.primaryImage || image,
      medium: obj.medium?.trim() || "",
      year: obj.objectDate?.trim() || "",
      culture: obj.culture?.trim() || "",
      price: randomPrice(),
      category,
    });
    console.log(`  [ok]   ${objectID}: ${obj.title}`);
  }

  return results;
}

async function main() {
  const all = [];
  const seenObjectIDs = new Set();
  for (const query of QUERIES) {
    const found = await collectForQuery(query, seenObjectIDs);
    all.push(...found);
  }

  if (all.length < 30) {
    console.warn(`\nWarning: only collected ${all.length} verified artworks (target: 30+).`);
  }

  const outDir = path.join(process.cwd(), "data");
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "artworks.json");
  await writeFile(outPath, JSON.stringify(all, null, 2) + "\n", "utf-8");

  console.log(`\nWrote ${all.length} artworks to ${path.relative(process.cwd(), outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
