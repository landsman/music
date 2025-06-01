import { Headphones } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";

export function Header() {
  const t = useTranslation();

  return (
    <header className="header">
      <h1>
        {t("headline", "Music")}
      </h1>
      <h2>
        <Headphones size={24} /> {t("lastListened", "Last listened")}
      </h2>
    </header>
  );
}
