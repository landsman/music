import { Headphones } from "lucide-react";
import { useLingui } from "@lingui/react/macro";
import { LanguageSelector } from "../../i18n/selector/language-selector.tsx";
import "./header.css";

export function Header() {
  const { t } = useLingui();
  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>
            {t`projectName`}
          </h1>
          <h2>
            <Headphones size={24} /> {t`lastListened`}
          </h2>
        </div>
        <LanguageSelector />
      </div>
    </header>
  );
}
