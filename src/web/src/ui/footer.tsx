import { SiGithub } from "@icons-pack/react-simple-icons";
import { useLingui } from "@lingui/react";

export function Footer() {
  const { i18n } = useLingui();
  const githubText = i18n._("github", {}, {
    message: "Show code of this project on GitHub",
  });

  return (
    <footer className="footer">
      <a href="https://github.com/landsman/music" title={githubText}>
        <SiGithub color="#FFFFFF" size={24} title={githubText} />
      </a>
    </footer>
  );
}
