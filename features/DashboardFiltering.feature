Feature: Dashboard search and filtering

    Background:
        Given I login to Ecomm app with "stacygrreen@gmail.com" and "Xj2#hf3nD"
        And I am on the product dashboard

    @Regression @DashboardFilters
    Scenario: Search narrows the dashboard to the matching product
        Then I should see 3 dashboard products
        When I search the dashboard for "ZARA"
        Then the product search field should have value "ZARA"
        And I should see 1 dashboard product
        And I should only see the following dashboard products:
            | productName |
            | ZARA COAT 3 |

    @Regression @DashboardFilters
    Scenario: Clearing the search restores the default product list
        When I search the dashboard for "ZARA"
        And I clear the dashboard search
        Then the product search field should have value ""
        And I should see 3 dashboard products
        And I should only see the following dashboard products:
            | productName     |
            | ADIDAS ORIGINAL |
            | ZARA COAT 3     |
            | iphone 13 pro   |

    @Regression @DashboardFilters
    Scenario: Minimum price filter narrows results to higher priced products
        When I set the minimum price filter to "12000"
        Then the minimum price filter should have value "12000"
        And I should see 1 dashboard product
        And I should only see the following dashboard products:
            | productName   |
            | iphone 13 pro |
        When I clear the minimum price filter
        Then the minimum price filter should have value ""
        And I should see 3 dashboard products

    @Regression @DashboardFilters
    Scenario: Maximum price filter narrows results to lower priced products
        When I set the maximum price filter to "20000"
        Then the maximum price filter should have value "20000"
        And I should see 2 dashboard products
        And I should only see the following dashboard products:
            | productName     |
            | ADIDAS ORIGINAL |
            | ZARA COAT 3     |
        When I clear the maximum price filter
        Then the maximum price filter should have value ""
        And I should see 3 dashboard products

    @Regression @DashboardFilters
    Scenario: Household category shows no matching products
        When I enable the "household" checkbox in the "Categories" filter section
        Then the "household" checkbox in the "Categories" filter section should be enabled
        And no dashboard products should be shown

    @Regression @DashboardFilters
    Scenario: Multiple checkbox filters can be combined with no matching products
        When I enable the "household" checkbox in the "Categories" filter section
        And I enable the "t-shirts" checkbox in the "Sub Categories" filter section
        And I enable the "shirts" checkbox in the "Sub Categories" filter section
        And I enable the "shoes" checkbox in the "Sub Categories" filter section
        And I enable the "men" checkbox in the "Search For" filter section
        And I enable the "women" checkbox in the "Search For" filter section
        Then the "household" checkbox in the "Categories" filter section should be enabled
        And the "t-shirts" checkbox in the "Sub Categories" filter section should be enabled
        And the "shirts" checkbox in the "Sub Categories" filter section should be enabled
        And the "shoes" checkbox in the "Sub Categories" filter section should be enabled
        And the "men" checkbox in the "Search For" filter section should be enabled
        And the "women" checkbox in the "Search For" filter section should be enabled
        And no dashboard products should be shown
