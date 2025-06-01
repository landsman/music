"use client";

import { ReactNode, useEffect } from "react";
import { I18nProvider } from "@lingui/react";
import { detectUserLocale, dynamicActivate, i18n } from "./config.ts";

interface LinguiProviderProps {
  children: ReactNode;
}

/**
 * LinguiProvider component that provides the i18n instance to the application.
 *
 * It automatically detects the user's preferred locale and activates it.
 * It also sets up an effect to activate the locale when the component mounts.
 */
export function LinguiProvider({ children }: LinguiProviderProps) {
  // Set up an effect to activate the locale when the component mounts
  useEffect(() => {
    const userLocale = detectUserLocale();
    dynamicActivate(userLocale);
  }, []);

  return (
    <I18nProvider i18n={i18n}>
      {children}
    </I18nProvider>
  );
}
