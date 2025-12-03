import { Locator, Page, expect } from "@playwright/test";
import { HelperBase } from "../base/helperBase";

export class DatePickerPage extends HelperBase {
    
    constructor(page: Page){
        super(page);
    }

    // Selects a date X days from today using the "Form Picker" datepicker input.
    async selectCommonDatePickerDateFromToday(numOfDaysFromToday: number){

        // Open the datepicker by clicking its input field.
        const calendarInputField = this.page.getByPlaceholder('Form Picker');
        await calendarInputField.click();

        // Select the target date inside the calendar and get the formatted value to assert.
        const dateToAssert = await this.selectDateInTheCalendar(numOfDaysFromToday);

        // Verify that the input field now contains the correct formatted date.
        await expect(calendarInputField).toHaveValue(dateToAssert);
    }

    async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker');
        await calendarInputField.click();
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday);
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday);
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`;
        await expect(calendarInputField).toHaveValue(dateToAssert);

    }

    // Handles all logic for navigating the calendar UI and clicking
    // the date that is X days from today.
    private async selectDateInTheCalendar(numOfDaysFromToday: number){

        // Create a Date object for "today + X days".
        let date = new Date();
        date.setDate(date.getDate() + numOfDaysFromToday);

        // Extract individual date components (day, month, year).
        const expectedDate = date.getDate().toString(); // e.g., "14"
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' }); // e.g., "Feb"
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });   // e.g., "February"
        const expectedYear = date.getFullYear(); // e.g., 2025

        // This is the formatted value that should appear in the input after selection.
        // Example: "Feb 14, 2025"
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

        // Get the currently displayed month and year from the datepicker header.
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

        // If the target date is in a future month, click the "next" button until the correct month appears.
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        }

        // Select the exact day number inside the correct month.
        await this.page.locator('.day-cell.ng-star-inserted:not(.bounding-month)').getByText(expectedDate, { exact: true }).click();

        // Return the value that the input field should now display.
        return dateToAssert;
    }
}
