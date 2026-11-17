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
