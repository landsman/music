import { Headphones } from "lucide-react";
import { useLingui } from "@lingui/react/macro";

export function Header() {
  const { t } = useLingui();
  return (
    <header className="header">
      <h1>
        {t`projectName`}
      </h1>
      <h2>
        <Headphones size={24} /> {t`lastListened`}
      </h2>
    </header>
  );
}
