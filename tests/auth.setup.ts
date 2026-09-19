import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
    await page.goto('https://conduit.bondaracademy.com');
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name: 'Email'}).fill('bevqa123@email.com')
    await page.getByRole('textbox', {name: 'Password'}).fill('testing123')
    await page.getByRole('button', {name: 'Sign in'}).click()
  
  await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();


  await page.context().storageState({ path: authFile });
});