import { i18n } from "@lingui/core";

import enMessages from "./locales/en/messages.js";
//import csMessages from "./locales/cs/messages.js";

// Initialize Lingui with English messages
i18n.load({
  en: enMessages.messages,
});
i18n.activate("en");

export { i18n };
