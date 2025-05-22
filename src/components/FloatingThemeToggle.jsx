import { Moon, Sun } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const FloatingThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-50 cursor-pointer flex items-center justify-center ${
        darkMode
          ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
          : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
      aria-label="Cambiar tema"
    >
      {darkMode ? (
        <Sun className="w-6 h-6 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-6 h-6 transition-transform duration-300 hover:rotate-12" />
      )}
    </button>
  );
};

export default FloatingThemeToggle;
