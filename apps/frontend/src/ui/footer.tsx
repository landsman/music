import { SiGithub } from "@icons-pack/react-simple-icons";
import { useLingui } from "@lingui/react/macro";
import { LanguageSelector } from "../i18n/selector/language-selector.tsx";

export function Footer() {
  const { t } = useLingui();
  return (
    <footer className="footer">
      <div>
        <a href="https://github.com/landsman/music" title={t`showCodeOnGitHub`}>
          <SiGithub color="#FFFFFF" size={24} title={t`showCodeOnGitHub`} />
        </a>
      </div>
      <LanguageSelector />
    </footer>
  );
}
