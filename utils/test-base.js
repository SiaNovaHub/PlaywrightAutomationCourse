const base = require('@playwright/test');

exports.customtest = base.test.extend(
    {
        testDataForOrder: {
            email: "stacygrreen@gmail.com",
            password: "Xj2#hf3nD",
            productName: "ZARA COAT 3"
        },
    }
)