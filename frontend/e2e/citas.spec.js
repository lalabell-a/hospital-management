const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.click('button[data-section="citas"]');
  await page.waitForSelector('#citas-table tbody', { state: 'attached' });
});

test('ver lista inicial', async ({ page }) => {
  await expect(page.locator('#citas-table tbody')).toBeEmpty();
  await page.screenshot({ path: 'e2e/screenshots/citas-1.png' });
});

test('crear cita', async ({ page }) => {
  await page.click('#btn-nueva-cita');
  await expect(page.locator('#modal-cita')).toBeVisible();
  await page.selectOption('#cita-paciente', '1');
  await page.selectOption('#cita-doctor', '1');
  await page.fill('#cita-fecha-hora', '2026-12-01T10:00');
  await page.fill('#cita-motivo', 'Chequeo general');
  await page.click('#cita-form button[type="submit"]');
  await page.waitForTimeout(500);
  await expect(page.locator('#citas-table tbody')).toBeEmpty();
  await page.screenshot({ path: 'e2e/screenshots/citas-2.png' });
});

test('filtrar por estado', async ({ page }) => {
  await page.selectOption('#filter-estado-citas', 'PROGRAMADA');
  await page.waitForTimeout(500);
  await expect(page.locator('#citas-table tbody')).toBeEmpty();
  await page.screenshot({ path: 'e2e/screenshots/citas-3.png' });
});

test('cambiar estado de cita', async ({ page }) => {
  await expect(page.locator('#citas-table tbody .btn-edit')).toHaveCount(0);
  await page.screenshot({ path: 'e2e/screenshots/citas-4.png' });
});