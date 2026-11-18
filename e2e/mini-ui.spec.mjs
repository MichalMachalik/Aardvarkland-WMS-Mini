import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const UI_DIR = 'artifacts/ui';
const now = '2026-08-17T00:00:00.000Z';

test.use({ serviceWorkers: 'block' });

const demoState = {
  schemaVersion: 3,
  warehouseName: 'Aardvarkland Demo Warehouse',
  products: [
    {
      id: 'product-gloves',
      sku: 'RUK-001',
      name: 'Průmyslové rukavice',
      barcode: '859000000001',
      unit: 'ks',
      minimumStock: 20,
      categoryId: 'category-safety',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'product-lube',
      sku: 'MAZ-500',
      name: 'Mazivo 500 ml',
      barcode: '859000000002',
      unit: 'ks',
      minimumStock: 10,
      categoryId: 'category-service',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'product-tape',
      sku: 'PAS-048',
      name: 'Balicí páska 48 mm',
      barcode: '859000000003',
      unit: 'ks',
      minimumStock: 25,
      categoryId: 'category-pack',
      createdAt: now,
      updatedAt: now,
    },
  ],
  categories: [
    { id: 'category-safety', name: 'BOZP', createdAt: now },
    { id: 'category-service', name: 'Servis', createdAt: now },
    { id: 'category-pack', name: 'Balení', createdAt: now },
  ],
  batches: [
    {
      id: 'batch-lube-001',
      productId: 'product-lube',
      locationId: 'location-a01',
      lotNumber: 'LOT-2026-0817',
      expiryDate: '2026-09-10',
      quantity: 8,
      createdAt: now,
      updatedAt: now,
    },
  ],
  locations: [
    { id: 'location-a01', code: 'A-01', name: 'Regál A / pozice 01', createdAt: now },
    { id: 'location-b02', code: 'B-02', name: 'Regál B / pozice 02', createdAt: now },
    { id: 'location-exp', code: 'EXP', name: 'Expedice', createdAt: now },
  ],
  balances: [
    { productId: 'product-gloves', locationId: 'location-a01', quantity: 48 },
    { productId: 'product-gloves', locationId: 'location-b02', quantity: 12 },
    { productId: 'product-lube', locationId: 'location-a01', quantity: 8 },
    { productId: 'product-tape', locationId: 'location-b02', quantity: 120 },
  ],
  movements: [
    {
      id: 'movement-001',
      type: 'RECEIPT',
      productId: 'product-gloves',
      fromLocationId: null,
      toLocationId: 'location-a01',
      quantity: 60,
      delta: 60,
      note: 'Počáteční příjem',
      batchId: null,
      lotNumber: '',
      expiryDate: null,
      createdAt: '2026-08-16T08:00:00.000Z',
    },
    {
      id: 'movement-002',
      type: 'MOVE',
      productId: 'product-gloves',
      fromLocationId: 'location-a01',
      toLocationId: 'location-b02',
      quantity: 12,
      delta: 0,
      note: 'Doplnění vychystávací pozice',
      batchId: null,
      lotNumber: '',
      expiryDate: null,
      createdAt: '2026-08-16T10:30:00.000Z',
    },
    {
      id: 'movement-003',
      type: 'RECEIPT',
      productId: 'product-lube',
      fromLocationId: null,
      toLocationId: 'location-a01',
      quantity: 8,
      delta: 8,
      note: 'Šarže pro servis',
      batchId: 'batch-lube-001',
      lotNumber: 'LOT-2026-0817',
      expiryDate: '2026-09-10',
      createdAt: '2026-08-16T12:00:00.000Z',
    },
    {
      id: 'movement-004',
      type: 'RECEIPT',
      productId: 'product-tape',
      fromLocationId: null,
      toLocationId: 'location-b02',
      quantity: 120,
      delta: 120,
      note: 'Balení',
      batchId: null,
      lotNumber: '',
      expiryDate: null,
      createdAt: '2026-08-16T13:15:00.000Z',
    },
  ],
  onboardingCompleted: true,
  updatedAt: now,
};

async function seedMini(page, theme = 'light') {
  const envelope = {
    persistenceVersion: 1,
    savedAt: '2026-08-17T00:00:01.000Z',
    state: demoState,
  };

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(({ value, selectedTheme }) => {
    localStorage.setItem('aardvarkland-mini-wms-state-v3', JSON.stringify(value));
    localStorage.setItem('aardvarkland-mini-language', 'cs');
    localStorage.setItem('aardvarkland-ui-theme', selectedTheme);
  }, { value: envelope, selectedTheme: theme });
}

async function openMini(page) {
  await page.goto(process.env.MINI_PRODUCT_URL || 'http://127.0.0.1:4010', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.app-shell')).toBeVisible({ timeout: 10_000 });
}

async function shot(page, name, fullPage = true) {
  await mkdir(UI_DIR, { recursive: true });
  await page.screenshot({ path: `${UI_DIR}/${name}`, fullPage });
}

async function expectDateErrorGap(page) {
  const fields = page.locator('.split-fields').filter({ has: page.locator('input[type="date"]') });
  const error = page.getByRole('alert').filter({ hasText: 'Zadejte obě data' });
  await expect(fields.locator('input[type="date"]').first()).toBeFocused();
  await expect(error).toBeVisible();
  const fieldBox = await fields.boundingBox();
  const errorBox = await error.boundingBox();
  expect(errorBox.y - (fieldBox.y + fieldBox.height)).toBeGreaterThanOrEqual(12);
}

test.describe('WMS-Mini visual smoke', () => {
  test('desktop warehouse flow is usable and captured', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await seedMini(page);
    await openMini(page);

    await expect(page.getByRole('heading', { name: 'Přehled skladu', level: 1 })).toBeVisible();
    await shot(page, '01-mini-desktop-dashboard.png');

    await page.locator('.sidebar nav button').nth(1).click();
    await expect(page.getByRole('heading', { name: 'Produkty a zásoby', level: 1 })).toBeVisible();
    await shot(page, '02-mini-desktop-stock.png');

    await page.locator('.sidebar nav button').nth(2).click();
    await expect(page.getByRole('heading', { name: 'Skladový pohyb', level: 1 })).toBeVisible();
    await page.getByPlaceholder('Sken nebo kód produktu').fill('859000000001');
    await page.getByPlaceholder('Sken nebo kód produktu').press('Enter');
    await expect(page.getByText('Průmyslové rukavice', { exact: true }).first()).toBeVisible();
    await shot(page, '03-mini-desktop-scanner-selection.png');

    await page.evaluate(() => {
      const readText = File.prototype.text;
      File.prototype.text = function () {
        if (this.name !== 'delayed-products.csv') return readText.call(this);
        return new Promise(resolve => {
          window.completeSpreadsheetRead = async () => resolve(await readText.call(this));
        });
      };
    });
    await page.locator('.sidebar nav button').nth(5).click();
    await page.locator('input[accept^=".csv,.xlsx"]').setInputFiles({
      name: 'delayed-products.csv', mimeType: 'text/csv', buffer: Buffer.from('SKU,Name\nDEMO-IMPORT,Testovací filtr'),
    });
    await page.waitForFunction(() => typeof window.completeSpreadsheetRead === 'function');
    await page.locator('.sidebar nav button').nth(2).click();
    await page.locator('.operation-types button').filter({ hasText: 'Přesun' }).click();
    await page.getByLabel('Produkt').selectOption('product-gloves');
    await page.getByLabel('Z lokace').selectOption('location-a01');
    await page.getByLabel('Do lokace').selectOption('location-b02');
    await page.getByLabel('Množství').fill('5');
    await page.getByLabel('Poznámka').fill('E2E přesun');
    await page.getByRole('button', { name: 'Uložit pohyb' }).click();
    await expect(page.getByRole('status')).toContainText('Pohyb byl bezpečně uložen.');
    await shot(page, '04-mini-desktop-movement-saved.png');

    await page.evaluate(() => window.completeSpreadsheetRead());
    await page.locator('.sidebar nav button').nth(1).click();
    await expect(page.getByText('Testovací filtr', { exact: true })).toHaveCount(1);
    await page.locator('.sidebar nav button').nth(3).click();
    await expect(page.getByRole('heading', { name: 'Historie pohybů', level: 1 })).toBeVisible();
    await expect(page.getByText('E2E přesun', { exact: false })).toBeVisible();
    await shot(page, '05-mini-desktop-history.png');

    await page.locator('.sidebar nav button').nth(4).click();
    await expect(page.getByRole('heading', { name: 'Reporty', level: 1 })).toBeVisible();
    await shot(page, '06-mini-desktop-reports.png');
    const from = page.locator('.split-fields input[type="date"]').first();
    const csv = page.getByRole('button', { name: /CSV/ });
    const pdf = page.getByRole('button', { name: /PDF/ });
    const start = await from.inputValue();
    await from.fill('2999-01-01');
    await expect(page.getByRole('alert')).toContainText('Zadejte obě data');
    await expect(csv).toBeDisabled();
    await expect(pdf).toBeDisabled();
    await expectDateErrorGap(page);
    await shot(page, '06-mini-desktop-report-range.png');
    await from.fill(start);
    const csvDownload = page.waitForEvent('download');
    await csv.click();
    expect((await csvDownload).suggestedFilename()).toMatch(/\.csv$/);
    const pdfDownload = page.waitForEvent('download');
    await pdf.click();
    expect((await pdfDownload).suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('mobile navigation is usable and captured', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedMini(page);
    await openMini(page);
    await expect(page.getByRole('heading', { name: 'Přehled skladu', level: 1 })).toBeVisible();
    const main = page.locator('.main');
    const nav = page.locator('.mobile-nav');
    const viewport = await page.evaluate(() => innerHeight);
    const mainBounds = await main.boundingBox();
    const navBounds = await nav.boundingBox();
    expect(mainBounds.y + mainBounds.height).toBeLessThanOrEqual(navBounds.y + 1);
    expect(navBounds.y + navBounds.height).toBeCloseTo(viewport, 0);
    await shot(page, '07-mini-mobile-dashboard.png', false);
    await main.evaluate(element => { element.scrollTop = element.scrollHeight; });
    expect(await main.evaluate(element => element.scrollTop)).toBeGreaterThan(0);

    await page.locator('.mobile-nav button').nth(2).click();
    await expect(page.getByRole('heading', { name: 'Skladový pohyb', level: 1 })).toBeVisible();
    await expect(nav.locator('button[aria-current="page"]')).toHaveCount(1);
    expect(await main.evaluate(element => element.scrollTop)).toBe(0);
    await shot(page, '08-mini-mobile-movement.png', false);
    await page.getByRole('button', { name: 'Reporty', exact: true }).click();
    await page.locator('.split-fields input[type="date"]').first().fill('2999-01-01');
    await expectDateErrorGap(page);
    await shot(page, '08-mini-mobile-report-range.png', false);
  });

  test('mobile dark dashboard is captured', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedMini(page, 'dark');
    await openMini(page);
    await expect(page.getByRole('heading', { name: 'Přehled skladu', level: 1 })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await shot(page, '09-mini-mobile-dark-dashboard.png', false);
  });
});
