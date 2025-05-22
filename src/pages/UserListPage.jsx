import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import UserCard from "../components/UserCard";
import { ThemeContext } from "../context/ThemeContext";
import { getUsers } from "../services/api";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const UserListPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers(currentPage);
        setUsers(data.data);
        setTotalPages(data.total_pages);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los usuarios");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (sortOrder === "asc") {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`transition-colors duration-300 ${
        darkMode ? "text-white" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Listado de Usuarios
        </h1>
        <Link
          to="/user/create"
          className={`${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-500 hover:bg-gray-600"
          } text-white font-medium py-2 px-4 rounded transition-colors`}
        >
          Crear Usuario
        </Link>
      </div>

      <div className="mb-4">
        <div className="flex space-x-4 mb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSort("first_name")}
            className={`px-3 py-1 rounded ${
              sortBy === "first_name"
                ? darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-black"
                : darkMode
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Nombre{" "}
            {sortBy === "first_name" && (sortOrder === "asc" ? "↑" : "↓")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSort("last_name")}
            className={`px-3 py-1 rounded ${
              sortBy === "last_name"
                ? darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-black"
                : darkMode
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Apellido{" "}
            {sortBy === "last_name" && (sortOrder === "asc" ? "↑" : "↓")}
          </motion.button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedUsers.map((user) => (
          <motion.div key={user.id} variants={itemVariants}>
            <UserCard user={user} />
          </motion.div>
        ))}
      </motion.div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
};

export default UserListPage;
