const { expect } = require("@playwright/test");

class OrdersHistoryPage {

    constructor(page) {
        this.page = page;
        this.ordersList = page.locator("tbody .ng-star-inserted");
        this.orderIdDetails = page.locator(".col-text");
    }

    async openViewOrderDetails(orderId) {
        await this.ordersList.first().waitFor();
        const ordersCount = await this.ordersList.count();
        let orderFound = false;

        for (let i = 0; i < ordersCount; ++i) {
            const orderIdValue = await this.ordersList.locator("[scope='row']").nth(i).textContent();
            if (orderIdValue === orderId) {
                await this.ordersList.nth(i).locator('.btn-primary').click();
                orderFound = true;
                break;
            }
        }

        expect(orderFound).toBeTruthy();
    }

    async getOrderIdInDetails() {
        return await this.orderIdDetails.textContent();
    }
}
module.exports = { OrdersHistoryPage };
