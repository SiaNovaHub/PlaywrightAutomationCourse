Feature: Order placement

    @Regression @Orders
    Scenario: Place an order from the cart
        Given I login to Ecomm app with "stacygrreen@gmail.com" and "Xj2#hf3nD"
        When I add "ZARA COAT 3" to the cart and navigate to cart
        Then I verify "ZARA COAT 3" is displayed in the cart
        When I proceed to checkout
        And I select the country as "Germany"
        When I place an order
        Then I validate the confirmation message and retrieve orderID
        When I navigate to orders page
        Then I validate orderID in order details page