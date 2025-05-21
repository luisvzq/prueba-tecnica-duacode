import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteUser, getUserById } from "../services/api";

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (deleteSuccess) {
    return (
      <div
        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
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
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800">
          Usuario no encontrado
        </h2>
        <Link
          to="/"
          className="mt-4 inline-block text-gray-600 hover:text-gray-800"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Detalles del Usuario
        </h1>
        <div className="flex space-x-2">
          <Link
            to={`/user/${id}/edit`}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
              />
            </div>
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">ID</h3>
                  <p className="text-lg text-gray-800">{user.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg text-gray-800">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                  <p className="text-lg text-gray-800">{user.first_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Apellido
                  </h3>
                  <p className="text-lg text-gray-800">{user.last_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/" className="text-gray-600 hover:text-gray-800">
          &larr; Volver al listado
        </Link>
      </div>
    </div>
  );
};

export default UserDetailPage;
