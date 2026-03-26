const { expect } = require('@playwright/test');
//const playwright = require('@playwright/test');
const { Given, When, Then } = require('@cucumber/cucumber')
//const { POManager } = require('../../pageobjects/POManager');

Given('I login to Ecomm app with {string} and {string}', {timeout : 100*1000}, async function (email, password) {
    const loginPage = this.poManager.getLoginPage();
    await loginPage.openWebsite();
    await loginPage.standardLogin(email, password);
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

When('I proceed to checkout and enter the country as {string}', async function (countryName) {
    await this.checkoutPage.navigateToCheckout();
    await this.checkoutPage.selectCountry(countryName);
});

When('I place an order', async function () {
    await this.checkoutPage.placeOrder();
});

Then('I validate the confirmation message and retrieve orderID', async function () {
    this.orderConfirmationPage = this.poManager.getOrderConfirmationPage();
    await this.orderConfirmationPage.validateConfirmationMessage();
    const orderId = await this.orderConfirmationPage.getOrderId();
    this.orderId = orderId; // Store orderId in context for use in subsequent steps
});

When('I navigate to orders page', async function () {
    await this.dashboardPage.navigateToOrders();
});

Then('I validate orderID in order details page', async function () {
    this.ordersHistoryPage = this.poManager.getOrdersHistoryPage();
    await this.ordersHistoryPage.openViewOrderDetails(this.orderId);
    expect(this.orderId === await this.ordersHistoryPage.getOrderIdInDetails()).toBeTruthy();
});