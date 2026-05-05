import { SiGithub } from "@icons-pack/react-simple-icons";
import { useLingui } from "@lingui/react/macro";
import { LanguageSelector } from "../../../i18n/selector/language-selector.tsx";

interface FooterProps {
  gitHubUrl: string;
}

export function Footer({ gitHubUrl }: FooterProps) {
  const { t } = useLingui();
  return (
    <footer className="footer">
      <div>
        <a href={gitHubUrl} title={t`showCodeOnGitHub`}>
          <SiGithub color="#FFFFFF" size={24} title={t`showCodeOnGitHub`} />
        </a>
      </div>
      <LanguageSelector />
    </footer>
  );
}
