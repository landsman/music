import { useEffect, useState } from "react";
import { i18n, supportedLocales, dynamicActivate } from "../config.ts";
import "./language-selector.css";

/**
 * LanguageSelector component that allows the user to select a language.
 * 
 * It displays a dropdown with the supported locales and activates the selected locale.
 */
export function LanguageSelector() {
  // State to track the current locale
  const [currentLocale, setCurrentLocale] = useState(i18n.locale || "en");

  // Update the state when the locale changes
  useEffect(() => {
    const handleLocaleChange = () => {
      setCurrentLocale(i18n.locale);
    };

    // Listen for locale changes
    document.addEventListener("localeChange", handleLocaleChange);

    return () => {
      document.removeEventListener("localeChange", handleLocaleChange);
    };
  }, []);

  // Handle locale change
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    await dynamicActivate(newLocale);
    setCurrentLocale(newLocale);
  };

  return (
    <div className="language-selector">
      <select value={currentLocale} onChange={handleChange}>
        {supportedLocales.map((locale) => (
          <option key={locale} value={locale}>
            {locale.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
