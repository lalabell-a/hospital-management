const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.click('button[data-section="historias"]');
  await page.waitForSelector('#historias-table tbody');
});

test('ver lista inicial', async ({ page }) => {
  await expect(page.locator('#historias-table tbody tr')).toHaveCount(3);
  await page.screenshot({ path: 'e2e/screenshots/historias-1.png' });
});

test('crear historia con diagnostico HTML', async ({ page }) => {
  await page.click('#btn-nueva-historia');
  await page.selectOption('#historia-paciente', '1');
  await page.selectOption('#historia-doctor', '1');
  await page.fill('#historia-diagnostico', '<b>Diagnóstico</b>');
  await page.fill('#historia-tratamiento', 'Tratamiento de prueba');
  await page.click('#historia-form button[type="submit"]');
  await expect(page.locator('#historias-table tbody')).toContainText('Diagnóstico');
  await page.screenshot({ path: 'e2e/screenshots/historias-2.png' });
});

test('crear historia valida', async ({ page }) => {
  await page.click('#btn-nueva-historia');
  await page.selectOption('#historia-paciente', '1');
  await page.selectOption('#historia-doctor', '1');
  await page.fill('#historia-diagnostico', 'Control rutinario');
  await page.fill('#historia-tratamiento', 'Sin tratamiento');
  await page.fill('#historia-observaciones', 'Seguimiento en 30 dias');
  await page.click('#historia-form button[type="submit"]');
  await expect(page.locator('#historias-table tbody')).toContainText('Control rutinario');
  await page.screenshot({ path: 'e2e/screenshots/historias-3.png' });
});

test('ver historias por paciente', async ({ page }) => {
  await page.goto('/');
  await page.click('button[data-section="historias"]');
  await expect(page.locator('#historias-table tbody')).toContainText('N/A');
  await page.screenshot({ path: 'e2e/screenshots/historias-4.png' });
});