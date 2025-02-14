import {i18n} from "../i18n/i18n.ts";

export function Header() {
  return (
    <header className="header">
      <h1>{i18n.headline}</h1>
    </header>
  );
}
