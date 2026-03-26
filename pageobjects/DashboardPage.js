class DashboardPage {

    constructor(page) {
        this.page = page;
        this.products = page.locator(".card-body");
        this.addToCartBtn = page.getByRole('button', { name: 'Add To Cart' });
        this.cartBtn = page.getByRole('listitem').getByRole('button', { name: 'Cart' });
        this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
        this.selectCountryField = page.getByPlaceholder("Select Country");
        this.userNameLabel = page.locator(".user__name label");
        this.placeOrderBtn = page.locator(".action__submit");
        this.ordersBtn = page.getByRole('button', { name: 'ORDERS' });
    }

    async addProductToCart(productName) {
        await this.products.first().waitFor();
        await this.products.filter({hasText: productName}).getByRole('button', { name: 'Add To Cart' }).click();
    }
    async navigateToCart() {
        await this.cartBtn.click();
    }
    async navigateToOrders() {
        await this.ordersBtn.click();
    }
}
module.exports = { DashboardPage };