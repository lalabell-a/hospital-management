const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.click('button[data-section="doctores"]');
  await page.waitForSelector('#doctores-table tbody');
});

test('ver lista inicial', async ({ page }) => {
  await expect(page.locator('#section-doctores')).toBeVisible();
  await expect(page.locator('#doctores-table tbody tr')).toHaveCount(4);
  await page.screenshot({ path: 'e2e/screenshots/doctores-1.png' });
});

test('crear doctor sin especialidad', async ({ page }) => {
  await page.click('#btn-nuevo-doctor');
  await page.fill('#doctor-nombre', 'Paula');
  await page.fill('#doctor-apellido', 'Nunez');
  await page.fill('#doctor-email', 'paula.nunez@example.com');
  await page.fill('#doctor-telefono', '0981112233');
  await page.fill('#doctor-consultorio', 'CONS-777');
  await page.click('#doctor-form button[type="submit"]');
  await expect(page.locator('#doctores-table tbody')).toContainText('Paula Nunez');
  await page.screenshot({ path: 'e2e/screenshots/doctores-2.png' });
});

test('buscar por especialidad filtra la tabla', async ({ page }) => {
  await page.fill('#search-doctores', 'Cardiologia');
  await page.waitForTimeout(500);
  await expect(page.locator('#doctores-table tbody')).toContainText('Cardiologia');
  await page.screenshot({ path: 'e2e/screenshots/doctores-3.png' });
});

test('crear doctor con todos los campos', async ({ page }) => {
  await page.click('#btn-nuevo-doctor');
  await page.fill('#doctor-nombre', 'Santiago');
  await page.fill('#doctor-apellido', 'Vega');
  await page.fill('#doctor-especialidad', 'Neurologia');
  await page.fill('#doctor-email', 'santiago.vega@example.com');
  await page.fill('#doctor-telefono', '0984445566');
  await page.fill('#doctor-consultorio', 'CONS-888');
  await page.click('#doctor-form button[type="submit"]');
  await expect(page.locator('#doctores-table tbody')).toContainText('Santiago Vega');
  await page.screenshot({ path: 'e2e/screenshots/doctores-4.png' });
});