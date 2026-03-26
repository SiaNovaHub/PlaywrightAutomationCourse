const playwright = require('@playwright/test');
const { POManager } = require('../../pageobjects/POManager');
const { Before, After, BeforeStep, AfterStep, Status } = require('@cucumber/cucumber')

Before(async function () {
    const browser = await playwright.chromium.launch({ headless: false });
    const context = await browser.newContext();
    this.page = await context.newPage();
    this.poManager = new POManager(this.page);
});

BeforeStep(async function () {
    //await this.page.screenshot({ path: `screenshot-BeforeStep${Date.now()}.png` });
});

AfterStep(async function ({ result }) {
    if(result.status === Status.FAILED) {
        await this.page.screenshot({ path: `screenshot-AfterStep-${Date.now()}.png` });
    }
});

After(async function () {
    await this.page.close();
});