import { expect, test } from '@playwright/test';
import { customTest } from '../utils_ts/test-base';
import { POManager } from '../pageobjects_ts/POManager';
const dataset = JSON.parse(JSON.stringify(require("../utils_ts/testData/PageObjectPracticeTestData.json")));

for (const data of dataset) {
    test(`Client App ${data.productName}`, async ({ page }) => {
        const poManager = new POManager(page);
        const loginPage = poManager.getLoginPage();
        const dashboardPage = poManager.getDashboardPage();
        const checkoutPage = poManager.getCheckoutPage();
        const ordersHistoryPage = poManager.getOrdersHistoryPage();
        const orderConfirmationPage = poManager.getOrderConfirmationPage();

        await loginPage.openWebsite();
        await loginPage.standardLogin(data.email, data.password);

        await dashboardPage.addProductToCart(data.productName);
        await dashboardPage.navigateToCart();

        await checkoutPage.validateProductInCart(data.productName);
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectCountry("Germany");
        await checkoutPage.validateUserEmail(data.email);
        await checkoutPage.placeOrder();

        await orderConfirmationPage.validateConfirmationMessage();
        const orderId = await orderConfirmationPage.getOrderId();

        await dashboardPage.navigateToOrders();
        await ordersHistoryPage.openViewOrderDetails(orderId);
        expect(orderId === await ordersHistoryPage.getOrderIdInDetails()).toBeTruthy();
    });
}

customTest(`Client App with custom fixtures`, async ({ page, testDataForOrder }) => {
        const poManager = new POManager(page);
        const loginPage = poManager.getLoginPage();
        const dashboardPage = poManager.getDashboardPage();
        const checkoutPage = poManager.getCheckoutPage();

        await loginPage.openWebsite();
        await loginPage.standardLogin(testDataForOrder.email, testDataForOrder.password);

        await dashboardPage.addProductToCart(testDataForOrder.productName);
        await dashboardPage.navigateToCart();

        await checkoutPage.validateProductInCart(testDataForOrder.productName);
        await checkoutPage.navigateToCheckout();
});
