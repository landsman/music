import { i18n } from "@lingui/core";
import { detect, fromUrl, fromStorage, fromNavigator } from "@lingui/detect-locale";
import linguiConfig from "../../lingui.config.js";

// Export the supported locales from the config
export const supportedLocales = linguiConfig.locales;
export const defaultLocale = linguiConfig.sourceLocale || "en";
const storageKey = "lang";

i18n.load({ });

export function detectUserLocale(): string {
  return detect(
    fromUrl(storageKey),
    fromStorage(storageKey),
    fromNavigator,
    defaultLocale
  ) || defaultLocale;
}

async function loadMessages(locale: string) {
  try {
    // Try to load the messages from the compiled messages.js file
    const module = await import(`./locales/${locale}/messages.js`);
    return module.default?.messages || module.messages;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    return {};
  }
}

export async function dynamicActivate(locale: string): Promise<void> {
  try {
    if (locale !== defaultLocale) {
      const messages = await loadMessages(locale);
      i18n.load({
        [locale]: messages,
      });
    }

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
