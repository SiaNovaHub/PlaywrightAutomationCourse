const { test, expect } = require('@playwright/test');

// Test credentials - dummy accounts that need to be created on the server first
const YAHOO_USER = {
    email: 'yahooacc@yahoo.com',
    password: 'Yahoo@123456'
};

const GMAIL_USER = {
    email: 'gmailacc@gmail.com',
    password: 'Gmail@123456'
};

const API_URL = 'https://eventhub.rahulshettyacademy.com/api';

async function loginUserViaUI(page, email, password) {
    await page.goto('/login');
    await page.getByPlaceholder("you@email.com").fill(email);
    await page.getByPlaceholder("••••••").fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/(events|dashboard|home|bookings)/, { timeout: 10000 }).catch(() => {});
    await page.waitForLoadState('domcontentloaded');
}

async function logoutUser(page) {
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.waitForURL('/login', { timeout: 5000 }).catch(() => {});
}

async function getFirstEventId(page) {
    // Navigate to events page
    await page.goto('/events');
    await page.waitForLoadState('domcontentloaded');
    
    // Get the first event's link
    const firstEventLink = page.locator('article').first().locator('a').first();
    const href = await firstEventLink.getAttribute('href');
    
    // Extract event ID from URL (e.g., /events/1 => 1)
    const eventId = href.split('/').pop();
    return parseInt(eventId);
}

async function createBookingViaUI(page, eventId) {
    // Navigate to events page
    await page.goto('/events');
    await page.waitForLoadState('domcontentloaded');
    
    // Find and click the "Book Now" button for the event
    const eventArticles = page.locator('article');
    for (let i = 0; i < await eventArticles.count(); i++) {
        const article = eventArticles.nth(i);
        const links = article.locator('a');
        let found = false;
        for (let j = 0; j < await links.count(); j++) {
            const link = links.nth(j);
            const href = await link.getAttribute('href');
            if (href === `/events/${eventId}`) {
                // Found event, now find and click Book Now
                const bookButton = article.locator('a').filter({ hasText: 'Book Now' }).first();
                await bookButton.click();
                await page.waitForLoadState('domcontentloaded');
                found = true;
                break;
            }
        }
        if (found) break;
    }
    
    // Fill booking form
    await page.getByPlaceholder('Enter customer name').fill('Test Booker');
    await page.getByPlaceholder('Enter customer email').fill('booker@test.com');
    await page.getByPlaceholder('Enter phone number').fill('9876543210');
    await page.getByRole('button', { name: /continue|book|confirm/i }).click();
    await page.waitForLoadState('domcontentloaded');
    
    // Extract booking ID from URL or page content
    const url = page.url();
    const bookingIdMatch = url.match(/bookings\/(\d+)/);
    if (bookingIdMatch) {
        return parseInt(bookingIdMatch[1]);
    }
    
    // If not in URL, try to find it on the page
    const bookingIdText = await page.getByText(/Booking ID|ID:/i).first().textContent();
    const match = bookingIdText?.match(/\d+/);
    return match ? parseInt(match[0]) : null;
}

test.describe('Access Denied - User B cannot view User A\'s booking', () => {
    test('Verify Access Denied when accessing another user\'s booking', async ({ page }) => {
        // Step 1 — Login as Yahoo user via UI
        await loginUserViaUI(page, YAHOO_USER.email, YAHOO_USER.password);

        // Step 2 — Get first event ID
        const eventId = await getFirstEventId(page);

        // Step 3 — Create a booking as Yahoo user via UI
        const yahooBookingId = await createBookingViaUI(page, eventId);
        expect(yahooBookingId).toBeTruthy();

        // Step 4 — Logout Yahoo user
        await logoutUser(page);

        // Step 5 — Login as Gmail user via UI
        await loginUserViaUI(page, GMAIL_USER.email, GMAIL_USER.password);

        // Step 6 — Navigate to Yahoo's booking URL as Gmail user
        await page.goto(`/bookings/${yahooBookingId}`, { waitUntil: 'domcontentloaded' });

        // Step 7 — Verify Access Denied error
        await expect(page.getByText('Access Denied')).toBeVisible({ timeout: 5000 });
        await expect(page.getByText('You are not authorized to view this booking')).toBeVisible({ timeout: 5000 });
    });
});
