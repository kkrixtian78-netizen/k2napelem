/**
 * Napelemes szerelési munkadíj — ezek nettó eladási árak, beszerzésük 0.
 * A kiszállás külön adódik hozzá: oda-vissza km × 150 Ft beszerzés, eladás × 1,25.
 */
export const SOLAR_PANEL_LABOR_SELL = 25_000;
export const SOLAR_INVERTER_LABOR_SELL = 150_000;

export const SOLAR_INSTALL_LABOR_ID = 'labor-solar-install';

export function solarInstallSell(panelCount: number): number {
  const panels = Math.max(1, Math.floor(panelCount) || 1);
  return panels * SOLAR_PANEL_LABOR_SELL + SOLAR_INVERTER_LABOR_SELL;
}
