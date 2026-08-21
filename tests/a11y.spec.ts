import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const route of ['/event/demo', '/demo/verify', '/event/demo/navigator']) {
  test(`has no serious accessibility violations: ${route}`, async ({ page }) => {
    await page.goto(route)
    const results = await new AxeBuilder({ page }).analyze()
    const serious = results.violations.filter(item => item.impact === 'critical' || item.impact === 'serious')
    expect(serious).toEqual([])
  })
}
