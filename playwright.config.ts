import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();

export default defineConfig<TestOptions>({
  timeout:40000, 
  //globalTimeout:60000, //Global timeout for each test
  expect:{
    timeout:2000
  },

  testDir: './tests',
  fullyParallel: true,

  retries:1,
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
      // Add Argos reporter.
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,

        // Set your Argos token (required if not using GitHub Actions).
        //token: "<YOUR-ARGOS-TOKEN>",
      },
    ],

    ['html'],
    //['json', {outputFile: 'test-results/test-results.json'}],
    //['junit', {outputFile: 'test-results/junit.xml'}],
    //['allure-playwright']
    ],
 

  use: {
    baseURL: 'http://localhost:4200/',
    globalSqaUrl: 'https://www.globalsqa.com/demo-site/draganddrop/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }
  },


  projects: [
    {
      name: 'dev',
        use: { ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
       }
    },

    {
      name: 'chromium'
    },

    {
      name: 'mobile',
      testMatch: 'testMobile.test.ts',
      use: { 
        ...devices['iPhone 15 Pro Max'] 
      }
    },

    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        video: {
        mode: 'on',
        size: {width: 1920, height: 1080}
        }
      } 
    },

    {
      name: 'pageObjectUltraHD',
      testMatch: 'usePageObjects.test.ts',
      use: {
        viewport: {width:3840, height:2160}
      }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
  }

});
