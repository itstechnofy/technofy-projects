import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { DARK_MODE_ENABLED } from "@/config/theme";

const TopNavbar = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <img
              src={theme === "dark" ? "/brand/logo-dark.svg" : "/brand/logo.svg"}
              alt="Technofy"
              className="h-8 w-auto"
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
