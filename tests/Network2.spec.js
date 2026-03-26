const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');

const loginPayLoad = { userEmail: "stacygrreen@gmail.com", userPassword: "Xj2#hf3nD" };
const orderPayLoad = { orders: [{ country: "Germany", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

let response;
test.beforeAll(async () => {
    console.log("This will run before all tests");
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);

});

test('Security test request intercept', async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token); //adds the token to the local storage before the page loads, so that the user is already logged in when the page loads

    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*", async route =>
        route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=3353vcf3355dsd566345f34' }));
    //intercept the request
    // and change the order id in the request to a different order id, 
    // so that the user is not able to see the details of the order that was created in the beforeAll hook,
    // which is a security test to check if the user is able to access the details 
    // of other orders by changing the order id in the request

    //Find the order in the Orders page
    await page.getByRole('button', { name: 'ORDERS' }).click();
    await page.locator("button:has-text('View')").first().click();

    await expect(page.locator(".blink_me")).toHaveText("You are not authorize to view this order");


});