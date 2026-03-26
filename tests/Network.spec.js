const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');

const fakePayLoadOrders = { data: [], "message": "No Orders" };
const loginPayLoad = { userEmail: "stacygrreen@gmail.com", userPassword: "Xj2#hf3nD" };
const orderPayLoad = { orders: [{ country: "Germany", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

let response;
test.beforeAll(async () => {
    console.log("This will run before all tests");
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);

});

test('Empty order history', async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token); //adds the token to the local storage before the page loads, so that the user is already logged in when the page loads

    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", async route => {
        //intercept the response - API response -> fake response -> browser -> render data on UI
        const response = await page.request.fetch(route.request());
        let body = JSON.stringify(fakePayLoadOrders);
        route.fulfill({
            response,
            body
        });
    });

    //Find the order in the Orders page
    await page.getByRole('button', { name: 'ORDERS' }).click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");


    console.log(await page.locator(".mt-4").textContent());

});