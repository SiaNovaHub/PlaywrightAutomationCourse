const { expect } = require("@playwright/test");

class CheckoutPage {

    constructor(page) {
        this.page = page;
        this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
        this.selectCountryField = page.getByPlaceholder("Select Country");
        this.userNameLabel = page.locator(".user__name label");
        this.placeOrderBtn = page.locator(".action__submit");
        this.cartProducts = page.locator("li.items");
    }

    async navigateToCheckout() {
        await this.checkoutBtn.click();
    }

    async validateProductInCart(productName) {
        await this.page.locator("div li").first().waitFor();
        await expect(this.page.getByText(productName)).toBeVisible();
    }

    async buyProductNow(productName) {
        await this.cartProducts.filter({ hasText: productName }).getByRole('button', { name: 'Buy Now' }).click();
    }

    async selectCountry(countryName) {
        await this.selectCountryField.pressSequentially(countryName, { delay: 100 });
        await this.page.getByRole('button', { name: countryName }).click();
    }

    async validateUserEmail(email) {
        await expect(this.userNameLabel).toHaveText(email);
    }

    async placeOrder() {
        await this.placeOrderBtn.click();
    }
}
module.exports = { CheckoutPage };
