export default {
  locales: ["en"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "src/i18n/locales/{locale}/messages",
      include: ["src"],
      exclude: ["**/node_modules/**"],
    },
  ],
  format: "po",
  formatOptions: {
    origins: false,
    lineNumbers: false
  },
  compileNamespace: "es",  // Use ES modules format
  runtimeConfigModule: {
    target: "@lingui/core",
    version: "5.3.2"
  }
};