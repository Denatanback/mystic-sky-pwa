import { test } from "@playwright/test";

test("capture today screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/today");
  await page.waitForLoadState("networkidle");

  await page.screenshot({
    path: "screenshots/current/today.png",
    fullPage: true
  });
});