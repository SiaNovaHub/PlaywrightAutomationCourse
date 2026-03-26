import { test as baseTest } from '@playwright/test';

interface TestDataForOrder {
            email: string,
            password: string,
            productName: string
};
export const customTest = baseTest.extend<{testDataForOrder:TestDataForOrder}>(
    {
        testDataForOrder: {
            email: "stacygrreen@gmail.com",
            password: "Xj2#hf3nD",
            productName: "ZARA COAT 3"
        },
    }
)