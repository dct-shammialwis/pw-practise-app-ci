import { Locator, Page } from "@playwright/test";
import { HelperBase } from "../base/helperBase";

export class FormLayoutPage extends HelperBase {

    constructor (page: Page){
        super(page);
    }

    /**
     * This method fill out the Using the Grid form with credentials and options
     * @param email - valid email for the test user
     * @param password - valid password for the test user
     * @param optionText - passes 'Option 1' or 'Option 2' for the test
     */
    async submitUsingGridForm(email: string, password: string, optionText:string){
        const usingTheGridForm = this.page.locator('nb-card', { hasText: "Using the Grid" });
        await usingTheGridForm.getByRole('textbox', { name: "Email"}).fill(email);
        await usingTheGridForm.getByRole('textbox', { name: "Password"}).fill(password);
        await usingTheGridForm.getByRole('radio', { name: optionText}).check({ force: true });
        await usingTheGridForm.getByRole('button').click();
    }

    /**
     * This method fill out the Inline form with user details
     * @param name - should be first and last name
     * @param email - valid email for the test user
     * @param rememberMe - true or false if user session to be saved
     */
    async submitInlineForm(name: string, email: string, rememberMe: boolean){
        const usingInlineForm = this.page.locator('nb-card', { hasText: "Inline Form" });
        await usingInlineForm.getByRole('textbox', { name: "Jane Doe"}).fill(name);
        await usingInlineForm.getByRole('textbox', { name: "Email"}).fill(email);
        if(rememberMe)
            await usingInlineForm.getByRole('checkbox').check({force: true});
        await usingInlineForm.getByRole('button').click();
    }
    

}