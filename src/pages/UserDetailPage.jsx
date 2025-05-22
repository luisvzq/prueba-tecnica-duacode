import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { deleteUser, getUserById } from "../services/api";

const UserDetailPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(id);
        setUser(userData);
        setLoading(false);
      } catch (err) {
        setError(`Error al cargar los datos del usuario: ${err.message}`);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        setIsDeleting(true);
        const success = await deleteUser(id);

        if (success) {
          setDeleteSuccess(true);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setError("Error al eliminar el usuario");
          setIsDeleting(false);
        }
      } catch (err) {
        setError(`Error al eliminar el usuario: ${err.message}`);
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Loader2 className="h-12 w-12 animate-spin text-gray-500 dark:text-gray-300" />
      </div>
    );
  }

  if (deleteSuccess) {
    return (
      <div
        className={`${
          darkMode
            ? "bg-green-900 border-green-800 text-green-100"
            : "bg-green-100 border-green-400 text-green-700"
        } border px-4 py-3 rounded relative`}
        role="alert"
      >
        <strong className="font-bold">¡Usuario borrado!</strong>
        <span className="block sm:inline"> Redirigiendo...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${
          darkMode
            ? "bg-red-900 border-red-800 text-red-100"
            : "bg-red-100 border-red-400 text-red-700"
        } border px-4 py-3 rounded relative`}
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`text-center py-10 ${darkMode ? "text-white" : ""}`}>
        <h2
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Usuario no encontrado
        </h2>
        <Link
          to="/"
          className={`mt-4 inline-block ${
            darkMode
              ? "text-gray-300 hover:text-white"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`max-w-2xl mx-auto ${darkMode ? "text-white" : ""}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Detalles del Usuario
        </h1>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-500 hover:bg-gray-600"
            } text-white font-medium py-2 px-4 rounded transition-colors cursor-pointer`}
            onClick={() => navigate(`/user/${id}/edit`)}
          >
            Editar
          </motion.button>

          <motion.button
            onClick={handleDelete}
            disabled={isDeleting}
            whileHover={isDeleting ? {} : { scale: 1.05 }}
            whileTap={isDeleting ? {} : { scale: 0.95 }}
            className={`${
              darkMode
                ? "bg-red-700 hover:bg-red-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 cursor-pointer`}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </motion.button>
        </div>
      </div>

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="rounded-lg overflow-hidden"
        style={{
          background: isHovering
            ? `radial-gradient(circle at ${coords.x}px ${coords.y}px, ${
                darkMode ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.15)"
              }, ${darkMode ? "rgb(31, 41, 55)" : "white"} 80%)`
            : darkMode
            ? "rgb(31, 41, 55)"
            : "white",
        }}
        animate={{
          scale: isHovering ? 1.01 : 1,
          boxShadow: isHovering
            ? darkMode
              ? "0 10px 25px rgba(0,0,0,0.3)"
              : "0 10px 25px rgba(0,0,0,0.1)"
            : darkMode
            ? "0 4px 10px rgba(0,0,0,0.3)"
            : "0 4px 10px rgba(0,0,0,0.05)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="p-6"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <motion.img
                src={user.avatar || "/placeholder.svg"}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    ID
                  </h3>
                  <p
                    className={`text-lg ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {user.id}
                  </p>
                </div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Email
                  </h3>
                  <p
                    className={`text-lg ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {user.email}
                  </p>
                </div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Nombre
                  </h3>
                  <p
                    className={`text-lg ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {user.first_name}
                  </p>
                </div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Apellido
                  </h3>
                  <p
                    className={`text-lg ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {user.last_name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <motion.div whileHover={{ x: 5, scale: 1.05 }}>
          <Link
            to="/"
            className={`${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-800"
            } inline-block`}
          >
            &larr; Volver al listado
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default UserDetailPage;
