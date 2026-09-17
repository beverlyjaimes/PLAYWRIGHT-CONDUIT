import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'


test('has title', async({ page }) => {
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
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/)
  await expect (page.locator('.sidebar .tag-pill')).toHaveText([' Automation ', ' Playwright '])
  await expect(page.locator('.preview-link h1').first()).toContainText('Bevs Title Mock Article')
  await expect(page.locator('.preview-link p').first()).toContainText('Bevs Mock Article Description')
});

test ('Delete article ', async ({page, request }) => {

const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  data: {
   "user":{
      "email":"bevqa123@email.com",
      "password":"testing123"
    }
  }
})
expect ((loginResponse).status()).toEqual(200)
const responseLoginJSON = await loginResponse.json()
const token = responseLoginJSON.user.token
console.log(token)

const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
  data:{
    "article":{
      "title":"Bev Test Article",
      "description":"asdf",
      "body":"531w5asdf",
      "tagList":["5w1asdfasf35"]
    }
  },
  headers:{
    Authorization: `Token ${token}`
  }
})
expect ((newArticleResponse).status()).toEqual(201)
await page.goto('https://conduit.bondaracademy.com');
await page.getByText('Sign in').click()
await page.getByRole('textbox', {name: 'Email'}).fill('bevqa123@email.com')
await page.getByRole('textbox', {name: 'Password'}).fill('testing123')
await page.getByRole('button', {name: 'Sign in'}).click()

await expect(page.locator('.preview-link h1').first()).toContainText('Bev Test Article')
await page.getByText('Bev Test Article').click()
await page.getByRole('button' , {name: 'Delete Article'}).first().click()
//negative assertion can be a false positive so add custom wait to wait for DOM to load 
await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
await expect(page.locator('.preview-link h1').first()).not.toContainText('Bev Test Article')



})

test('Create article', async ({page, request}) =>{
await page.goto('https://conduit.bondaracademy.com');
await page.getByText('Sign in').click()
await page.getByRole('textbox', {name: 'Email'}).fill('bevqa123@email.com')
await page.getByRole('textbox', {name: 'Password'}).fill('testing123')
await page.getByRole('button', {name: 'Sign in'}).click()

await page.getByText('New Article').click()
await page.getByRole('textbox', {name: 'Article Title'}).fill('playwright')
await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('testing')
await page.getByRole('textbox', {name: 'Write your article'}).fill('testing with playwright')
await page.getByRole('button', {name: 'Publish Article'}).click()

await expect(page.locator('.article-page h1')).toContainText('playwright')
await page.getByText('Home').first().click()
await expect(page.locator('.article-preview h1').first()).toContainText('playwright')




})
