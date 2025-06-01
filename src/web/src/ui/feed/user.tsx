import { UserRound } from "lucide-react";
import { useLingui } from "@lingui/react/macro";

interface UserProps {
  name: string | undefined;
}

export function User({ name }: UserProps) {
  const { t } = useLingui();
  return (
    <div className="user">
      <a
        href={`https://www.last.fm/user/${name || "unknown"}`}
        title={t`visitUserProfile`}
      >
        <UserRound size={12} />
        <span>{name || "Unknown"}</span>
        {t`visitUserProfile`}
      </a>
    </div>
  );
}
