import { Loader2 } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { getUserById, updateUser } from "../services/api";
import { validateImage, validateUserForm } from "../utils/validators";

const UserEditPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [changes, setChanges] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(8);
  const [updateTime, setUpdateTime] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(id);
        setOriginalData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          avatar: userData.avatar || "",
        });
        setFormData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          avatar: userData.avatar || "",
        });
        setImagePreview(userData.avatar || "");
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos del usuario");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const validateForm = () => {
    return validateUserForm(formData, setFormErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateImage(file, setFormErrors)) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setSelectedFileName(file.name);

    setFormData((prev) => ({
      ...prev,
      avatar: `https://reqres.in/img/faces/${
        Math.floor(Math.random() * 12) + 1
      }-image.jpg`,
    }));

    if (formErrors.avatar) {
      setFormErrors((prev) => ({
        ...prev,
        avatar: null,
      }));
    }
  };

  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      avatar: value,
    }));
    setImagePreview(value);
    setSelectedFileName("");

    if (formErrors.avatar) {
      setFormErrors((prev) => ({
        ...prev,
        avatar: null,
      }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const detectChanges = () => {
    const changesDetected = [];

    if (formData.first_name !== originalData.first_name) {
      changesDetected.push({
        field: "Nombre",
        from: originalData.first_name,
        to: formData.first_name,
      });
    }

    if (formData.last_name !== originalData.last_name) {
      changesDetected.push({
        field: "Apellido",
        from: originalData.last_name,
        to: formData.last_name,
      });
    }

    if (formData.email !== originalData.email) {
      changesDetected.push({
        field: "Email",
        from: originalData.email,
        to: formData.email,
      });
    }

    if (selectedFileName || formData.avatar !== originalData.avatar) {
      changesDetected.push({
        field: "Avatar",
        from: "Imagen anterior",
        to: selectedFileName || "Nueva URL de imagen",
      });
    }

    return changesDetected;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await updateUser(id, formData);

      const changesDetected = detectChanges();
      setChanges(changesDetected);

      setUpdateTime(new Date().toLocaleString());

      setUpdateSuccess(true);

      let countdown = 8;
      const timer = setInterval(() => {
        countdown -= 1;
        setRedirectCountdown(countdown);

        if (countdown <= 0) {
          clearInterval(timer);
          navigate(`/user/${id}`);
        }
      }, 1000);
    } catch (err) {
      setError(
        "Error al actualizar el usuario: " +
          (err.message || "Verifica el tamaño de los datos enviados")
      );
      setSubmitting(false);
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

  if (updateSuccess) {
    return (
      <div className={`max-w-2xl mx-auto ${darkMode ? "text-white" : ""}`}>
        <div
          className={`${
            darkMode
              ? "bg-green-900 border-green-800 text-green-100"
              : "bg-green-100 border-green-400 text-green-700"
          } border px-4 py-3 rounded relative mb-6`}
          role="alert"
        >
          <strong className="font-bold">
            ¡Usuario actualizado correctamente!
          </strong>
          <span className="block sm:inline">
            {" "}
            Serás redirigido a la página de detalles en {redirectCountdown}{" "}
            segundos...
          </span>
          <Link
            to={`/user/${id}`}
            className={`ml-2 font-medium underline ${
              darkMode ? "text-green-200" : ""
            }`}
          >
            Volver ahora
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Detalles del Usuario
          </h1>
          <div className="flex space-x-2">
            <button
              disabled
              className={`${
                darkMode ? "bg-blue-700" : "bg-blue-500"
              } opacity-50 text-white font-medium py-2 px-4 rounded cursor-not-allowed`}
            >
              Editar
            </button>
            <button
              disabled
              className={`${
                darkMode ? "bg-red-700" : "bg-red-500"
              } opacity-50 text-white font-medium py-2 px-4 rounded cursor-not-allowed`}
            >
              Eliminar
            </button>
          </div>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-md rounded-lg overflow-hidden`}
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                <img
                  src={imagePreview || "/placeholder.svg?height=100&width=100"}
                  alt={`${formData.first_name} ${formData.last_name}`}
                  className={`w-40 h-40 rounded-full object-cover border-4 ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
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
                      {id}
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
                      {formData.email}
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
                      {formData.first_name}
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
                      {formData.last_name}
                    </p>
                  </div>
                  {selectedFileName && (
                    <div className="md:col-span-2">
                      <h3
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Archivo de imagen seleccionado
                      </h3>
                      <p
                        className={`text-lg ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {selectedFileName}
                      </p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <h3
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Actualizado en
                    </h3>
                    <p
                      className={`text-lg ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {updateTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {changes.length > 0 && (
          <div
            className={`mt-6 ${
              darkMode
                ? "bg-blue-900 border-blue-800 text-blue-100"
                : "bg-blue-50 border-blue-200 text-blue-700"
            } border rounded-lg p-4`}
          >
            <h3
              className={`font-medium ${
                darkMode ? "text-blue-200" : "text-blue-800"
              } mb-2`}
            >
              Cambios realizados:
            </h3>
            <ul
              className={`list-disc pl-5 ${
                darkMode ? "text-blue-200" : "text-blue-700"
              }`}
            >
              {changes.map((change, index) => (
                <li key={index}>
                  <strong>{change.field}:</strong>{" "}
                  {change.field === "Avatar" && selectedFileName
                    ? `Se ha seleccionado la imagen: ${selectedFileName}`
                    : change.field === "Avatar"
                    ? "Se ha actualizado la URL de la imagen de perfil"
                    : `Cambiado de "${change.from}" a "${change.to}"`}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            } italic`}
          >
            Nota: Debido a que ReqRes.in es una API de prueba, estos cambios no
            se guardarán permanentemente.
          </p>
          <Link
            to={`/user/${id}`}
            className={`${
              darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            } mt-2 inline-block`}
          >
            &larr; Volver a la página de detalles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto ${darkMode ? "text-white" : ""}`}>
      <h1
        className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        } mb-6`}
      >
        Editar Usuario
      </h1>

      {error && (
        <div
          className={`${
            darkMode
              ? "bg-red-900 border-red-800 text-red-100"
              : "bg-red-100 border-red-400 text-red-700"
          } border px-4 py-3 rounded relative mb-4`}
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-md rounded-lg overflow-hidden`}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="first_name"
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Nombre
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                } ${formErrors.first_name ? "border-red-500" : ""}`}
              />
              <div className="h-5 mt-1">
                {formErrors.first_name && (
                  <p className="text-sm text-red-600">
                    {formErrors.first_name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="last_name"
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Apellido
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                } ${formErrors.last_name ? "border-red-500" : ""}`}
              />
              <div className="h-5 mt-1">
                {formErrors.last_name && (
                  <p className="text-sm text-red-600">{formErrors.last_name}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                } ${formErrors.email ? "border-red-500" : ""}`}
              />
              <div className="h-5 mt-1">
                {formErrors.email && (
                  <p className="text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Avatar
              </label>

              <div className="mb-4">
                <div className="flex items-center justify-center">
                  <img
                    src={
                      imagePreview || "/placeholder.svg?height=100&width=100"
                    }
                    alt="Avatar Preview"
                    className={`w-32 h-32 rounded-full object-cover border-2 ${
                      darkMode ? "border-gray-600" : "border-gray-300"
                    }`}
                  />
                </div>
                <div className="h-5 mt-2">
                  {selectedFileName && (
                    <p
                      className={`text-center text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Archivo seleccionado: {selectedFileName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } mb-2`}
                  >
                    Subir imagen (máx. 500KB):
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className={`w-full flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      darkMode
                        ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Seleccionar imagen
                  </button>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } mb-2`}
                  >
                    O usar URL:
                  </p>
                  <input
                    type="url"
                    value={selectedFileName ? "" : formData.avatar}
                    onChange={handleImageUrlChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
              <div className="h-5 mt-1">
                {formErrors.avatar && (
                  <p className="text-sm text-red-600">{formErrors.avatar}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={() => navigate(`/user/${id}`)}
              className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                darkMode
                  ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {submitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;
