import { i18n } from "../i18n/i18n.ts";
import { Headphones } from "lucide-react";

export function Header() {
  return (
    <header className="header">
      <h1>{i18n.headline}</h1>
      <h2>
        <Headphones size={24} /> {i18n.lastListened}
      </h2>
    </header>
  );
}
