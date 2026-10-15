import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
});
const report = [];
for (const width of [1440, 768, 375]) {
  const page = await browser.newPage({
    viewport: { width, height: width === 1440 ? 1000 : 900 },
  });
  await page.addInitScript(() => {
    window.__layoutShifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.__layoutShifts.push(entry.value);
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document
      .querySelectorAll('[data-reveal]')
      .forEach((node) => node.classList.add('revealed'));
  });
  await page.waitForTimeout(650);
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = 'eager';
    await Promise.all(
      [...document.images].map((image) => image.decode().catch(() => {})),
    );
  });
  await page.screenshot({
    path: `artifacts/home-${width}.png`,
    fullPage: true,
  });
  report.push(
    await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      cls: window.__layoutShifts.reduce((a, b) => a + b, 0),
      islands: document.querySelectorAll('astro-island').length,
      scripts: [...document.scripts]
        .filter((s) => s.type !== 'application/ld+json')
        .map((s) => s.src),
      images: [...document.images].map((img) => ({
        width: img.clientWidth,
        naturalWidth: img.naturalWidth,
        loading: img.loading,
        source: img.currentSrc,
      })),
      resources: performance
        .getEntriesByType('resource')
        .map((r) => ({ url: r.name, size: r.transferSize })),
    })),
  );
  for (const route of [
    '/tentang-kami',
    '/operasi',
    '/keberlanjutan',
    '/proyek',
    '/proyek/perencanaan-tambang',
    '/berita',
    '/berita/keselamatan-dimulai-dari-perencanaan',
    '/karier',
    '/kontak',
    '/privasi',
    '/cookie',
    '/404.html',
  ]) {
    await page.goto(`http://127.0.0.1:4321${route}`, {
      waitUntil: 'networkidle',
    });
    await page.evaluate(async () => {
      document
        .querySelectorAll('[data-reveal]')
        .forEach((node) => node.classList.add('revealed'));
      for (const img of document.images) img.loading = 'eager';
      await Promise.all(
        [...document.images].map((img) => img.decode().catch(() => {})),
      );
    });
    await page.waitForTimeout(750);
    await page.screenshot({
      path: `artifacts/${route.slice(1).replaceAll('/', '-')}-${width}.png`,
      fullPage: true,
    });
  }
  await page.close();
}
await writeFile(
  'artifacts/performance-basics.json',
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify(
    report.map((r) => ({
      width: r.width,
      scrollWidth: r.scrollWidth,
      cls: r.cls,
      islands: r.islands,
      transferredKB: Math.round(
        r.resources.reduce((sum, item) => sum + item.size, 0) / 1024,
      ),
    })),
    null,
    2,
  ),
);
await browser.close();
