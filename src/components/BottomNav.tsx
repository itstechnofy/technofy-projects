import { Home, Briefcase, Wrench, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BottomNav = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== "/") return;

      const sections = ["hero", "work", "we-believe", "services", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && scrollPosition >= section.offsetTop) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleClick = (sectionId: string) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
    } else {
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "hero", label: "Home", icon: Home },
    { id: "work", label: "Work", icon: Briefcase },
    { id: "services", label: "Services", icon: Wrench },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <nav
      className="fixed left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-[980px]"
      style={{
        bottom: "max(16px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="bg-white/85 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/70 dark:border-neutral-800/70 rounded-full px-3 py-2 shadow-lg">
        <div className="flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm transition-all ${
                  isActive
                    ? "bg-[#625CC8] text-white shadow-md"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#F74F8C]" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
