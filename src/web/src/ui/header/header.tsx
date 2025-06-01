import { Headphones } from "lucide-react";
import { useLingui } from "@lingui/react/macro";
import { usePullToRefresh } from "./pull-to-refresh.tsx";
import "./header.css";

export function Header() {
  const { t } = useLingui();
  usePullToRefresh();
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
      </div>
    </header>
  );
}
