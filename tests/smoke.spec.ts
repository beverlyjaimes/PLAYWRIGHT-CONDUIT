import { test, expect } from '@playwright/test';


test('Smoke test application loads', async({ page }) => {

  await page.goto('https://conduit.bondaracademy.com');
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/)
  await expect (page.locator('.sidebar .tag-pill')).toContainText([' Bondar Academy'])
 
});