export type ExposureRecord = {
  id: string;
  gateOrExperiment: string;
  variant: string;
  parameter: string;
  surface: string;
  isForced: boolean;
  recordedAt: string;
};

const EXPOSURES_KEY = "ampli-statsig-exposures";
const listeners = new Set<() => void>();

function loadExposures(): ExposureRecord[] {
  try {
    const raw = sessionStorage.getItem(EXPOSURES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as ExposureRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveExposures(records: ExposureRecord[]): void {
  sessionStorage.setItem(EXPOSURES_KEY, JSON.stringify(records.slice(-40)));
  listeners.forEach((listener) => listener());
}

export function recordExposure(
  gateOrExperiment: string,
  variant: string,
  surface: string,
  isForced: boolean,
  parameter = "variant",
): ExposureRecord {
  const existing = loadExposures().find(
    (item) => item.gateOrExperiment === gateOrExperiment && item.surface === surface,
  );
  if (existing) {
    return existing;
  }
  const record: ExposureRecord = {
    id: crypto.randomUUID(),
    gateOrExperiment,
    variant,
    parameter,
    surface,
    isForced,
    recordedAt: new Date().toISOString(),
  };
  saveExposures([...loadExposures(), record]);
  return record;
}

export function getExposures(): ExposureRecord[] {
  return loadExposures();
}

export function onExposuresChanged(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function clearExposures(): void {
  sessionStorage.removeItem(EXPOSURES_KEY);
  listeners.forEach((listener) => listener());
}