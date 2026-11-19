import personasData from "../data/personas.json";

export type Persona = {
  id: string;
  label: string;
  description: string;
  presetEmail?: string;
  presetDisplayName?: string;
  seedEngagementArticlesRead?: number;
  seedDaysSinceLastVisit?: number;
};

export const personas: Persona[] = personasData as Persona[];

export function getPersonaById(id: string): Persona | undefined {
  return personas.find((persona) => persona.id === id);
}

export function getRegisteredReaderPersona(): Persona {
  const persona = getPersonaById("registered-reader");
  if (!persona) {
    throw new Error("Missing registered-reader persona");
  }
  return persona;
}

/** Maps a normalized login email to a demo preset (subscription/engagement seeds). */
export function resolvePersonaIdForEmail(normalizedEmail: string): string {
  const match = personas.find(
    (persona) =>
      persona.id !== "anonymous" &&
      persona.presetEmail &&
      persona.presetEmail.trim().toLowerCase() === normalizedEmail,
  );
  return match?.id ?? "registered-reader";
}
