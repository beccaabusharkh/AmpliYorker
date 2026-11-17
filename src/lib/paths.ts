const configuredBase = import.meta.env.BASE_URL;

export const baseUrl = configuredBase.endsWith("/") ? configuredBase : `${configuredBase}/`;
