const FORCE_KEY = "ampli-statsig-forced";

export type ForcedAssignment = {
  gateOrExperiment: string;
  value: string;
};

export function readForcedAssignments(): ForcedAssignment[] {
  try {
    const raw = sessionStorage.getItem(FORCE_KEY);
    if (!raw) {
      return parseUrlForces();
    }
    const parsed = JSON.parse(raw) as ForcedAssignment[];
    return Array.isArray(parsed) ? [...parsed, ...parseUrlForces()] : parseUrlForces();
  } catch {
    return parseUrlForces();
  }
}

function parseUrlForces(): ForcedAssignment[] {
  const params = new URLSearchParams(window.location.search);
  const force = params.get("force_statsig");
  if (!force) {
    return [];
  }
  const [name, value] = force.split(":");
  if (!name || !value) {
    return [];
  }
  return [{ gateOrExperiment: name, value }];
}

export function persistForcedAssignments(assignments: ForcedAssignment[]): void {
  sessionStorage.setItem(FORCE_KEY, JSON.stringify(assignments));
}

export function setForcedAssignment(gateOrExperiment: string, value: string): void {
  const existing = readForcedAssignments().filter((item) => item.gateOrExperiment !== gateOrExperiment);
  existing.push({ gateOrExperiment, value });
  persistForcedAssignments(existing);
}

export function clearForcedAssignments(): void {
  sessionStorage.removeItem(FORCE_KEY);
}

export function isForced(gateOrExperiment: string): boolean {
  return readForcedAssignments().some((item) => item.gateOrExperiment === gateOrExperiment);
}