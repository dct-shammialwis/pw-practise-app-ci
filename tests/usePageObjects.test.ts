import {test, expect} from '@playwright/test';
import {PageManager} from '../page-objects/base/pageManager';
import {NavigationPage} from '../page-objects/pages/navigationPage';
import {FormLayoutPage} from '../page-objects/pages/formLayoutPage';
import {DatePickerPage} from '../page-objects/pages/datePickerPage';
import { TestDataHelper } from '../page-objects/helpers/testDataHelper';
import { argosScreenshot } from "@argos-ci/playwright";

test.beforeEach(async ({page}) => {
    await page.goto('/');
})

test('Navigate to form page', async({page}) => {
    const pm = new PageManager(page);
    await pm.navigateTo().formLayoutPage();
    await pm.navigateTo().datePickerPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().toastrPage();
    await pm.navigateTo().toolTipPage();
})

test('Parameterized Methods', async({page}) => {
    const pm = new PageManager(page);
    const randomFullName = TestDataHelper.fullName();
    // Create a unique test email by removing spaces from the name and adding a random number
    const randomEmail = TestDataHelper.emailFromName(randomFullName);
    //const strongRandomPassword = TestDataHelper.strongPassword();

    await pm.navigateTo().formLayoutPage();
    await pm.onFormLayoutPage().submitUsingGridForm(process.env.TEST_USERNAME, process.env.TEST_PASSWORD, 'Option 1');
    await page.screenshot({path: 'screenshots/formLayoutsPage.png'});
    
    // Take a screenshot, convert it to a base64 string, and print it to the console.(Share on slack etc)
    //const buffer = await page.screenshot();
    //console.log(buffer.toString('base64'));


    await pm.onFormLayoutPage().submitInlineForm(randomFullName, randomEmail, true);
    await page.locator('nb-card', { hasText: "Inline Form" }).screenshot({path: 'screenshots/inlineForm.png'}); // capture only the inline form

    
    //await pm.navigateTo().datePickerPage();
    //await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5);
    //await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 30);
})

test.only('testing with argos ci', async({page}) => {
    const pm = new PageManager(page);
    await pm.navigateTo().formLayoutPage();
    await argosScreenshot(page, "form layouts page");
    await pm.navigateTo().datePickerPage();
    await argosScreenshot(page, "date picker page");
})