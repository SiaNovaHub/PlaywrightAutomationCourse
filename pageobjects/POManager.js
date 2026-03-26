const {LoginPage} = require ('./LoginPage');
const {DashboardPage} = require ('./DashboardPage');
const { CheckoutPage } = require('./CheckoutPage');
const { OrderConfirmationPage } = require('./OrderConfirmationPage');
const { OrdersHistoryPage } = require('./OrdersHistoryPage');

class POManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.checkoutPage = new CheckoutPage(page);
        this.orderConfirmationPage = new OrderConfirmationPage(page);
        this.OrdersHistoryPage = new OrdersHistoryPage(page);
    }
    getLoginPage() {
        return this.loginPage;
    }
    getDashboardPage() {
        return this.dashboardPage;
    }
    getCheckoutPage() {
        return this.checkoutPage;
    }
    getOrderConfirmationPage() {
        return this.orderConfirmationPage;
    }
    getOrdersHistoryPage() {
        return this.OrdersHistoryPage;
    }
}
module.exports = { POManager };