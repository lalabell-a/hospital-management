const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.click('button[data-section="pacientes"]');
  await page.waitForSelector('#pacientes-table tbody', { state: 'attached' });
});

test('ver lista inicial y capturar evidencia', async ({ page }) => {
  await expect(page.locator('#pacientes-table')).toBeVisible();
  await expect(page.locator('#pacientes-table tbody')).toContainText('Juan Perez');
  await expect(page.locator('#pacientes-table tbody')).toContainText('Maria Garcia');
  await page.screenshot({ path: 'e2e/screenshots/pacientes-1.png' });
});

test('crear paciente y verificar fila nueva', async ({ page }) => {
  await page.click('#btn-nuevo-paciente');
  await page.fill('#paciente-nombre', 'Lucia');
  await page.fill('#paciente-apellido', 'Mora');
  await page.fill('#paciente-email', 'lucia.mora@example.com');
  await page.fill('#paciente-telefono', '0998887776');
  await page.fill('#paciente-fecha-nacimiento', '1995-04-10');
  await page.click('#paciente-form button[type="submit"]');
  await expect(page.locator('#pacientes-table tbody')).toContainText('Lucia Mora');
  await page.screenshot({ path: 'e2e/screenshots/pacientes-2.png' });
});

test('buscar por nombre filtra resultados', async ({ page }) => {
  await page.fill('#search-pacientes', 'Juan');
  await page.waitForTimeout(500);
  await expect(page.locator('#pacientes-table tbody tr')).toHaveCount(1);
  await expect(page.locator('#pacientes-table tbody')).toContainText('Juan Perez');
  await page.screenshot({ path: 'e2e/screenshots/pacientes-3.png' });
});

test('eliminacion sin confirmacion ocurre directamente', async ({ page }) => {
  const firstDelete = page.locator('#pacientes-table tbody .btn-delete').first();
  await expect(firstDelete).toBeVisible();
  await firstDelete.click();
  await page.screenshot({ path: 'e2e/screenshots/pacientes-4.png' });
});