import { Headphones } from "lucide-react";
import { Trans } from "@lingui/react";

export function Header() {
  return (
    <header className="header">
      <h1>
        <Trans id="headline">Music</Trans>
      </h1>
      <h2>
        <Headphones size={24} /> <Trans id="lastListened">Last listened</Trans>
      </h2>
    </header>
  );
}
