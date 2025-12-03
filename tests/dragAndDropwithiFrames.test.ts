import {expect} from '@playwright/test';
import {test} from '../test-options';

test('Drag & drop with iFrames', async ({ page, globalSqaUrl}) => {

    // Go to the demo drag-and-drop page
    await page.goto(globalSqaUrl);

    // Accept the cookie / consent popup so it doesn’t block the page
    await page.locator('button', { hasText: 'Consent' }).click();

    // Select the iframe that contains the "Photo Manager" drag-and-drop demo
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');

   
    // 1st Drag & Drop – Using dragTo()

    // Drag the "High Tatras 2" item into the trash area
    await frame.locator('li', { hasText: 'High Tatras 2' }).dragTo(frame.locator('#trash'));

    // 2nd Drag & Drop – Manual precise mouse control
   
    // Move mouse over "High Tatras 4" inside the iframe
    await frame.locator('li', { hasText: 'High Tatras 4' }).hover();

    // Press and hold the mouse button (start drag)
    await page.mouse.down();

    // Hover the mouse over the trash area (drop target)
    await frame.locator('#trash').hover();

    // Release the mouse button (drop)
    await page.mouse.up();

    // Verify that the trash list now contains both image titles
    await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4']);
});
