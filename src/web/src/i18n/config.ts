import { i18n } from "@lingui/core";
import {
  detect,
  fromNavigator,
  fromStorage,
  fromUrl,
} from "@lingui/detect-locale";
import linguiConfig from "../../lingui.config.js";

// Export the supported locales from the config
export const supportedLocales = linguiConfig.locales;
export const defaultLocale = linguiConfig.sourceLocale || "en";
const storageKey = "lang";

i18n.load({});

export function detectUserLocale(): string {
  const findings = detect(
    fromUrl(storageKey),
    fromStorage(storageKey),
    fromNavigator(),
    defaultLocale,
  );

  const short = findings?.slice(0, 2);
  if (short && supportedLocales.includes(short)) {
    return short;
  }

  return defaultLocale;
}

async function loadMessages(locale: string) {
  try {
    // Change to use URL-based import for Vite/Deno compatibility
    const messages = await import(
      /* @vite-ignore */
      new URL(`./locales/${locale}/messages.mjs`, import.meta.url).href
    );
    return messages.messages || {};
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    return {};
  }
}

export async function dynamicActivate(locale: string): Promise<void> {
  try {
    const messages = await loadMessages(locale);
    i18n.load({
      [locale]: messages,
    });

    i18n.activate(locale);
    localStorage.setItem(storageKey, locale);
    document.documentElement.setAttribute("lang", locale);
  } catch (error) {
    console.error(`Failed to activate locale ${locale}:`, error);
    if (locale !== defaultLocale) {
      await dynamicActivate(defaultLocale);
    }
  }
}

export { i18n };
