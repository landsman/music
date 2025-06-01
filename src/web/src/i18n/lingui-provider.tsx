import { ReactNode } from "react";
import { I18nProvider } from "@lingui/react";
import { i18n } from "./i18n.ts";

interface LinguiProviderProps {
  children: ReactNode;
}

export function LinguiProvider({ children }: LinguiProviderProps) {
  return (
    <I18nProvider i18n={i18n}>
      {children}
    </I18nProvider>
  );
}
