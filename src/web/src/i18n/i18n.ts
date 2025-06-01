import { i18n } from "@lingui/core";
import { en } from "./locales/en.ts";

// Initialize Lingui with English messages
i18n.load({
  en: en.messages,
});
i18n.activate("en");

export { i18n };
