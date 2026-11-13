/**
 * Napelemes termelésbecslés — ezeket a két számot kell átírni, ha a feltételezés változik.
 *
 * Fajlagos termelés: Magyarország, déli tájolás, kb. 35° dőlés, számottevő árnyék nélkül.
 * A 1 150 kWh/kWp/év a hazai tervezési sáv közepe (kb. 1 100–1 250), nem helyszíni PVGIS-számítás.
 *
 * Áramérték: 70 Ft/kWh, a lakossági átlagfogyasztás feletti ár nagyságrendje (kerekítve).
 * A saját fogyasztás helyettesítését becsüli, nem átvételi ár és nem számla.
 */
export const SOLAR_YIELD_KWH_PER_KWP_YEAR = 1150;
export const SOLAR_ELECTRICITY_HUF_PER_KWH = 70;

export type SolarYieldSummary = {
  panelCount: number;
  /** Egyetlen paneltípus névleges teljesítménye; vegyes tételeknél null */
  panelWatts: number | null;
  kwp: number;
  annualKwh: number;
  annualValueHuf: number;
  yieldKwhPerKwpYear: number;
  priceHufPerKwh: number;
};

/** A katalógusnévből, pl. „… 620W napelem …”. */
export function panelWattsFromName(name: string): number | null {
  const match = name.match(/(\d{3,4})\s*W\b/i);
  if (!match) return null;
  const watts = Number(match[1]);
  if (watts < 200 || watts > 800) return null;
  return watts;
}

export function solarYieldFromLines(
  lines: Array<{ name: string; quantity: number; category: string }>,
): SolarYieldSummary | null {
  const panels = lines.filter((line) => line.category === 'panel' && line.quantity > 0);
  if (!panels.length) return null;

  let panelCount = 0;
  let wattsTotal = 0;
  const wattages = new Set<number>();
  for (const line of panels) {
    const watts = panelWattsFromName(line.name);
    if (watts == null) continue;
    panelCount += line.quantity;
    wattsTotal += watts * line.quantity;
    wattages.add(watts);
  }
  if (panelCount <= 0 || wattsTotal <= 0) return null;

  const kwp = wattsTotal / 1000;
  const annualKwh = Math.round(kwp * SOLAR_YIELD_KWH_PER_KWP_YEAR);
  const annualValueHuf = Math.round(annualKwh * SOLAR_ELECTRICITY_HUF_PER_KWH);

  return {
    panelCount,
    panelWatts: wattages.size === 1 ? [...wattages][0] : null,
    kwp,
    annualKwh,
    annualValueHuf,
    yieldKwhPerKwpYear: SOLAR_YIELD_KWH_PER_KWP_YEAR,
    priceHufPerKwh: SOLAR_ELECTRICITY_HUF_PER_KWH,
  };
}
