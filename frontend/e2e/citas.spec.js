const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.click('button[data-section="citas"]');
  await page.waitForSelector('#citas-table tbody');
});

test('ver lista inicial', async ({ page }) => {
  await expect(page.locator('#citas-table tbody tr')).toHaveCount(5);
  await page.screenshot({ path: 'e2e/screenshots/citas-1.png' });
});

test('crear cita', async ({ page }) => {
  await page.click('#btn-nueva-cita');
  await page.selectOption('#cita-paciente', '1');
  await page.selectOption('#cita-doctor', '1');
  await page.fill('#cita-fecha-hora', '2026-12-01T10:00');
  await page.fill('#cita-motivo', 'Chequeo general');
  await page.click('#cita-form button[type="submit"]');
  await expect(page.locator('#citas-table tbody')).toContainText('Chequeo general');
  await page.screenshot({ path: 'e2e/screenshots/citas-2.png' });
});

test('filtrar por estado', async ({ page }) => {
  await page.selectOption('#filter-estado-citas', 'PROGRAMADA');
  await page.waitForTimeout(500);
  await expect(page.locator('#citas-table tbody')).toContainText('PROGRAMADA');
  await page.screenshot({ path: 'e2e/screenshots/citas-3.png' });
});

test('cambiar estado de cita', async ({ page }) => {
  await page.locator('#citas-table tbody .btn-edit').first().click();
  await page.selectOption('#cita-estado', 'CANCELADA');
  await page.click('#cita-form button[type="submit"]');
  await expect(page.locator('#citas-table tbody')).toContainText('CANCELADA');
  await page.screenshot({ path: 'e2e/screenshots/citas-4.png' });
});