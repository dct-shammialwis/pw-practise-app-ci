
import {expect, test} from '@playwright/test';



//hook that will run before each test
test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator Syntax Rules', async ({page}) => {
    //by Tag Name
    page.locator('input')

    //by ID
    await page.locator('#inputEmail1').click() //# is used for id

    //by Class Name
    page.locator('.shape-rectangle') //. is used for class name

    //by Attribute
    page.locator('[placeholder="Email"]') //[] is used for attribute

    //by Class Value
    page.locator('[class="input-full-width size-medium shape-rectangle"]') //[] is used for attribute

    //Combine different locators
    page.locator('input[placeholder="Email"].shape-rectangle')  //input tag with attribute placeholder and class name shape-rectangle

    //by Parent to Child
    page.locator('form input') //all input tags inside form tag

    //by XPath (not recommended to use XPath)
    page.locator('//input[@placeholder="Email"]')

    //by Text
    page.locator('text=Email')  //text= is used for text

    //by Partial Text
    page.locator('text=Using')  //text= is used for text

    //by Exact Text
    page.locator('text="Using the Grid"')  //text= is used for text
})


test('User facing locators', async ({page}) => {
    await page.getByRole('textbox', {name: 'Email'}).first().click() //selecting first textbox with name Email
    await page.getByRole('button', {name: 'Sign in'}).first().click() //selecting first button with name Sign in
    await page.getByLabel('Email').first().click() //selecting label with name Email

    await page.getByPlaceholder('Jane Doe').click() //selecting placeholder with name Jane Doe

    await page.getByText('Using the Grid').click() //selecting text with name Using the Grid

    await page.getByTestId('SignInTestId').click() //selecting test id with name SignInTestId

    await page.getByTitle('IoT Dashboard').click() //selecting title with name IoT Dashboard
})

test('Locating Child Elements', async ({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click(); //locating child element with text Option 1 inside nb-radio inside nb-card
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click(); //locating child element with text Option 2 inside nb-radio inside nb-card

    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click(); //locating button with name Sign in inside nb-card    
    await page.locator('nb-card').nth(3).getByRole('button').click(); //locating button with name Sign in inside 4th nb-card (index starts from 0) - Try to avoid nth() as much as possible
})

test('Locating Parent Elements', async ({page}) => {
    await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'}).click(); 
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: 'Email'}).click();

    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', {name: 'Email'}).click();
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: 'Password'}).click();
    
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'}).getByRole('textbox', {name: 'Email'}).click();
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: 'Email'}).click();
})

test('Reusing Locators', async ({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'}); //Creating a locator for Basic form nb-card
    const emailField = basicForm.getByRole('textbox', {name: 'Email'}); //Creating a locator for Email textbox inside Basic form

    await emailField.fill('test@test.com');
    await basicForm.getByRole('textbox', {name: 'Password'}).fill('Welcome@123');
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button').click();

    await expect(emailField).toHaveValue('test@test.com'); //Assertion to verify the email field value

})

test('Extracting Values', async ({page}) => {
    //Single Text Value
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'}); //Creating a locator for Basic form nb-card
    const buttonText = await basicForm.locator('button').textContent(); //Extracting text content of button inside Basic form
    expect(buttonText).toEqual('Submit'); //Assertion to verify the button text

    //All Text Values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents(); //Extracting text content of all nb-radio elements
    expect(allRadioButtonsLabels).toContain('Option 1'); //Assertion to verify the presence of 'Option 1' in the extracted texts

    //Input Value
    const emailField = basicForm.getByRole('textbox', {name: 'Email'}); //Creating a locator for Email textbox inside Basic form
    await emailField.fill('test@test.com');
    const emailValue = await emailField.inputValue(); //Extracting value of email textbox
    expect(emailValue).toEqual('test@test.com'); //Assertion to verify the email field value

    const placeholderValue = await emailField.getAttribute('placeholder'); //Extracting placeholder attribute value of email textbox
    expect(placeholderValue).toEqual('Email'); //Assertion to verify the placeholder value
})

test('Assertions', async ({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: 'Basic form'}).locator('button');

    // General Assertions
    const value =5;
    expect(value).toEqual(5); //toEqual for exact match

    const text = await basicFormButton.textContent();
    expect(text).toEqual('Submit'); //toEqual for exact match

    // Locator Assertions
    await expect(basicFormButton).toHaveText('Submit'); //toHaveText for exact match (will wait up to 5 seconds by default)

    // Soft Assertions (test will continue even if this assertion fails)
    await expect (basicFormButton).toHaveText('Submit'); 
    await basicFormButton.click();

})


