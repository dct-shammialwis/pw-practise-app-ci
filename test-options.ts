import {test as base} from 'playwright/test'

export type TestOptions = {
    globalSqaUrl: string;
}


/* The first element ('') is the default value of the fixture if you don't explicitly pass anything.
The second element ({ option: true }) tells Playwright that this value can be overridden from the command line or config. */
export const test = base.extend<TestOptions>({
    globalSqaUrl: ['', {option: true}]
})