/**
 * Renders /og with a real browser and saves it as public/og.jpg, the image
 * WhatsApp and other apps show when the invitation link is shared.
 *
 * Using the browser (instead of drawing the image by hand) means the share card
 * always matches the invitation itself: same webfonts, palette and floral art.
 *
 * Usage: start the dev server, then `node scripts/make-og.mjs`
 */
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "public", "og.jpg");
const url = process.env.OG_URL ?? "http://localhost:4321/og";

const executablePath =
  process.env.CHROME_PATH ??
  ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].find(
    (p) => {
      try {
        return require("node:fs").existsSync(p);
      } catch {
        return false;
      }
    }
  );

const browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2, // crisp on retina timelines
});

await page.goto(url, { waitUntil: "networkidle" });

// the Astro dev toolbar is injected in dev mode only, but it would land in the
// screenshot, so hide it before capturing
await page.addStyleTag({ content: "astro-dev-toolbar { display: none !important; }" });

await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

await page.locator("#og-card").screenshot({ path: out, quality: 88, type: "jpeg" });
await browser.close();

console.log("wrote", out);
