import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserCard from "../components/UserCard";
import { getUsers } from "../services/api";

const UserListPage = () => {
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Listado de Usuarios
        </h1>
        <Link
          to="/user/create"
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Crear Usuario
        </Link>
      </div>

      <div className="mb-4">
        <div className="flex space-x-4 mb-2">
          <button
            onClick={() => handleSort("first_name")}
            className={`px-3 py-1 rounded ${
              sortBy === "first_name" ? "bg-gray-100 text-black" : "bg-gray-100"
            }`}
          >
            Nombre{" "}
            {sortBy === "first_name" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("last_name")}
            className={`px-3 py-1 rounded ${
              sortBy === "last_name" ? "bg-gray-100 text-black" : "bg-gray-100"
            }`}
          >
            Apellido{" "}
            {sortBy === "last_name" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserListPage;
