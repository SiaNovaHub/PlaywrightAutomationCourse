import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
    page: Page;
    logInBtn: Locator;
    userEmailField: Locator;
    userPasswordField: Locator;

    constructor(page:any) {
        this.page = page;
        this.logInBtn = page.getByRole('button', { name: 'Login' });
        this.userEmailField = page.getByPlaceholder("email@example.com");
        this.userPasswordField = page.getByPlaceholder("enter your passsword");
    }

    async openWebsite() {
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

    async standardLogin(email:string, password:string) {
        await this.userEmailField.fill(email);
        await this.userPasswordField.fill(password);
        await this.logInBtn.click();
    }

    async validateLoginErrorMessage() {
        await expect(this.page.getByText("Incorrect email or password.")).toBeVisible();
    }

}