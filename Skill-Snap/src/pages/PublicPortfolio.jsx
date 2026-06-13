import MinimalPortfolio from "../components/themes/MinimalTheme";
import ModernPortfolio from "../components/themes/ModernTheme";
import ProfessionalPortfolio from "../components/themes/ProfessionalTheme";
import StartupPortfolio from "../components/themes/StartupTheme";
import TerminalPortfolio from "../components/themes/TerminalTheme";

const THEME_MAP = {
  minimal: MinimalPortfolio,
  modern: ModernPortfolio,
  professional: ProfessionalPortfolio,
  startup: StartupPortfolio,
  terminal: TerminalPortfolio,
};

const normalizeTheme = (theme) => (THEME_MAP[theme] ? theme : "modern");

const getSelectedTheme = () => {
  const queryTheme = new URLSearchParams(window.location.search).get("theme");
  const storedTheme = localStorage.getItem("portfolioTheme");
  return normalizeTheme(queryTheme || storedTheme);
};

export default function PublicPortfolio() {
  const selectedTheme = getSelectedTheme();
  const ThemeComponent = THEME_MAP[selectedTheme] || ModernPortfolio;

  return <ThemeComponent />;
}
