const { Given, When, Then } = require('@cucumber/cucumber');

Given('I am on the product dashboard', async function () {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.waitForDashboardToLoad();
});

When('I search the dashboard for {string}', async function (productName) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.searchForProduct(productName);
});

When('I clear the dashboard search', async function () {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.clearProductSearch();
});

Then('the product search field should have value {string}', async function (productName) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.validateSearchValue(productName);
});

Then('I should see {int} dashboard product', async function (count) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.validateResultsCount(count);
});

Then('I should see {int} dashboard products', async function (count) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.validateResultsCount(count);
});

Then('I should only see the following dashboard products:', async function (dataTable) {
    this.dashboardPage = this.poManager.getDashboardPage();
    const productNames = dataTable.hashes().map((row) => row.productName);
    await this.dashboardPage.validateVisibleProducts(productNames);
});

When('I set the minimum price filter to {string}', async function (price) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.setMinPrice(price);
});

When('I clear the minimum price filter', async function () {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.clearMinPrice();
});

Then('the minimum price filter should have value {string}', async function (price) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.validateMinPriceValue(price);
});

When('I set the maximum price filter to {string}', async function (price) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.setMaxPrice(price);
});

When('I clear the maximum price filter', async function () {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.clearMaxPrice();
});

Then('the maximum price filter should have value {string}', async function (price) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.validateMaxPriceValue(price);
});

When('I enable the {string} checkbox in the {string} filter section', async function (checkboxName, sectionName) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.setFilterCheckboxState(sectionName, checkboxName, true);
});

When('I disable the {string} checkbox in the {string} filter section', async function (checkboxName, sectionName) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.setFilterCheckboxState(sectionName, checkboxName, false);
});

Then('the {string} checkbox in the {string} filter section should be enabled', async function (checkboxName, sectionName) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.validateFilterCheckboxState(sectionName, checkboxName, true);
});

Then('the {string} checkbox in the {string} filter section should be disabled', async function (checkboxName, sectionName) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.validateFilterCheckboxState(sectionName, checkboxName, false);
});

Then('no dashboard products should be shown', async function () {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.validateNoProductsFound();
});
