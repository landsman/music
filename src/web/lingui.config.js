export default {
  locales: ["en", "cs"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "src/i18n/locales/{locale}/messages",
      include: ["src"],
      exclude: ["**/node_modules/**"],
    },
  ],
  format: "po",
};
