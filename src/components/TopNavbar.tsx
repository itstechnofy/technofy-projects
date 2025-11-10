import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { DARK_MODE_ENABLED } from "@/config/theme";

interface TopNavbarProps {
  isHidden?: boolean;
}

const TopNavbar = ({ isHidden = false }: TopNavbarProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className={`sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border transition-all duration-500 ${isHidden ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center h-full">
            <img
              src="/assets/logos/Logo.png"
              alt="Technofy"
              className="h-24 md:h-28 lg:h-32 w-auto object-contain object-left"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.nextElementSibling?.tagName !== "SPAN") {
                  target.style.display = "none";
                  const text = document.createElement("span");
                  text.className = "text-xl font-bold text-primary";
                  text.textContent = "technofy";
                  target.parentElement?.appendChild(text);
                }
              }}
            />
          </Link>

          {DARK_MODE_ENABLED && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

    </nav>
  );
};

export default TopNavbar;
