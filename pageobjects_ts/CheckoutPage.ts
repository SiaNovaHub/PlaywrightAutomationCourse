import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
    page: Page;
    checkoutBtn: Locator;
    selectCountryField: Locator;
    userNameLabel: Locator;
    placeOrderBtn: Locator;

    constructor(page:any) {
        this.page = page;
        this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
        this.selectCountryField = page.getByPlaceholder("Select Country");
        this.userNameLabel = page.locator(".user__name label");
        this.placeOrderBtn = page.locator(".action__submit");
    }
    async navigateToCheckout() {
        await this.checkoutBtn.click();
    }
    async validateProductInCart(productName:string) {
        await this.page.locator("div li").first().waitFor();
        await expect(this.page.getByText(productName)).toBeVisible();
    }
    async selectCountry(countryName:string) {
        await this.selectCountryField.pressSequentially(countryName, {delay:100});
        await this.page.getByRole('button', { name: countryName }).click();
    }
    async validateUserEmail(email:string) {
        expect(this.userNameLabel).toHaveText(email);
    }
    async placeOrder() {
        await this.placeOrderBtn.click();
    }
}