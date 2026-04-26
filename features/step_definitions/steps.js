const { expect } = require('@playwright/test');
const { Given, When, Then } = require('@cucumber/cucumber');

Given('I login to Ecomm app with {string} and {string}', { timeout: 100 * 1000 }, async function (email, password) {
    this.loginPage = this.poManager.getLoginPage();
    await this.loginPage.openWebsite();
    await this.loginPage.standardLogin(email, password);
});

Then('I see login error message', async function () {
    this.loginPage = this.poManager.getLoginPage();
    await this.loginPage.validateLoginErrorMessage();
});

When('I add {string} to the cart and navigate to cart', async function (productName) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.addProductToCart(productName);
    await this.dashboardPage.navigateToCart();
});

Then('I verify {string} is displayed in the cart', async function (productName) {
    this.checkoutPage = this.poManager.getCheckoutPage();
    await this.checkoutPage.validateProductInCart(productName);
});

When('I buy {string} from the cart', async function (productName) {
    this.checkoutPage = this.poManager.getCheckoutPage();
    await this.checkoutPage.buyProductNow(productName);
});

Then('I verify user email is displayed as {string}', async function (email) {
    this.checkoutPage = this.poManager.getCheckoutPage();
    await this.checkoutPage.validateUserEmail(email);
});

When('I proceed to checkout', async function () {
    this.checkoutPage = this.poManager.getCheckoutPage();
    await this.checkoutPage.navigateToCheckout();
});

When('I select the country as {string}', async function (countryName) {
    this.checkoutPage = this.poManager.getCheckoutPage();
    await this.checkoutPage.selectCountry(countryName);
});

When('I place an order', async function () {
    this.checkoutPage = this.poManager.getCheckoutPage();
    await this.checkoutPage.placeOrder();
});

Then('I validate the confirmation message and retrieve orderID', async function () {
    this.orderConfirmationPage = this.poManager.getOrderConfirmationPage();
    await this.orderConfirmationPage.validateConfirmationMessage();
    this.orderId = await this.orderConfirmationPage.getOrderId();
});

When('I navigate to orders page', async function () {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.navigateToOrders();
});

Then('I validate orderID in order details page', async function () {
    this.ordersHistoryPage = this.poManager.getOrdersHistoryPage();
    await this.ordersHistoryPage.openViewOrderDetails(this.orderId);
    expect(await this.ordersHistoryPage.getOrderIdInDetails()).toBe(this.orderId);
});
