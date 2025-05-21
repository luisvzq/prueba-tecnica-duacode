import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
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
        className="relative rounded-lg overflow-hidden"
        style={{
          background: isHovering
            ? `radial-gradient(circle at ${coords.x}px ${coords.y}px, rgba(59,130,246,0.15), transparent 60%)`
            : "white",
        }}
        animate={{
          scale: isHovering ? 1.015 : 1,
          boxShadow: isHovering
            ? "0 12px 24px rgba(0, 0, 0, 0.12)"
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
              <h2 className="text-xl font-semibold text-gray-800">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-2 border-t">
          <span className="text-sm text-gray-600 hover:text-black">
            Ver detalles →
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default UserCard;
