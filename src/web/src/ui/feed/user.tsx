import { UserRound } from "lucide-react";
import { useLingui } from "@lingui/react";

interface UserProps {
  name: string | undefined;
}

export function User({ name }: UserProps) {
  const { i18n } = useLingui();
  const visitProfileText = i18n._("visitUserProfile", {}, { message: "Visit user profile" });

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
