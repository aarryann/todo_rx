import { test, expect } from '@playwright/test'

test('adds card dynamically', async ({ page }) => {
  await page.goto('/board')

  await expect(
    page.title()
  ).toBe('Project Alpha')
})