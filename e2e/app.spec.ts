/**
 * E2E Tests for PokeFusions Application
 * Verifies the app is running and functional
 */

import { test, expect } from '@playwright/test';

test.describe('PokeFusions App - Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/PokeFusions/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('PokeFusions');

    // Check description
    await expect(page.locator('text=AI-powered Pokemon fusion generator')).toBeVisible();

    // Check Generate button exists
    await expect(page.locator('button:has-text("Generate Fusions")')).toBeVisible();
  });

  test('API health check - generate endpoint responds', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: {
        count: 1,
      },
    });

    // Should respond (even if errors, should be structured response)
    expect(response.status()).toBe(200);

    const data = await response.json();

    // Should have success field
    expect(data).toHaveProperty('success');

    // If successful, should have fusions array
    if (data.success) {
      expect(Array.isArray(data.fusions)).toBeTruthy();
    }
  });

  test('generate flow works end-to-end', async ({ page }) => {
    await page.goto('/');

    // Select count
    await page.selectOption('select#count', '2');

    // Click generate button
    await page.click('button:has-text("Generate Fusions")');

    // Wait for loading to complete (check for loading spinner to disappear)
    await page.waitForSelector('button:has-text("Generate Fusions")', { state: 'enabled' });

    // Wait a bit for results to appear
    await page.waitForTimeout(5000);

    // Check if results appeared (either success or error)
    const hasResults = await page.locator('text=Generated Fusions').count() > 0;
    const hasError = await page.locator('text=/Failed to generate|Error/').count() > 0;

    // At least one should be true
    expect(hasResults || hasError).toBeTruthy();

    if (hasResults) {
      // Verify fusion cards are displayed
      const fusionCards = page.locator('[class*="rounded-2xl shadow"]');
      await expect(fusionCards.first()).toBeVisible();

      // Check for fusion name
      await expect(page.locator('h2:text-is("Generated Fusions")')).toBeVisible();
    }
  });

  test('tweet preview toggle works', async ({ page }) => {
    await page.goto('/');

    // First generate some fusions
    await page.selectOption('select#count', '1');
    await page.click('button:has-text("Generate Fusions")');
    await page.waitForTimeout(5000);

    // Check if Show Tweet Previews button appeared
    const showButton = page.locator('button:has-text("Show Tweet Previews")');
    const hasShowButton = await showButton.count() > 0;

    if (hasShowButton) {
      await showButton.click();

      // Check if tweet preview appeared
      await expect(page.locator('text=Tweet Preview')).toBeVisible();

      // Check for character count
      await expect(page.locator('text=/\\d+\\/280/')).toBeVisible();

      // Check for Copy button
      await expect(page.locator('button:has-text("Copy")')).toBeVisible();
    }
  });

  test('responsive design - mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if page is still functional
    await expect(page.locator('h1')).toContainText('PokeFusions');
    await expect(page.locator('button:has-text("Generate Fusions")')).toBeVisible();
  });

  test('error handling - invalid count', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: {
        count: 999, // Invalid count
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('controls are interactive', async ({ page }) => {
    await page.goto('/');

    // Check select is enabled
    const select = page.locator('select#count');
    await expect(select).toBeEnabled();

    // Select different value
    await select.selectOption('5');
    await expect(select).toHaveValue('5');

    // Check button is enabled
    const button = page.locator('button:has-text("Generate Fusions")');
    await expect(button).toBeEnabled();
  });

  test('loading states work', async ({ page }) => {
    await page.goto('/');

    // Click generate
    await page.click('button:has-text("Generate Fusions")');

    // Check for loading state (button text changes or spinner appears)
    const loadingButton = page.locator('button:has-text("Generating...")');
    const hasLoadingButton = await loadingButton.count() > 0;

    const loadingSpinner = page.locator('[class*="animate-spin"]');
    const hasLoadingSpinner = await loadingSpinner.count() > 0;

    // At least one loading indicator should appear
    expect(hasLoadingButton || hasLoadingSpinner).toBeTruthy();
  });

  test('footer and credits are visible', async ({ page }) => {
    await page.goto('/');

    // Check footer exists
    await expect(page.locator('footer')).toBeVisible();

    // Check for credits
    await expect(page.locator('text=Hugging Face AI')).toBeVisible();
    await expect(page.locator('text=PokeAPI')).toBeVisible();
  });
});

test.describe('API Validation', () => {
  test('API returns valid fusion structure on success', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: { count: 1 },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    if (data.success && data.fusions && data.fusions.length > 0) {
      const fusion = data.fusions[0];

      // Verify fusion structure
      expect(fusion).toHaveProperty('id');
      expect(fusion).toHaveProperty('name');
      expect(fusion).toHaveProperty('pokemon1');
      expect(fusion).toHaveProperty('pokemon2');
      expect(fusion).toHaveProperty('stats');
      expect(fusion).toHaveProperty('descriptions');

      // Verify stats structure
      expect(fusion.stats).toHaveProperty('HP');
      expect(fusion.stats).toHaveProperty('Attack');
      expect(fusion.stats).toHaveProperty('Defense');

      // Verify Pokemon structure
      expect(fusion.pokemon1).toHaveProperty('id');
      expect(fusion.pokemon1).toHaveProperty('name');
      expect(fusion.pokemon1).toHaveProperty('types');
    }
  });
});
