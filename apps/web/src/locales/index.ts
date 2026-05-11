import { pt } from "./pt";
import { en } from "./en";
import { es } from "./es";

export const locales = {
  pt,
  en,
  es,
};

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = "pt";

export function getTranslation(lang: Locale = defaultLocale) {
  return locales[lang];
}
