import en from "./en.json" with { type: "json" };

export type Translations = typeof en;
export const i18n: Translations = en;
