import {expect, test} from '@playwright/test';


test.beforeEach(async ({page}, testInfo) => {
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000); // Extend timeout for each test by 2 seconds
})

test('Auto Waiting in Playwright', async ({page}) => {
    const successButton = page.locator('.bg-success')

    // await successButton.click()
    // const text = await successButton.textContents() // this will fail because the element is not yet present in the DOM

    // await successButton.waitFor({ state: 'attached' }) //waits for the element to be attached to the DOM 
    // const text = await successButton.allTextContents()

    // expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 }) // Playwright auto-waits for the element to be present and have the expected text

})

test('Alternative Waits', async ({page}) => {
    const successButton = page.locator('.bg-success')

    // Wait for element
    //await page.waitForSelector('.bg-success')

    // Wait for particular response
    // await page.waitForResponse('http://www.uitestingplayground.com/ajaxdata') // waits for the AJAX request to complete

    // Wait for network calls to be completed [Not recommended as if one api fails, test will fail]
    await page.waitForLoadState('networkidle') // waits for the network to be idle


    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('Timeouts', async ({page}) => {
    // test.setTimeout(10000); // Set timeout for this test to 10 seconds
    // test.slow(); // Mark this test as slow, doubling the timeout to 60 seconds
    const successButton = page.locator('.bg-success')

    await successButton.click({timeout: 16000}) // click with a timeout of 16 seconds

})

