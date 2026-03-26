class OrdersHistoryPage {
    constructor(page) {
        this.page = page;
        this.ordersList = page.locator("tbody .ng-star-inserted");
        this.orderIdDetails = page.locator(".col-text");
    }
    async openViewOrderDetails(orderId) {
        await this.ordersList.first().waitFor();
        const ordersCount = await this.ordersList.count();
        for(let i=0; i < ordersCount; ++i)
        {
            const orderIdList = this.ordersList.locator("[scope='row']").nth(i);
            const orderIdValue = await orderIdList.textContent();
            if(orderIdValue === orderId)
            {
                await this.ordersList.nth(i).locator('.btn-primary').click();
                break;
            }
        }
    }
    async getOrderIdInDetails() {
        const orderIdDetails = await this.orderIdDetails.textContent();
        return orderIdDetails;
    }
}
module.exports = { OrdersHistoryPage };