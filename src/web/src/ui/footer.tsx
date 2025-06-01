import { SiGithub } from "@icons-pack/react-simple-icons";
import { useTranslation } from "../i18n/useTranslation";

export function Footer() {
  const t = useTranslation();
  const githubText = t("github", "Show code of this project on GitHub");

  return (
    <footer className="footer">
      <a href="https://github.com/landsman/music" title={githubText}>
        <SiGithub color="#FFFFFF" size={24} title={githubText} />
      </a>
    </footer>
  );
}
