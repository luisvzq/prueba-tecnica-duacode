import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const UserCard = ({ user }) => {
  const { darkMode } = useContext(ThemeContext);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Link to={`/user/${user.id}`} className="block">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`relative rounded-lg overflow-hidden ${
          darkMode ? "text-white" : ""
        }`}
        style={{
          background: isHovering
            ? `radial-gradient(circle at ${coords.x}px ${coords.y}px, ${
                darkMode ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.15)"
              }, ${darkMode ? "rgba(31, 41, 55, 0.9)" : "white"} 60%)`
            : darkMode
            ? "rgb(31, 41, 55)"
            : "white",
        }}
        animate={{
          scale: isHovering ? 1.015 : 1,
          boxShadow: isHovering
            ? darkMode
              ? "0 12px 24px rgba(0, 0, 0, 0.3)"
              : "0 12px 24px rgba(0, 0, 0, 0.12)"
            : darkMode
            ? "0 4px 10px rgba(0, 0, 0, 0.2)"
            : "0 4px 10px rgba(0, 0, 0, 0.06)",
        }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {user.first_name} {user.last_name}
              </h2>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`${
            darkMode ? "bg-gray-700" : "bg-gray-50"
          } px-4 py-2 border-t ${darkMode ? "border-gray-600" : ""}`}
        >
          <span
            className={`text-sm ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Ver detalles →
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default UserCard;
