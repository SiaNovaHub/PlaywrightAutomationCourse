const test = require('@playwright/test');
// Reusable prerequisite helper (T-01 subset)
// Later can be moved to a shared helper file or a POM method
async function fillPersonalDataAndContinue(page) {
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByText('Für mich').click();
  await page.locator("#consent_processing").check({ force: true });
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByPlaceholder('TT.MM.JJJJ').fill('01.03.1990');
  await page.getByText('Männlich').click();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.locator('#react-select-2-input').click();
  await page.locator('#react-select-2-input').fill('Bay');
  await page.getByText('Bayern').click();
  await page.locator("#residenceConfirmation").check({ force: true });
  await page.getByRole('button', { name: 'Weiter' }).click();
}
// Path-specific helpers are defined outside of the spec file
test.describe('Consent Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://patient-app.fe.demo.teleclinic.de/info/91");
    await fillPersonalDataAndContinue(page);
  });

  test('T-04: Mit Vorteil path - user cannot proceed without consent', async ({ page }) => {
    await selectInsurance("AOK Bayern (GKV)");
    await chooseWithBenefitsOption();
    await assertConsentModalStateAndContent();
    await attemptContinueWithoutConsent();
    await closeConsentModal();
    await chooseWithBenefitsOption();
    await assertConsentModalStateAndContent();
  });
});



