import {test, expect} from '@playwright/test';
import { noop } from 'rxjs';

test.beforeEach(async ({page}) => {
    await page.goto('/');
})

test.describe('Form Layouts Page', () => {
    // Reruns the test twice if fails
    test.describe.configure({retries: 2});

    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('Input Fields', async ({page}, testInfo) => {
        if(testInfo.retry) {
            //do something (clean db etc)
        }
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });

        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500})

        //Generic Assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        //Locator Assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');

    })

    test('Radio Buttons', async ({ page }) => {

    // Locate the card section that contains the "Using the Grid" radio buttons
    const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' });

    // --- Selecting Option 1 ---

    // Click the "Option 1" radio button
    // force: true → used because radio buttons may be slightly hidden or overlapped
    await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).check({ force: true });

    // Check the selected state manually using a boolean
    const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked();
    await expect(usingTheGridForm).toHaveScreenshot();

    // Verify Option 1 is selected
    //expect(radioStatus).toBeTruthy();

    // Same assertion but using Playwright's built-in matcher
    //await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).toBeChecked();

    // --- Selecting Option 2 ---

    // Click the "Option 2" radio button
    //await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });

    // Now Option 1 should automatically become unselected (default radio behaviour)
    //expect(
       // await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked()).toBeFalsy();

    // And Option 2 should be selected
   // expect(await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).isChecked()).toBeTruthy();
});


})

test('Checkboxes', async ({ page }) => {

    // Navigate to the Toastr page
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    // Tick specific checkboxes by their visible label
    // "force: true" is used because UI animations may block the click
    await page.getByRole('checkbox', { name: 'Hide on click' }).check({ force: true });
    await page.getByRole('checkbox', {
        name: 'Prevent arising of duplicate toast'
    }).check({ force: true });

    // Get all checkbox elements on the page
    const allBoxes = page.getByRole('checkbox');

    // Loop through every checkbox found
    for (const box of await allBoxes.all()) {

        // Tick the checkbox (force ensures it works even if something overlaps)
        await box.check({ force: true });

        // Verify the checkbox is actually checked
        expect(await box.isChecked()).toBeTruthy();
    }
});


test('Lists and Dropdowns', async ({ page }) => {

    // Open the theme dropdown menu in the header
    const dropDownMenu = page.locator('ngx-header nb-select');
    await dropDownMenu.click();

    // These lines are just notes:
    // page.getByRole('list');     → for UL lists
    // page.getByRole('listitem'); → for LI items

    // Select all options inside the dropdown menu
    // (nb-option-list contains nb-option items like Light, Dark, Cosmic, etc.)
    const optionList = page.locator('nb-option-list nb-option');

    // Check that all available options are correct and in the right order
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);

    // Select the "Cosmic" theme
    await optionList.filter({ hasText: 'Cosmic' }).click();

    // The header element changes background colour depending on the selected theme
    const header = page.locator('nb-layout-header');

    // Verify the expected colour for the Cosmic theme
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    // A simple mapping of theme names to their expected background colour
    const colors = {
        'Light': 'rgb(255, 255, 255)',
        'Dark': 'rgb(34, 43, 69)',
        'Cosmic': 'rgb(50, 50, 89)',
        'Corporate': 'rgb(255, 255, 255)'
    };

    // Open dropdown again to begin looping through all themes
    await dropDownMenu.click();

    // Loop through each theme and test its background colour
    for (const color in colors) {

        // Click on the theme option (Light, Dark, Cosmic, Corporate)
        await optionList.filter({ hasText: color }).click();

        // Assert that the header background changes to the correct colour
        await expect(header).toHaveCSS('background-color', colors[color]);

        // Reopen dropdown to select the next theme
        await dropDownMenu.click();
    }
});


test('Tooltips', async ({ page }) => {

    // Navigate to the "Tooltip" page
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    // Select the card section that contains the tooltip placement buttons
    const toolTipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' });

    // Hover over the "Top" button to trigger the tooltip
    await toolTipCard.getByRole('button', { name: 'Top' }).hover();

    // Locate the tooltip element and read its text
    // (nb-tooltip is the component that appears when hovering)
    const tooltip = await page.locator('nb-tooltip').textContent();

    // Check that the tooltip text matches the expected message
    expect(tooltip).toEqual('This is a tooltip');
});



test('Dialog Box', async ({page}) => {

    // Navigate to the "Smart Table" page
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // Set up a listener to handle the browser's confirmation popup
    // This runs automatically whenever a dialog (alert/confirm) appears
    page.on('dialog', dialog => {

        // Check that the popup message is correct
        expect(dialog.message()).toEqual('Are you sure you want to delete?');

        // Click the "OK" button on the popup
        dialog.accept();
    });

    // Find the table row containing the user's email and click the trash (delete) icon
    await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click();

    // After deletion, check that the email no longer appears in the first row
    // (Meaning the delete action actually removed the entry)
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
});



test('Web Tables', async ({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // 1 get the row by any test in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"});
    await targetRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').clear();
    await page.locator('input-editor').getByPlaceholder('Age').fill('35');
    await page.locator('.nb-checkmark').click();

    // 2 Get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
    const targetRowByID = page.getByRole('row', {name:"11"})
    .filter({has: page.locator('td').nth(1).getByText('11')});
    await targetRowByID.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('E-mail').clear();
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
    await page.locator('.nb-checkmark').click();
    await expect(targetRowByID.locator('td').nth(5)).toHaveText('test@test.com')

    // 3 Test filter of the table
    const ages = ["20", "30", "40", "200"];
    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear();
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        await page.waitForTimeout(500)

        const ageRows = page.locator('tbody tr');
        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent();
            if(age=="200"){
                expect (await page.getByRole('table').textContent()).toContain('No data found');
            } else{
                expect(cellValue).toEqual(age);
            }            
        }
    }

})



test('Datepicker', async ({page}) => {

    // Go to the Datepicker section in the app
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    // Select the Datepicker input field
    const calendarInputField = page.getByPlaceholder('Form Picker');
    await calendarInputField.click();

    // Create a date 20 days from today
    let date = new Date();
    date.setDate(date.getDate() + 20);

    // Extract the pieces we need from the new date
    const expectedDate = date.getDate().toString(); // just the day (ex: "14")
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' }); // ex: "Feb"
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });   // ex: "February"
    const expectedYear = date.getFullYear(); // ex: 2025

    // This is the final value we expect inside the input box
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    // Get the month + year currently shown in the calendar header
    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

    // Keep clicking the "next month" button until the correct month appears
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    }

    // Click the correct day (the one we calculated 20 days ahead)
    await page.locator('[class="day-cell ng-star-inserted"]')
        .getByText(expectedDate, { exact: true }).click();

    // Finally, check that the input field shows the correct formatted date
    await expect(calendarInputField).toHaveValue(dateToAssert);
});

test('Sliders', async ({ page }) => {

    // 1st Approach (INSIDE COMMENTS ONLY)
    
    /*
    // This method works by directly changing the slider's attributes in the DOM.
    // Instead of physically dragging the slider, we *manually* update the
    // position values ("cx" and "cy") of the draggable circle element.

    // Locate the draggable circle in the temperature slider
    const tempGuage = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');

    // Evaluate runs inside the browser and changes the slider's attributes directly
    await tempGuage.evaluate(node => {
        // Set the circle's X and Y coordinates to a new position
        // These values depend on your specific UI layout
        node.setAttribute('cx', '232.630');
        node.setAttribute('cy', '232.630');
    });

    // Click on the updated circle so the UI refreshes and picks the new value
    await tempGuage.click();
    */
    
    // 2nd Approach (Mouse Drag Simulation)
  
    // Locate the temperature slider component
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');

    // Ensure the slider is visible on the page
    await tempBox.scrollIntoViewIfNeeded();

    // Get the slider's bounding box (position + size on screen)
    const box = await tempBox.boundingBox();

    // Calculate the center of the slider drag area
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    // Move the mouse to the slider's center
    await page.mouse.move(x, y);

    // Press and hold the mouse (like clicking and holding)
    await page.mouse.down();

    // Drag horizontally to move the slider to the right
    await page.mouse.move(x + 100, y);

    // Drag diagonally to simulate more slider movement
    await page.mouse.move(x + 100, y + 100);

    // Release the mouse to finish the drag
    await page.mouse.up();

    // Check that the slider now displays "30" as the temperature
    await expect(tempBox).toContainText('30');

});

