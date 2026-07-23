import { test, expect } from '../../playwright';

test.describe('Environment variables — adding rows (card view)', () => {
  test.use({ viewport: { width: 1400, height: 900 } });

  test('a filled name and value in the trailing blank card adds a new variable row', async ({ playground, envEditor }) => {
    await playground.open('inline');
    await playground.openEnvironments();

    await expect(envEditor.nameInputs.first()).toBeVisible();
    const before = await envEditor.nameInputs.count();

    await envEditor.nameInputs.last().fill('newVariable');
    await expect(envEditor.nameInputs).toHaveCount(before);

    await envEditor.valueInputs.last().fill('newValue');
    await expect(envEditor.nameInputs).toHaveCount(before + 1);
    await expect(envEditor.nameInputs.nth(before - 1)).toHaveValue('newVariable');
    await expect(envEditor.valueInputs.nth(before - 1)).toHaveValue('newValue');
  });

  test('toggling a variable checkbox enables/disables its card', async ({ playground, envEditor }) => {
    await playground.open('inline');
    await playground.openEnvironments();

    const toggle = envEditor.enableToggle('host');
    const card = envEditor.cardFor('host');
    const disabled = /(^|\s)disabled(\s|$)/;

    await expect(toggle).toBeChecked();
    await expect(card).not.toHaveClass(disabled);

    await toggle.uncheck();
    await expect(toggle).not.toBeChecked();
    await expect(card).toHaveClass(disabled);

    await toggle.check();
    await expect(toggle).toBeChecked();
    await expect(card).not.toHaveClass(disabled);
  });
});
