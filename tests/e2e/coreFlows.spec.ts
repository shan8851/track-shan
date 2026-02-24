import { expect, test } from "@playwright/test";

import { resetE2eDatabase } from "./helpers/testDatabase";

test.beforeEach(async () => {
  await resetE2eDatabase();
});

test("weight flow: create, update, and delete", async ({ page }) => {
  await page.goto("/");

  const weightSection = page.getByTestId("weight-section");

  await expect(
    weightSection.getByText("No weight entries yet. Add your first entry above.")
  ).toBeVisible();

  await weightSection.getByRole("button", { name: "New Entry" }).click();
  const createDialog = page.getByRole("dialog");
  await createDialog.getByLabel("Date").fill("2026-02-19");
  await createDialog.getByLabel("Weight (kg)").fill("74.2");
  await createDialog.getByRole("button", { name: "Save" }).click();

  const weightTableBody = weightSection.locator("tbody");
  await expect(weightTableBody.getByText("74.2 kg")).toBeVisible();

  const createdRow = weightSection.locator("tbody tr").first();
  await createdRow
    .getByRole("button", { name: /Edit weight entry/i })
    .click();

  const editDialog = page.getByRole("dialog");
  await editDialog.getByLabel("Weight (kg)").fill("73.8");
  await editDialog.getByRole("button", { name: "Update" }).click();

  await expect(weightTableBody.getByText("73.8 kg")).toBeVisible();
  await expect(weightTableBody.getByText("74.2 kg")).toHaveCount(0);

  const updatedRow = weightSection.locator("tbody tr").first();
  await updatedRow
    .getByRole("button", { name: /Delete weight entry/i })
    .click();
  await page.getByRole("button", { name: "Delete" }).click();

  await expect(
    weightSection.getByText("No weight entries yet. Add your first entry above.")
  ).toBeVisible();
});

test("exercise flow: create, update, and delete", async ({ page }) => {
  await page.goto("/");

  const exerciseSection = page.getByTestId("exercise-section");

  await expect(
    exerciseSection.getByText("No exercise entries yet. Add your first session above.")
  ).toBeVisible();

  await exerciseSection.getByRole("button", { name: "New Session" }).click();
  const createDialog = page.getByRole("dialog");
  await createDialog.getByLabel("Date").fill("2026-02-20");
  await createDialog.getByLabel("Duration (minutes)").fill("45");
  await createDialog.getByRole("button", { name: "Save" }).click();

  const exerciseTableBody = exerciseSection.locator("tbody");
  await expect(exerciseTableBody.getByText("Football")).toBeVisible();
  await expect(exerciseTableBody.getByText("45m")).toBeVisible();

  const createdRow = exerciseSection.locator("tbody tr").first();
  await createdRow
    .getByRole("button", { name: /Edit exercise entry/i })
    .click();

  const editDialog = page.getByRole("dialog");
  await editDialog.getByLabel("Duration (minutes)").fill("60");
  await editDialog.getByRole("button", { name: "Update" }).click();

  await expect(exerciseTableBody.getByText("1h")).toBeVisible();
  await expect(exerciseTableBody.getByText("45m")).toHaveCount(0);

  const updatedRow = exerciseSection.locator("tbody tr").first();
  await updatedRow
    .getByRole("button", { name: /Delete exercise entry/i })
    .click();
  await page.getByRole("button", { name: "Delete" }).click();

  await expect(
    exerciseSection.getByText("No exercise entries yet. Add your first session above.")
  ).toBeVisible();
});

test("daily check-in flow: create, update, and delete", async ({ page }) => {
  const today = new Date().toISOString().split("T")[0] ?? "";

  await page.goto("/checkin");

  const checkinDateInput = page.getByLabel("Date");
  await checkinDateInput.fill(today);

  await page.getByRole("button", { name: "Mood 5 Great" }).click();
  await page.getByRole("button", { name: "Good" }).first().click();
  await page.getByRole("button", { name: "Save Day" }).click();

  await expect(page.getByText("Entry exists for this date.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Update Day" })).toBeVisible();

  await page.getByRole("button", { name: "Mood 2 Low" }).click();
  await page.getByRole("button", { name: "Update Day" }).click();
  await expect(page.getByText("Entry exists for this date.")).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("No entry for this date yet.")).toBeVisible();
});
