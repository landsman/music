import { UserRound } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation.ts";

interface UserProps {
  name: string | undefined;
}

export function User({ name }: UserProps) {
  const t = useTranslation();
  const visitProfileText = t("visitUserProfile", "Visit user profile");

  return (
    <div className="user">
      <a
        href={`https://www.last.fm/user/${name || "unknown"}`}
        title={visitProfileText}
      >
        <UserRound size={12} />
        <span>{name || "Unknown"}</span>
      </a>
    </div>
  );
}
