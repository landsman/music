import { Headphones } from "lucide-react";
import { useLingui } from "@lingui/react";

export function Header() {
  const { i18n } = useLingui();
  const headlineText = i18n._("headline", {}, { message: "Music" });
  const lastListenedText = i18n._("lastListened", {}, { message: "Last listened" });

  return (
    <header className="header">
      <h1>
        {headlineText}
      </h1>
      <h2>
        <Headphones size={24} /> {lastListenedText}
      </h2>
    </header>
  );
}
