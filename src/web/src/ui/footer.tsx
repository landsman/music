import i18n from "../i18n/en.json";
import { SiGithub } from "@icons-pack/react-simple-icons";

export function Footer() {
  return (
    <footer className="footer">
      <a href="https://github.com/landsman/music" title={i18n.github}>
        <SiGithub color="#FFFFFF" size={24} title={i18n.github} />
      </a>
    </footer>
  );
}
