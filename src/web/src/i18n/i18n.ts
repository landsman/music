import { i18n } from "@lingui/core";

// Define the English messages manually
const enMessages = {
  messages: {
    "headline": "Music",
    "lastListened": "Last listened",
    "visitUserProfile": "Visit user profile",
    "time.seconds": "seconds",
    "time.minutes": "minutes",
    "time.hours": "hours",
    "time.days": "days",
    "github": "Show code of this project on GitHub"
  }
};

// Initialize Lingui with English messages
i18n.load({
  en: enMessages.messages,
});
i18n.activate("en");

export { i18n };
