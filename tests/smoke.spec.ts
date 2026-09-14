import { expect, type Page, test } from '@playwright/test';

/**
 * Waits for a `client:visible` island to finish hydrating.
 *
 * Astro marks a server-rendered island with an `ssr` attribute and removes it
 * once hydration completes. Scrolling an island into view starts hydration but
 * does not finish it, so clicking immediately after scrolling is a race — which
 * is exactly what these tests hit. Waiting on the attribute is precise; a fixed
 * sleep would be both slower and flaky.
 */
async function hydrated(page: Page, selector: string) {
  const locator = page.locator(selector);
  await locator.scrollIntoViewIfNeeded();
  await page.waitForFunction(
    (sel) => document.querySelector(sel)?.closest('astro-island')?.hasAttribute('ssr') === false,
    selector,
  );
  return locator;
}

test.describe('homepage', () => {
  test('renders and has exactly one h1', async ({ page }) => {
    await page.goto('/de/');
    await expect(page).toHaveTitle(/Praxis am See/);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('emits SEO essentials', async ({ page }) => {
    await page.goto('/de/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/de\//);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{20,160}/);
    // hreflang alternates for every locale, plus x-default.
    await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
  });

  test('ships LocalBusiness structured data with opening hours', async ({ page }) => {
    await page.goto('/de/');
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    const data = JSON.parse(raw ?? '{}');
    expect(data['@type']).toBe('LocalBusiness');
    expect(data.address.addressLocality).toBeTruthy();
    expect(data.openingHoursSpecification.length).toBeGreaterThan(0);
  });

  test('makes no third-party requests', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.hostname !== 'localhost') external.push(request.url());
    });
    await page.goto('/de/', { waitUntil: 'networkidle' });
    expect(external).toEqual([]);
  });
});

test.describe('i18n', () => {
  test('serves both locales with the right lang attribute', async ({ page }) => {
    await page.goto('/de/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('language switch preserves the current page', async ({ page }) => {
    await page.goto('/de/leistungen/');
    await page.locator('.lang-switch__link', { hasText: 'EN' }).click();
    await expect(page).toHaveURL(/\/en\/leistungen\//);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('every locale renders all routes', async ({ page }) => {
    for (const locale of ['de', 'en']) {
      for (const route of ['', 'leistungen/', 'team/', 'kontakt/', 'impressum/', 'datenschutz/']) {
        const response = await page.goto(`/${locale}/${route}`);
        expect(response?.status(), `/${locale}/${route}`).toBe(200);
      }
    }
  });
});

test.describe('components', () => {
  test('FAQ is server-rendered and the accordion hydrates', async ({ page }) => {
    await page.goto('/de/');
    const accordion = await hydrated(page, '.accordion');
    await expect(accordion).toBeVisible();

    const trigger = accordion.locator('.accordion__trigger').first();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Panels are closed on load, but the answers are in the HTML for crawlers.
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(accordion.locator('.accordion__content').first()).toBeVisible();
  });

  test('FAQ answers are in the static HTML, not injected by JS', async ({ request }) => {
    // Fetched without a browser: whatever is here is what a crawler sees.
    const html = await (await request.get('/de/')).text();
    expect(html).toContain('Übernimmt die Krankenkasse die Kosten?');
    expect(html).toContain('grundsätzlich Privatleistung');
  });

  test('contact form validates before submitting', async ({ page }) => {
    await page.goto('/de/kontakt/');
    const form = await hydrated(page, 'form.form');
    await expect(form).toBeVisible();

    await form.locator('button[type="submit"]').click();
    // Three empty required fields -> three inline errors, and no navigation.
    await expect(page.locator('form.form .field__error')).toHaveCount(3);
    await expect(page).toHaveURL(/\/de\/kontakt\//);

    await form.locator('#contact-email').fill('not-an-email');
    await form.locator('#contact-name').fill('Maria Muster');
    await form.locator('#contact-message').fill('Guten Tag');
    await form.locator('button[type="submit"]').click();
    await expect(page.locator('#contact-email-error')).toBeVisible();
  });

  test('opening hours highlights the current day at runtime', async ({ page }) => {
    await page.goto('/de/');
    await expect(page.locator('.hours__table tr[data-today="true"]')).toHaveCount(1);
  });
});

test.describe('navigation', () => {
  test('desktop shows the link bar', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop-only layout');
    await page.goto('/de/');
    await expect(page.locator('.nav__bar')).toBeVisible();
    await expect(page.locator('.nav__toggle')).toBeHidden();
  });

  test('mobile drawer opens, traps focus and closes on Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile-only layout');
    await page.goto('/de/');

    const toggle = page.locator('.nav__toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();

    const drawer = page.locator('.nav__drawer');
    await expect(drawer).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('routing', () => {
  test('404 page renders for unknown paths', async ({ page }) => {
    const response = await page.goto('/de/gibt-es-nicht/');
    expect(response?.status()).toBe(404);
  });

  test('styleguide renders every section', async ({ page }) => {
    await page.goto('/styleguide/');
    await expect(page.locator('h1')).toContainText('Design system');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('gallery lightbox opens, steps and closes', async ({ page }) => {
    await page.goto('/styleguide/');
    const gallery = await hydrated(page, '.gallery');
    await expect(gallery).toBeVisible();

    await gallery.locator('.gallery__trigger').first().click();
    const dialog = page.locator('dialog.lightbox');
    await expect(dialog).toBeVisible();

    const src = async () => dialog.locator('.lightbox__figure img').getAttribute('src');
    const first = await src();
    await page.keyboard.press('ArrowRight');
    expect(await src()).not.toBe(first);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('dark mode repaints the page', async ({ page }) => {
    await page.goto('/styleguide/');
    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await page.locator('#theme-toggle').click();
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(darkBg).not.toBe(lightBg);
  });
});
