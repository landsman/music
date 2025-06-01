import { useLingui } from "@lingui/react";

/**
 * A custom hook that provides a more concise way to use translations.
 *
 * @returns A function that can be used to translate strings.
 * @example
 * const t = useTranslation();
 * return <h1>{t("headline", "Music")}</h1>;
 */
export function useTranslation() {
  const { i18n } = useLingui();

  /**
   * Translate a string.
   *
   * @param id The ID of the string to translate.
   * @param defaultMessage The default message to use if the translation is not found.
   * @param values Optional values to interpolate into the translation.
   * @returns The translated string.
   */
  const t = (id: string, defaultMessage: string, values = {}) => {
    return i18n._(id, values, { message: defaultMessage });
  };

  return t;
}
