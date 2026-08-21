import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/event/demo')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('candidate can reach an idempotent active queue', async ({ page }) => {
  await page.getByRole('button', { name: /เข้าสู่งาน Demo/ }).click()
  await page.getByRole('checkbox', { name: /เข้าร่วม Event/ }).check()
  await page.getByRole('button', { name: /ยืนยันแบบจำลอง/ }).click()
  await page.getByRole('button', { name: /ใช้ Resume ตัวอย่าง/ }).click()
  await page.getByRole('button', { name: /ยืนยัน Masked Profile/ }).click()
  await page.getByRole('button', { name: /พร้อมเข้า Career City/ }).click()
  await page.getByRole('button', { name: /ดูรายละเอียดงาน/ }).click()
  await page.getByRole('button', { name: 'เข้าคิวสัมภาษณ์' }).click()
  await expect(page.getByText(/อยู่ในคิวแล้ว/)).toBeVisible()
  await page.reload()
  await expect(page.getByText(/อยู่ในคิวแล้ว/)).toBeVisible()
})

test('list mode exposes the same recommended job without canvas', async ({ page }) => {
  await page.goto('/event/demo/navigator')
  await expect(page.getByRole('heading', { name: 'Navigator' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Backend Developer' })).toBeVisible()
  await expect(page.getByText('92/100')).toBeVisible()
})

test('private decisions unlock only the explicitly consented reveal fields', async ({ page }) => {
  await page.goto('/demo/control')
  await page.getByRole('button', { name: /Join queue & เปิด World/ }).click()
  await page.getByRole('button', { name: /Demo: เรียกคิว/ }).click()
  await page.getByRole('button', { name: 'พร้อมสัมภาษณ์' }).click()
  await page.getByRole('button', { name: /เข้าห้องสัมภาษณ์/ }).click()
  await page.getByRole('button', { name: 'จบสัมภาษณ์' }).click()
  await page.getByRole('button', { name: /สนใจไปต่อ/ }).click()
  await page.getByRole('button', { name: /ยืนยันคำตอบส่วนตัว/ }).click()
  await expect(page.getByRole('heading', { name: 'บันทึกคำตอบแล้ว' })).toBeVisible()
  await page.getByRole('link', { name: /เปิด Recruiter Dashboard/ }).click()
  await page.getByRole('button', { name: 'สนใจไปต่อ' }).click()
  await page.getByRole('button', { name: 'ยืนยันคำตอบ' }).click()
  await expect(page.getByRole('heading', { name: 'Mutual Match!' })).toBeVisible()
  await page.getByRole('button', { name: 'ไปหน้า Reveal' }).click()
  await page.getByRole('checkbox', { name: /Email/ }).check()
  await page.getByRole('checkbox', { name: /Portfolio/ }).check()
  await page.getByRole('button', { name: /ยืนยันการแชร์ 2 ช่อง/ }).click()
  await expect(page.getByText(CANDIDATE_EMAIL)).toBeVisible()
  await expect(page.getByText(/80 000 0000/)).toHaveCount(0)
})

const CANDIDATE_EMAIL = 'candidate@example.test'
