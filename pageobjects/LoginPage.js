const { expect } = require("allure-playwright");

class LoginPage {

    constructor(page) {
        this.page = page;
        this.logInBtn = page.getByRole('button', { name: 'Login' });
        this.userEmailField = page.getByPlaceholder("email@example.com");
        this.userPasswordField = page.getByPlaceholder("enter your passsword");
    }

    async openWebsite() {
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

    async standardLogin(email, password) {
        await this.userEmailField.fill(email);
        await this.userPasswordField.fill(password);
        await this.logInBtn.click();
    }

    async validateLoginErrorMessage() {
        await expect(this.page.getByText("Incorrect email or password.")).toBeVisible();
    }

}
module.exports = { LoginPage };