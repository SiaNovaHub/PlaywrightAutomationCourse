import { expect, type Locator, type Page } from '@playwright/test';

export class OrderConfirmationPage {
    page: Page;
    confirmationMessage: Locator;

    constructor(page:any) {
        this.page = page;
        this.confirmationMessage = page.getByRole('heading', { name: 'Thankyou for the order.' });
    }
    async validateConfirmationMessage() {
        await expect(this.confirmationMessage).toBeVisible();
    }
    async getOrderId() {
        const orderIdFull = await this.page.locator(".em-spacer-1 .ng-star-inserted").textContent();
        if (!orderIdFull) {
            throw new Error("Order ID text content not found");
        }
        const array1 = orderIdFull.split("|");
        const orderId = array1[1].split("|")[0].trim();
        console.log("OrderId:" + orderId);
        return orderId;
    }
}