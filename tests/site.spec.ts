import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes = [
  '/',
  '/tentang-kami',
  '/operasi',
  '/keberlanjutan',
  '/proyek',
  '/proyek/perencanaan-tambang',
  '/proyek/pengelolaan-operasi',
  '/proyek/pemulihan-lahan',
  '/berita',
  '/berita/keselamatan-dimulai-dari-perencanaan',
  '/berita/air-dan-lahan',
  '/berita/rantai-nilai-mineral',
  '/karier',
  '/kontak',
  '/privasi',
  '/cookie',
  '/404.html',
];
test('all routes have semantic content, no overflow, console failures or accessibility violations', async ({
  page,
}) => {
  test.setTimeout(180_000);
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(message.text());
  });
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');
    await expect(page.locator('link[rel=canonical]')).toHaveCount(1);
    await page.evaluate(() => {
      document
        .querySelectorAll('[data-reveal]')
        .forEach((node) => node.classList.add('revealed'));
    });
    await page.waitForTimeout(650);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      audit.violations,
      JSON.stringify(
        audit.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ),
    ).toEqual([]);
    expect(await page.locator('astro-island').count()).toBe(0);
    await expect
      .poll(
        () =>
          page
            .locator('img')
            .evaluateAll((images) =>
              images.every(
                (image) =>
                  (image as HTMLImageElement).naturalWidth > 0 ||
                  image.getAttribute('loading') === 'lazy',
              ),
            ),
        { message: `Priority images should load on ${route}` },
      )
      .toBe(true);
  }
  expect(failures).toEqual([]);
});
test('navbar keeps its geometry when navigating between home and other pages', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const geometry = () =>
    page.locator('.site-header').evaluate((header) => {
      const bounds = (element: Element | null) => {
        const rect = element!.getBoundingClientRect();
        return [rect.x, rect.y, rect.width, rect.height].map(
          (value) => Math.round(value * 100) / 100,
        );
      };
      return {
        header: bounds(header),
        inner: bounds(header.querySelector('.header-inner')),
        brand: bounds(header.querySelector('.brand')),
        control: bounds(
          header.querySelector(
            getComputedStyle(header.querySelector('.desktop-nav')!).display ===
              'none'
              ? '.menu-toggle'
              : '.desktop-nav',
          ),
        ),
        transition: getComputedStyle(header).viewTransitionName,
      };
    });
  const home = await geometry();
  expect(home.header[3]).toBe(78);
  expect(home.transition).toBe('site-header');
  for (const route of ['/tentang-kami', '/berita', '/404.html', '/']) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    expect(await geometry(), route).toEqual(home);
    await page.evaluate(() => scrollTo(0, 300));
    await expect.poll(geometry).toEqual(home);
  }
});

test('project filters and news search provide results, empty state and reset', async ({
  page,
}) => {
  await page.goto('/proyek');
  await page.getByRole('button', { name: 'Lingkungan', exact: true }).click();
  await expect(page.locator('[data-item]:visible')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Lingkungan', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/berita');
  await page.getByRole('searchbox').fill('tidakadaartikel');
  await expect(page.locator('[data-item]:visible')).toHaveCount(0);
  await expect(page.getByText('Belum ada hasil yang sesuai.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset pencarian' }).click();
  await expect(page.locator('[data-item]:visible')).toHaveCount(3);
  await page.getByRole('searchbox').fill('keselamatan');
  await expect(page.locator('[data-item]:visible')).toHaveCount(1);
  await expect(page.locator('[data-item]')).not.toContainText([
    'Draf internal',
  ]);
});
test('page chapters and article contents navigate below the sticky header', async ({
  page,
}) => {
  await page.goto('/operasi');
  await page.getByRole('link', { name: 'Siklus kerja' }).click();
  await expect(page).toHaveURL(/#siklus$/);
  await expect(page.locator('#siklus h2')).toBeInViewport();
  await page.goto('/berita/keselamatan-dimulai-dari-perencanaan');
  const contents = page.getByRole('navigation', { name: 'Daftar isi artikel' });
  const link = contents.getByRole('link').first();
  await expect(link).toBeVisible();
  const target = await link.getAttribute('href');
  await link.click();
  await expect(page.locator(target!)).toBeInViewport();
});
test('form validates accessibly and never simulates delivery', async ({
  page,
}) => {
  await page.goto('/kontak');
  let outbound = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST') outbound++;
  });
  await page.getByRole('button', { name: 'Cek pesan' }).click();
  await expect(page.locator('#name')).toBeFocused();
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Nama lengkap').fill('Pengunjung Demo');
  await page.getByLabel('Email', { exact: false }).fill('demo@example.com');
  await page
    .getByLabel('Topik pertanyaan')
    .selectOption('Informasi perusahaan');
  await page
    .getByLabel('Pesan', { exact: false })
    .fill('Contoh pertanyaan untuk memeriksa formulir tanpa pengiriman.');
  await page.getByRole('button', { name: 'Cek pesan' }).click();
  await expect(page.getByRole('status')).toContainText('Pesan belum dikirim');
  expect(outbound).toBe(0);
});
test('keyboard skip link, mobile focus trap and escape return focus', async ({
  page,
}, info) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Langsung ke konten' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  if (info.project.name !== 'desktop') {
    const menu = page.getByRole('button', { name: 'Buka menu navigasi' });
    await menu.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Tutup menu navigasi' }),
    ).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement?.closest('dialog')),
      ),
    ).toBe(true);
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
  }
});
test('without JavaScript reading, navigation and core content remain available', async ({
  browser,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.locator('h1')).toContainText('Menggali potensi.');
  const operationsLink = page.getByRole('link', { name: 'Lihat Operasi Kami' });
  await expect(operationsLink).toBeVisible();
  await operationsLink.click({ force: true });
  await expect(page.locator('h1')).toContainText('Ketelitian');
  await page.goto('http://127.0.0.1:4321/proyek');
  await expect(page.locator('[data-item]')).toHaveCount(3);
  await page.goto('http://127.0.0.1:4321/kontak');
  await expect(page.getByRole('button', { name: 'Cek pesan' })).toBeDisabled();
  await context.close();
});
test('reduced motion leaves content visible and disables entrance animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(
    await page
      .locator('.hero')
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none');
  expect(
    await page
      .locator('[data-reveal]')
      .first()
      .evaluate((node) => getComputedStyle(node).opacity),
  ).toBe('1');
});
test('home perspective selection works with keyboard and hides inactive links', async ({
  page,
}) => {
  await page.goto('/');
  const earth = page.getByRole('button', { name: 'Bumi.', exact: true });
  await earth.click();
  await expect(earth).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#perspective-1')).toHaveAttribute(
    'aria-hidden',
    'false',
  );
  await expect(page.locator('#perspective-0')).toHaveAttribute('inert', '');
  await expect(page.locator('#perspective-1 h3')).toBeVisible();
  await earth.press('ArrowRight');
  await expect(
    page.getByRole('button', { name: 'Masa depan.', exact: true }),
  ).toBeFocused();
  await expect(page.locator('#perspective-2')).toHaveAttribute(
    'aria-hidden',
    'false',
  );
  await page
    .getByRole('button', { name: 'Masa depan.', exact: true })
    .press('Home');
  await expect(
    page.getByRole('button', { name: 'Manusia.', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});
test('hero animation can be paused and respects reduced motion', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Jeda animasi judul' }).click();
  const word = await page.locator('[data-hero-word]').textContent();
  await page.waitForTimeout(4300);
  await expect(page.locator('[data-hero-word]')).toHaveText(word!);
  await page.getByRole('button', { name: 'Lanjutkan animasi judul' }).click();
  await expect(page.locator('[data-hero-word]')).not.toHaveText(word!, {
    timeout: 6000,
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-motion-toggle]')).toBeHidden();
});
test('cookie preference persists without analytics and respects storage denial', async ({
  page,
}) => {
  await page.goto('/cookie');
  await page.getByLabel('Izinkan analytics').check();
  await page.getByRole('button', { name: 'Simpan preferensi' }).click();
  await expect(page.getByRole('status')).toContainText('Preferensi tersimpan');
  await page.reload();
  await expect(page.getByLabel('Izinkan analytics')).toBeChecked();
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Storage blocked');
    };
  });
  await page.reload();
  await page.getByRole('button', { name: 'Simpan preferensi' }).click();
  await expect(page.getByRole('status')).toContainText('tidak dapat disimpan');
});
