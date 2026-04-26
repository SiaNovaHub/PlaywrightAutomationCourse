# Bug: Dashboard price filters do not narrow product results

## Summary
The dashboard accepts values in the **Min Price** and **Max Price** filter fields, but the product list is not filtered after the values are applied.

## Affected area
- Page: Rahul Shetty client app dashboard
- URL: `https://rahulshettyacademy.com/client/#/dashboard/dash`
- Feature coverage: `features/DashboardFiltering.feature`

## Failing scenarios
1. `Minimum price filter narrows results to higher priced products`
2. `Maximum price filter narrows results to lower priced products`

## Steps to reproduce
### Scenario 1 — Min Price
1. Log in to the client app.
2. Open the product dashboard.
3. Enter `12000` in the **Min Price** field.
4. Press `Enter`.

### Scenario 2 — Max Price
1. Log in to the client app.
2. Open the product dashboard.
3. Enter `20000` in the **Max Price** field.
4. Press `Enter`.

## Expected result
### Min Price = 12000
Only products priced at **12000 or more** should remain visible.
Expected visible product:
- `iphone 13 pro` (`55000`)

### Max Price = 20000
Only products priced at **20000 or less** should remain visible.
Expected visible products:
- `ADIDAS ORIGINAL` (`11500`)
- `ZARA COAT 3` (`11500`)

## Actual result
After applying either price filter, the dashboard continues showing the full default product list instead of narrowing the results.
Visible products remain:
- `ADIDAS ORIGINAL`
- `ZARA COAT 3`
- `iphone 13 pro`

## Test evidence
The bug is covered by failing BDD scenarios in:
- `features/DashboardFiltering.feature`

Relevant failure screenshots:
- `screenshot-minimum-price-filter-narrows-results-to-higher-priced-products-1776893817852.png`
- `screenshot-maximum-price-filter-narrows-results-to-lower-priced-products-1776893826465.png`

## Notes
- Search filtering works as expected.
- Household and combined checkbox filters can produce `0` results, so the dashboard filtering mechanism is not completely broken.
- The issue appears to be specific to the **price range filtering behavior**.
