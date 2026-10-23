// Renders a 1200x630 social card for every route into public/og/ (run: pnpm og).
// One composition for the whole site, chosen 2026-10-23 from the "Cozy OG Cards" workbench
// (G5 on deep olive): deep olive ground, the page's ASCII photo screened faintly in paper, the
// word at 132px Departure Mono with an uppercase mono tagline, left-aligned and vertically
// centred; the sketch wordmark behind the text at 28% paper, cropped by the right edge; a white
// inset hairline; the url bottom-left. The route changes the word, the tagline, the url path and
// which photo sits behind (Bates Hall everywhere, the market square on /contact, the plant shop on /pricing, as on the site).
//
// Composed in HTML and screenshotted with Playwright (same Chromium build as the dev checks),
// then written as webp with sharp. Cards are committed; re-run when a route or title changes.
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "public", "og");
const cache = path.join(root, "node_modules", ".cache", "og");
const domain = "cozy.foo";
const tagline = "web design & engineering company"; // under every word, on every card

// ---- routes ------------------------------------------------------------------------------
// word: lowercase mono, the one big line. tag: always the same line, set in uppercase mono.
// photo: a static ASCII fallback under public/hero/. focus: cover-crop focus for the photo.
const routes = [
  { file: "home", path: "", word: "cozy coders", tag: tagline, photo: "bpl-ascii.png" },
  { file: "contact", path: "/contact", word: "contact", tag: tagline, photo: "market-ascii.png", focus: "70% 80%" },
  { file: "resources", path: "/resources", word: "resources", tag: tagline, photo: "bpl-ascii.png" },
  { file: "pricing", path: "/pricing", word: "pricing", tag: tagline, photo: "plant-ascii.png", focus: "50% 60%" },
];
// one card per published resource post: the word is its kind ("video" for type video, "blog" for every written type;
// src/content.config.ts resourceKind), the tagline stays
const dir = path.join(root, "src", "content", "resources");
for (const name of (await fs.readdir(dir)).filter((f) => f.endsWith(".md"))) {
  const fm = (await fs.readFile(path.join(dir, name), "utf8")).split("---")[1] ?? "";
  const get = (k) => fm.match(new RegExp(`^${k}:\\s*"?([^"\\n]*)"?`, "m"))?.[1]?.trim();
  if (get("draft") === "true" || get("href")) continue;
  const slug = name.replace(/\.md$/, "");
  routes.push({ file: `resources/${slug}`, path: `/resources/${slug}`, word: get("type") === "video" ? "video" : "blog", tag: tagline, photo: "bpl-ascii.png" });
}

// ---- assets ------------------------------------------------------------------------------
const wordmark = await fs.readFile(path.join(root, "public", "brand", "cozy-sketch-trace.svg"), "utf8");
const markPath = wordmark.match(/\sd="([^"]+)"/)?.[1] ?? "";
const fileUrl = (p) => pathToFileURL(path.join(root, p)).href;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const html = (r) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  @font-face { font-family: "Departure Mono"; src: url(${fileUrl("public/fonts/DepartureMono-Regular.woff2")}) format("woff2"); }
  html { font-synthesis: none; } html, body { margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #555a32; color: #faf9f6; font-family: "Departure Mono", monospace; }
  .card { position: relative; width: 1200px; height: 630px; padding: 72px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; gap: 28px; }
  .art { position: absolute; inset: 0; background: url(${fileUrl("public/hero/" + r.photo)}) center / cover no-repeat; background-position: ${r.focus ?? "50% 50%"};
    filter: grayscale(1) invert(1) contrast(1.3); mix-blend-mode: screen; opacity: .22; }
  .inset { position: absolute; inset: 16px; border: 1px solid #fff; z-index: 2; }
  .mark { position: absolute; right: -40px; top: 50%; transform: translateY(-50%); height: 560px; width: auto; fill: currentColor; opacity: .28; z-index: 0; }
  .word { position: relative; z-index: 1; margin: 0; font-weight: 400; font-size: 132px; line-height: 132px; word-spacing: -0.35em; letter-spacing: -0.02em; white-space: nowrap; }
  .tag { position: relative; z-index: 1; margin: 0; font-size: 33px; line-height: 44px; text-transform: uppercase; letter-spacing: .08em; color: rgb(250 249 246 / .85); max-width: 900px; text-wrap: balance; }
  .url { position: absolute; left: 72px; bottom: 56px; font-size: 33px; line-height: 33px; color: rgb(250 249 246 / .8); z-index: 1; }
</style></head><body><div class="card">
  <div class="art"></div><div class="inset"></div>
  <svg class="mark" viewBox="0 0 922 845"><path d="${markPath}"/></svg>
  <h1 class="word">${esc(r.word)}</h1>
  <p class="tag">${esc(r.tag)}</p>
  <span class="url">${domain}${esc(r.path)}</span>
</div></body></html>`;

// ---- render ------------------------------------------------------------------------------
await fs.mkdir(cache, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const r of routes) {
  const file = path.join(cache, `${r.file.replace(/\//g, "__")}.html`);
  await fs.writeFile(file, html(r));
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  // align the ink, not the boxes: a glyph's left side bearing scales with its size, so the 132px word
  // starts further right than the 33px tagline. Measure each line's left ink edge and pull it flush.
  await page.evaluate(() => {
    const ctx = document.createElement("canvas").getContext("2d");
    for (const el of document.querySelectorAll(".word, .tag, .url")) {
      const cs = getComputedStyle(el);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const first = (el.textContent ?? "").trim()[0] ?? "";
      const text = cs.textTransform === "uppercase" ? first.toUpperCase() : first;
      const bearing = -ctx.measureText(text).actualBoundingBoxLeft; // px of empty space before the ink
      el.style.marginLeft = `${-bearing}px`;
    }
  });
  const png = await page.screenshot({ type: "png" });
  const dest = path.join(out, `${r.file}.webp`);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await sharp(png).webp({ quality: 88 }).toFile(dest);
  console.log(`${path.relative(root, dest)}  ${Math.round((await fs.stat(dest)).size / 1024)} KB`);
}
await browser.close();
