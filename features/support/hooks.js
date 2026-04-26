const { chromium } = require('@playwright/test');
const { Before, After, AfterStep, Status } = require('@cucumber/cucumber');
const { POManager } = require('../../pageobjects/POManager');

Before(async function () {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.poManager = new POManager(this.page);
});

AfterStep(async function ({ pickle, result }) {
    if (result.status === Status.FAILED) {
        const scenarioName = pickle.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
        await this.page.screenshot({ path: `screenshot-${scenarioName}-${Date.now()}.png` });
    }
});

After(async function () {
    await this.page.close();
    await this.context.close();
    await this.browser.close();
});
