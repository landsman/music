import { Headphones } from "lucide-react";
import { useLingui } from "@lingui/react/macro";
import { usePullToRefresh } from "../../activity/pull-to-refresh/pull-to-refresh.tsx";

interface HeaderProps {
  rightSlot?: React.ReactNode;
}

export function Header({ rightSlot }: HeaderProps) {
  const { t } = useLingui();
  usePullToRefresh();
  return (
    <header className="header">
      <div className="header-top">
        <h1>{t`projectName`}</h1>
        {rightSlot && <div className="header-right">{rightSlot}</div>}
      </div>
      <h2>
        <Headphones size={24} /> {t`lastListened`}
      </h2>
    </header>
  );
}
