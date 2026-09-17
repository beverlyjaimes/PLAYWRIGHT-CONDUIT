import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async({page}) => {
  await page.route('**/api/tags', async route => {
    await route.fulfill({
      json: tags
    })
})

//intercept api 
await page.route('**/api/articles*', async route => {
  const response = await route.fetch()
  const responseJSON = await response.json()
  responseJSON.articles[0].title = 'Bevs Title Mock Article'
  responseJSON.articles[0].description = 'Bevs Mock Article Description'
  await route.fulfill({
    json: responseJSON
  })
})


  await page.goto('https://conduit.bondaracademy.com');
})

test('has title', async({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/)

  await expect (page.locator('.sidebar .tag-pill')).toHaveText([' Automation ', ' Playwright '])
  await expect(page.locator('.preview-link h1').first()).toContainText('Bevs Title Mock Article')
  await expect(page.locator('.preview-link p').first()).toContainText('Bevs Mock Article Description')
});

