import {LoginPage} from './LoginPage';
import {DashboardPage} from './DashboardPage';
import {CheckoutPage} from './CheckoutPage';
import {OrderConfirmationPage} from './OrderConfirmationPage';
import {OrdersHistoryPage} from './OrdersHistoryPage';
import { type Page } from '@playwright/test';

export class POManager {
    page: Page;
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    checkoutPage: CheckoutPage;
    orderConfirmationPage: OrderConfirmationPage;
    OrdersHistoryPage: OrdersHistoryPage;

    constructor(page:any) {
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