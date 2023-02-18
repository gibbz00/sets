import { expect, test } from '@playwright/test';

test('Starts on monday', async ({ page }) => {
	await page.goto('/planning');
	expect(await page.textContent('div')).toBe('Monday');
});
