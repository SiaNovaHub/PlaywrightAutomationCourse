const { expect } = require("@playwright/test");

class OrderConfirmationPage {

    constructor(page) {
        this.page = page;
        this.confirmationMessage = page.getByRole('heading', { name: 'Thankyou for the order.' });
        this.orderIdLabel = page.locator(".em-spacer-1 .ng-star-inserted");
    }

    async validateConfirmationMessage() {
        await expect(this.confirmationMessage).toBeVisible();
    }

    async getOrderId() {
        const orderIdFull = await this.orderIdLabel.textContent();
        const orderId = orderIdFull?.split("|")[1]?.split("|")[0]?.trim();
        expect(orderId).toBeTruthy();
        return orderId;
    }
}
module.exports = { OrderConfirmationPage };
