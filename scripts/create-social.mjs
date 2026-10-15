import { chromium } from '@playwright/test';
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(
  `<!doctype html><html lang="id"><style>body{margin:0;background:#EEEBDD;color:#1B1717;font-family:Arial,sans-serif;padding:65px;box-sizing:border-box;height:630px;border-bottom:18px solid #810000}.label{font-size:18px;letter-spacing:3px}h1{font-size:85px;line-height:1.04;letter-spacing:-4px;font-weight:500;margin:65px 0 35px}.brand{font-weight:bold;font-size:23px}span{color:#810000}</style><body><div class="label">PT AHLI MAJU · MINING & RESOURCES</div><h1>Menggali potensi.<br>Membangun <span>masa depan.</span></h1><div class="brand">BUMI. MANUSIA. MASA DEPAN.</div></body></html>`,
);
await page.screenshot({ path: 'public/social-card.png' });
await browser.close();
