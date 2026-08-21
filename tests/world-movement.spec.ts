import { expect, test } from '@playwright/test'

test('Phaser scene boots and the player moves with keyboard and D-pad', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/event/demo/world')
  const world = page.locator('.phaser-world')
  await expect(world).toHaveAttribute('data-phaser-ready', 'true', { timeout: 15_000 })
  await world.focus()

  const initialX = Number(await world.getAttribute('data-player-x'))
  await page.keyboard.down('d')
  await page.waitForTimeout(1_000)
  await page.keyboard.up('d')
  await expect.poll(async () => Number(await world.getAttribute('data-player-x'))).toBeGreaterThan(initialX + 8)

  const initialY = Number(await world.getAttribute('data-player-y'))
  await page.getByRole('button', { name: 'เดินขึ้น' }).click()
  await expect.poll(async () => Number(await world.getAttribute('data-player-y')), { timeout: 5_000 }).toBeLessThan(initialY - 8)
  expect(runtimeErrors).toEqual([])
})
