Feature: Buy Now order placement

    @Regression @Orders
    Scenario: Place an ADIDAS ORIGINAL order from the cart Buy Now flow
        Given I login to Ecomm app with "stacygrreen@gmail.com" and "Xj2#hf3nD"
        When I add "ADIDAS ORIGINAL" to the cart and navigate to cart
        Then I verify "ADIDAS ORIGINAL" is displayed in the cart
        When I buy "ADIDAS ORIGINAL" from the cart
        Then I verify user email is displayed as "stacygrreen@gmail.com"
        When I select the country as "Germany"
        And I place an order
        Then I validate the confirmation message and retrieve orderID
        When I navigate to orders page
        Then I validate orderID in order details page
