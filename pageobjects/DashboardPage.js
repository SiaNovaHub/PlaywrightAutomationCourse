const { expect } = require("@playwright/test");

class DashboardPage {

    constructor(page) {
        this.page = page;
        this.filtersSidebar = page.locator("section#sidebar");
        this.products = page.locator(".card-body");
        this.productTitles = page.locator(".card-body b");
        this.cartBtn = page.getByRole('listitem').getByRole('button', { name: 'Cart' });
        this.ordersBtn = page.getByRole('button', { name: 'ORDERS' });
        this.searchField = this.filtersSidebar.locator('input[name="search"]');
        this.minPriceField = this.filtersSidebar.locator('input[name="minPrice"]');
        this.maxPriceField = this.filtersSidebar.locator('input[name="maxPrice"]');
        this.resultsCountLabel = page.locator("#res");
    }

    getFilterSection(sectionName) {
        return this.filtersSidebar.getByRole('heading', { name: sectionName }).locator('xpath=..');
    }

    getFilterCheckbox(sectionName, checkboxName) {
        const exactCheckboxName = new RegExp(`^\\s*${checkboxName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
        return this.getFilterSection(sectionName).locator('.form-group').filter({ hasText: exactCheckboxName }).locator('input[type="checkbox"]');
    }

    getProductCard(productName) {
        return this.products.filter({ hasText: productName });
    }

    async waitForDashboardToLoad() {
        await this.products.first().waitFor();
    }

    async addProductToCart(productName) {
        await this.products.first().waitFor();
        await this.getProductCard(productName).getByRole('button', { name: 'Add To Cart' }).click();
    }

    async searchForProduct(productName) {
        await this.searchField.fill(productName);
        await this.searchField.press('Enter');
    }

    async clearProductSearch() {
        await this.searchField.fill('');
        await this.searchField.press('Enter');
    }

    async validateSearchValue(productName) {
        await expect(this.searchField).toHaveValue(productName);
    }

    async setMinPrice(price) {
        await this.minPriceField.fill(price);
        await this.minPriceField.press('Enter');
    }

    async clearMinPrice() {
        await this.minPriceField.fill('');
        await this.minPriceField.press('Enter');
    }

    async validateMinPriceValue(price) {
        await expect(this.minPriceField).toHaveValue(price);
    }

    async setMaxPrice(price) {
        await this.maxPriceField.fill(price);
        await this.maxPriceField.press('Enter');
    }

    async clearMaxPrice() {
        await this.maxPriceField.fill('');
        await this.maxPriceField.press('Enter');
    }

    async validateMaxPriceValue(price) {
        await expect(this.maxPriceField).toHaveValue(price);
    }

    async setFilterCheckboxState(sectionName, checkboxName, checked) {
        const checkbox = this.getFilterCheckbox(sectionName, checkboxName);
        if (checked) {
            await checkbox.check();
        }
        else {
            await checkbox.uncheck();
        }
    }

    async validateFilterCheckboxState(sectionName, checkboxName, checked) {
        const checkbox = this.getFilterCheckbox(sectionName, checkboxName);
        if (checked) {
            await expect(checkbox).toBeChecked();
        }
        else {
            await expect(checkbox).not.toBeChecked();
        }
    }

    async validateResultsCount(count) {
        await expect(this.products).toHaveCount(count);
        await expect(this.resultsCountLabel).toContainText(`Showing ${count} results`);
    }

    async validateVisibleProducts(productNames) {
        await expect(this.products).toHaveCount(productNames.length);
        expect((await this.productTitles.allTextContents()).map((product) => product.trim())).toEqual(productNames);
    }

    async validateNoProductsFound() {
        await expect(this.products).toHaveCount(0);
        await expect(this.resultsCountLabel).toContainText('Showing 0 results');
    }

    async navigateToCart() {
        await this.cartBtn.click();
    }

    async navigateToOrders() {
        await this.ordersBtn.click();
    }
}
module.exports = { DashboardPage };
