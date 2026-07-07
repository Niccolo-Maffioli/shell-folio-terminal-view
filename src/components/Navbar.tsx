import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./Navbar.css";
import { type LocaleCode, APP_STRINGS } from "../locales/appContent";

interface NavbarProps {
    onSelectCommand: (command: string) => void;
    currentLanguage: LocaleCode;
}

type NavLink = { label: string; command: string; id: string };

const buildNavLinks = (currentLanguage: LocaleCode): NavLink[] => {
    const targetLang = currentLanguage === "it" ? "en" : "it";
    const navbarStrings = APP_STRINGS[currentLanguage].navbar;

    return [
        { label: navbarStrings.about, command: "about", id: "About-me" },
        { label: navbarStrings.skills, command: "skills", id: "Skills" },
        { label: navbarStrings.projects, command: "projects", id: "Projects" },
        { label: navbarStrings.experience, command: "experience", id: "Experience" },
        { label: navbarStrings.education, command: "education", id: "Education" },
        { label: navbarStrings.contact, command: "contact", id: "Contact" },
        { label: navbarStrings.cv, command: "cv", id: "CV" },
        { label: navbarStrings.help, command: "help", id: "Help" },
        { label: navbarStrings.clear, command: "clear", id: "Clear" },
        {
            label: navbarStrings.language(targetLang),
            command: `lang ${targetLang}`,
            id: "Language",
        },
    ];
};

const Navbar: React.FC<NavbarProps> = ({ onSelectCommand, currentLanguage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = useMemo(() => buildNavLinks(currentLanguage), [currentLanguage]);

    useEffect(() => {
        const handleResize = () => {
            setIsMenuOpen(false);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleSelect = (command: string) => {
        onSelectCommand(command);
        setIsMenuOpen(false);
    };

    return (
        <>
            <button
                type="button"
                className="navbar__toggle absolute z-[1000]"
                aria-expanded={isMenuOpen}
                aria-controls="navbar"
                aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                onClick={toggleMenu}
            >
                {isMenuOpen ? (
                    <ChevronUp aria-hidden="true" className="navbar__toggle-icon" />
                ) : (
                    <ChevronDown aria-hidden="true" className="navbar__toggle-icon" />
                )}
            </button>
            <header className="navbar-shell p-0">
                <nav
                    id="navbar"
                    className={`navbar${isMenuOpen ? " navbar--open" : ""}`}
                    aria-hidden={!isMenuOpen}
                >
                    <div className="navbar__inner">
                        <ul className="navbar__links">
                            {navLinks.map(({ label, command, id }) => (
                                <li key={command} className="navbar__item">
                                    <button
                                        type="button"
                                        id={id}
                                        className="navbar__button"
                                        onClick={() => handleSelect(command)}
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Navbar;