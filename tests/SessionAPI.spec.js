const {test, expect, request} = require('@playwright/test');
let webContext;

test.beforeAll(async ({browser})=> {
    console.log("This will run before all tests");
    const context = await browser.newContext();
    const page = await context.newPage();
    const email = "stacygrreen@gmail.com";
    const password = "Xj2#hf3nD";
    await page.goto("https://rahulshettyacademy.com/client");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator(".card-body").first().waitFor();

    await context.storageState({path: 'state.json'}); //saves the storage state to a file, so that it can be used in other tests to maintain the session
    webContext = await browser.newContext({storageState: 'state.json'}); //creates a new context using the storage state file, so that the session is maintained in the new context
});

test('Client App E2E', async ({})=>
{
    const productName = "ZARA COAT 3";
    const email = "stacygrreen@gmail.com";

    const page = await webContext.newPage(); //creates a new page in the webContext, so that the session is maintained in the new page
    await page.goto("https://rahulshettyacademy.com/client");

    const products = page.locator(".card-body");

    await page.locator(".card-body").first().waitFor();
    await page.locator(".card-body").filter({hasText: productName}).getByRole('button', { name: 'Add To Cart' }).click();
   
    //navigate to the cart
    await page.getByRole('listitem').getByRole('button', { name: 'Cart' }).click();

    //validate the product is present
    await page.locator("div li").first().waitFor();
    await expect(page.getByText(productName)).toBeVisible();

    //Checkout
    await page.getByRole('button', { name: 'Checkout' }).click();
    
    //Fill Country dynamic dropdown
    await page.getByPlaceholder("Select Country").pressSequentially("ger", {delay:100});
    await page.getByRole('button', { name: 'Germany' }).click();

    //Check Email
    expect(page.locator(".user__name label")).toHaveText(email);

    //Click Place Order
    await page.locator(".action__submit").click();
    //Check the confirmation page
    await expect(page.getByRole('heading', { name: 'Thankyou for the order.' })).toBeVisible();
    const orderIdFull = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    const array1 = orderIdFull.split("|");
    const orderId = array1[1].split("|")[0].trim(); //saves order id
    console.log("OrderId:" + orderId);

    //Find the order in the Orders page
    await page.getByRole('button', { name: 'ORDERS' }).click();
    const ordersList = page.locator("tbody .ng-star-inserted");
    await ordersList.first().waitFor();
    const ordersCount = await ordersList.count();
    for(let i=0; i < ordersCount; ++i)
    {
        const orderIdList = ordersList.locator("[scope='row']").nth(i);
        const orderIdValue = await orderIdList.textContent();
        if(orderIdValue === orderId)
        {
            await ordersList.nth(i).locator('.btn-primary').click();
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId === orderIdDetails).toBeTruthy();
});