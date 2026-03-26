const {test, expect} = require('@playwright/test');

test('Browser Context Test', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://www.youtube.com/");
    console.log(await page.title());
    await expect(page).toHaveTitle("YouTube");
});

test('ParaBank First test', async ({page})=>
{
    const userName = page.locator('[name="username"]');
    const password = page.locator('[name="password"]');
    const logIn = page.locator("input[value='Log In']");


    await page.goto("http://localhost:8080/parabank/");
    console.log(await page.title());
    await expect(page).toHaveTitle("ParaBank | Welcome | Online Banking");
    await userName.fill('test');
    await logIn.click();
    console.log(await page.locator('.error').textContent());
    await expect(page.locator('.error')).toContainText('Please enter');

    await userName.fill('test2');
    await userName.fill('');
    
    await userName.fill('maryann');
    await password.fill('passtest');
    await logIn.click();
});

test('ParaBank link to child window', async ({browser})=>
{
    //need this context to be able to work in multiple contexts later
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("http://localhost:8080/parabank/");
    const externalLink = page.getByText('www.parasoft.com');

    //listens if any page wil be opened in the background
    //this step has to be before any steps that invlove new page
    //the 2 actions need to be tied together and ran async
    //no await needed for waitForEvent
    const [newPage] = await Promise.all(
    [
        context.waitForEvent('page'),
        await externalLink.click(),
    ])

    console.log(await newPage.title());
    await expect(newPage).toHaveTitle("Automated Testing to Deliver Superior Quality Software | Parasoft");

    const text = await newPage.locator('h2.text-balance').textContent();
    const arrayText = text.split(",");
    const input = arrayText[0].split("-")[0];

    await page.locator('[name="username"]').fill(input);
    console.log(await page.locator('[name="username"]').inputValue());
});

test('Client App E2E', async ({page})=>
{
    const products = page.locator(".card-body");
    const productName = "ZARA COAT 3";
    const email = "stacygrreen@gmail.com";
    const password = "Xj2#hf3nD";

    page.route('**/*.css', route => route.abort()); //aborts the request for css files, so that the page loads faster
    page.route('**/*.{jpg,png,jpeg}', route => route.abort()); //aborts the request for image files, so that the page loads faster

    page.on('request', request => console.log(request.url())); //logs all the requests made by the page, can be used for debugging and to check if the correct requests are being made
    page.on('response', response => console.log(response.url(), response.status())); //logs all the responses received by the page, can be used for debugging and to check if the correct responses are being received

    await page.goto("https://rahulshettyacademy.com/client");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator(".card-body").first().waitFor();
    await page.locator(".card-body").filter({hasText: productName}).getByRole('button', { name: 'Add To Cart' }).click();
    // const titles = await page.locator(".card-body b").allTextContents();
    // console.log(titles);

    // const productCount = await products.count();
    // for(let i = 0; i < productCount; ++i)
    // {
    //     if(await products.nth(i).locator("b").textContent() === productName)
    //     {
    //         await products.nth(i).locator("text= Add To Cart").click();
    //         break;
    //     }
    // }

    //navigate to the cart
    await page.getByRole('listitem').getByRole('button', { name: 'Cart' }).click();
    // await page.locator("[routerlink*='cart']").click();
    // await page.locator("div li").first().waitFor(); //isVisible is not supported to wait, so this step is needed to make sure the items are loaded

    //validate the product is present
    await page.locator("div li").first().waitFor();
    await expect(page.getByText(productName)).toBeVisible();
    //const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    //expect(bool).toBeTruthy();

    //Checkout
    await page.getByRole('button', { name: 'Checkout' }).click();
    //await page.locator("text='Checkout'").click();
    
    //Fill Country dynamic dropdown
    await page.getByPlaceholder("Select Country").pressSequentially("ger", {delay:100});
    //await page.locator("[placeholder*='Country']").pressSequentially("ger", {delay:100});
    // const dropdown = await page.locator(".ta-results");
    // await dropdown.waitFor();
    // const optionsCount = await dropdown.locator("button").count();
    // for(let i=0; i < optionsCount; ++i)
    // {
    //     const dropdownOption = dropdown.locator("button").nth(i);
    //     const dropdownOptionText = await dropdownOption.textContent();
    //     if(dropdownOptionText === " Germany")
    //     {
    //         await dropdownOption.click();
    //         break;
    //     }
    // }
    await page.getByRole('button', { name: 'Germany' }).click();

    //Check Email
    expect(page.locator(".user__name label")).toHaveText(email);

    //Click Place Order
    await page.locator(".action__submit").click();
    //Check the confirmation page
    //await expect(page.locator('h1')).toHaveText(" Thankyou for the order. ");
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

    //await page.pause();
});

test(`@Web PLaywright special locators`, async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    await page.getByLabel('Student').click();
    await page.getByLabel('Student').check();
    await page.getByPlaceholder('Password').fill('rahulshettyacademy');
    await page.getByLabel('Gender').selectOption('Female');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByText('Success! The Form has been submitted successfully!.').waitFor();
    await page.getByRole('link', { name: 'Shop' }).click();

    await page.locator('app-card').filter({ hasText: 'Nokia Edge'}).getByRole('button', { name: 'Add' }).click();
});

test(`@Web Calendar test`, async ({ page }) => {

    const monthNumber = "6";
    const day = "15";
    const year = "2025";
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
    await page.locator("//abbr[text()='" + day + "']").click();

    await expect(page.locator("[name='date']")).toHaveValue(year + "-" + monthNumber.padStart(2, '0') + "-" + day.padStart(2, '0'));

});

test(`@Web More validations test`, async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    // await page.goto('https://google.com');
    // await page.goBack();
    // await page.goForward();

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.locator("#show-textbox").click();
    await expect(page.locator("#displayed-text")).toBeVisible();

    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();

    await page.hover("#mousehover");
    await page.locator("a:has-text('Top')").click();

    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const text = await framesPage.locator(".text h2").textContent();
    console.log('Found text: ' + text);
    console.log('Number extracted:' + text.split(" ")[1]);
});

test('Screenshot and visual comparison test', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    await expect(page.locator("#displayed-text")).toBeVisible();

    await page.locator("#displayed-text").screenshot({ path: 'displayed-text.png' });
    await page.locator("#hide-textbox").click();

    await page.screenshot({ path: 'screenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();

});

test('Visual comparison test', async ({ page }) => {
    await page.goto('https://www.rediff.com/');
    expect(await page.screenshot()).toMatchSnapshot('landing.png');


    await expect(page.locator("#displayed-text")).toBeVisible();

    await page.locator("#displayed-text").screenshot({ path: 'displayed-text.png' });
    await page.locator("#hide-textbox").click();

    await page.screenshot({ path: 'screenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();

});