import { test, expect } from '@playwright/test';

test.describe('MediManage UI', () => {
  test('should display the staff directory and handle search', async ({ page }) => {
    await page.goto('/');
    
    // Target the specific page heading, not the sidebar
    await expect(page.getByRole('heading', { name: 'Staff Directory' })).toBeVisible();
    await expect(page.locator('table')).toContainText('Jane Smith');
    
    await page.getByPlaceholder('Search by name or email...').fill('NonExistentPerson123');
    await expect(page.getByText('No staff members found.')).toBeVisible();
  });

  test('should navigate to a staff profile and show details', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Jane Smith' }).click();
    
    // Target the specific h1 text
    await expect(page.getByRole('heading', { name: 'Jane Smith' })).toBeVisible();
    await expect(page.locator('text=Current Department')).toBeVisible();
    await expect(page.locator('text=Assign Department')).toBeVisible();
  });

  test('should load the departments page', async ({ page }) => {
    await page.goto('/departments');
    
    // Target the specific h1 text
    await expect(page.getByRole('heading', { name: 'Departments' })).toBeVisible();
    await expect(page.locator('.grid > div').first()).toBeVisible();
  });
});
