const { test, expect } = require('@playwright/test');

const SIX_EVENTS_RESPONSE = {
  data: [
    { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
    { id: 2, title: 'Rock Night Live',  category: 'Concert',    eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
    { id: 3, title: 'IPL Finals',       category: 'Sports',     eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
    { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
    { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
    { id: 6, title: 'AI & ML Expo',    category: 'Conference',  eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
  ],
  pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};

const FOUR_EVENTS_RESPONSE = {
  data: [
    { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
    { id: 2, title: 'Rock Night Live',  category: 'Concert',    eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
    { id: 3, title: 'IPL Finals',       category: 'Sports',     eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
    { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
  ],
  pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};

async function loginAndGoToEvents(page) {
    await page.goto('/login');
    await page.getByPlaceholder("you@email.com").fill("mockemail@test.com");
    await page.getByPlaceholder("••••••").fill("testPass1!");
    await page.getByRole('button', { name: 'Sign In' }).click();
    // Wait for navigation to complete
    await page.waitForURL(/\/(events|dashboard|home)/, { timeout: 10000 }).catch(() => {});
    await page.goto('/events');
    await page.waitForLoadState('domcontentloaded');
}

test('Banner IS visible when 6 events are returned', async ({ page }) => {
    // Step 1 — Set up the API mock BEFORE navigation
    await page.route('**/api/events**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(SIX_EVENTS_RESPONSE)
        });
    });

    // Step 2 — Login and navigate
    await loginAndGoToEvents(page);

    // Step 3 — Verify cards loaded from mock
    const eventCards = page.locator('article');
    await eventCards.first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(eventCards).toHaveCount(6);

    // Step 4 — Verify banner is visible
    const banner = page.locator('text=/sandbox holds up to/i');
    await banner.waitFor({ state: 'visible', timeout: 5000 });
    await expect(banner).toContainText('9 bookings');
});

test('Banner is NOT visible when 4 events are returned', async ({ page }) => {
    // Step 1 — Set up the API mock BEFORE navigation
    await page.route('**/api/events**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(FOUR_EVENTS_RESPONSE)
        });
    });

    // Step 2 — Login and navigate
    await loginAndGoToEvents(page);

    // Step 3 — Verify cards loaded from mock
    const eventCards = page.locator('article');
    await eventCards.first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(eventCards).toHaveCount(4);

    // Step 4 — Verify banner is hidden
    const banner = page.locator('text=/sandbox holds up to/i');
    await expect(banner).not.toBeVisible({ timeout: 5000 });
});