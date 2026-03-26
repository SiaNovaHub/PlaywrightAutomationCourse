const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('../utils/APIUtils');

const loginPayLoad = {userEmail: "stacygrreen@gmail.com", userPassword: "Xj2#hf3nD"};
const orderPayLoad = {orders: [{country: "Germany", productOrderedId: "6960eac0c941646b7a8b3e68"}]};

let response;
test.beforeAll(async ()=> {
    console.log("This will run before all tests");
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);

});

test('Order history test', async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token); //adds the token to the local storage before the page loads, so that the user is already logged in when the page loads

    await page.goto("https://rahulshettyacademy.com/client");

    //Find the order in the Orders page
    await page.getByRole('button', { name: 'ORDERS' }).click();
    const ordersList = page.locator("tbody .ng-star-inserted");
    await ordersList.first().waitFor();
    const ordersCount = await ordersList.count();
    for(let i=0; i < ordersCount; ++i)
    {
        const orderIdList = ordersList.locator("[scope='row']").nth(i);
        const orderIdValue = await orderIdList.textContent();
        if(orderIdValue === response.orderId)
        {
            await ordersList.nth(i).locator('.btn-primary').click();
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(response.orderId === orderIdDetails).toBeTruthy();

});