import { SiGithub } from "@icons-pack/react-simple-icons";
import { useLingui } from "@lingui/react/macro";

export function Footer() {
  const { t } = useLingui();
  return (
    <footer className="footer">
      <a href="https://github.com/landsman/music" title={t`showCodeOnGitHub`}>
        <SiGithub color="#FFFFFF" size={24} title={t`showCodeOnGitHub`} />
      </a>
    </footer>
  );
}
