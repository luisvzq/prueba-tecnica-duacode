import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../services/api";
import { validateImage, validateUserForm } from "../utils/validators";

const UserCreatePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(8);
  const [creationTime, setCreationTime] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await createUser(formData);

      setCreationTime(new Date().toLocaleString());

      setCreatedUser({
        ...response,
        avatar: imagePreview || response.avatar,
        selectedFileName: selectedFileName || null,
      });
      setCreateSuccess(true);

      let countdown = 8;
      const timer = setInterval(() => {
        countdown -= 1;
        setRedirectCountdown(countdown);

        if (countdown <= 0) {
          clearInterval(timer);
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      setError(
        "Error al crear el usuario: " +
          (err.message || "Verifica el tamaño de los datos enviados")
      );
      setSubmitting(false);
    }
  };

  if (createSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">¡Usuario creado correctamente!</strong>
          <span className="block sm:inline">
            {" "}
            Serás redirigido al listado en {redirectCountdown} segundos...
          </span>
          <Link to="/" className="ml-2 font-medium underline">
            Volver ahora
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Detalles del Usuario
          </h1>
          <div className="flex space-x-2">
            <button
              disabled
              className="bg-gray-500 opacity-50 text-white font-medium py-2 px-4 rounded cursor-not-allowed"
            >
              Editar
            </button>
            <button
              disabled
              className="bg-red-500 opacity-50 text-white font-medium py-2 px-4 rounded cursor-not-allowed"
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                <img
                  src={createdUser.avatar || "/avatar-placeholder.jpg"}
                  alt={`${createdUser.first_name} ${createdUser.last_name}`}
                  className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                />
              </div>
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ID</h3>
                    <p className="text-lg text-gray-800">{createdUser.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-lg text-gray-800">{createdUser.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Nombre
                    </h3>
                    <p className="text-lg text-gray-800">
                      {createdUser.first_name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Apellido
                    </h3>
                    <p className="text-lg text-gray-800">
                      {createdUser.last_name}
                    </p>
                  </div>
                  {createdUser.selectedFileName && (
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Archivo de imagen seleccionado
                      </h3>
                      <p className="text-lg text-gray-800">
                        {createdUser.selectedFileName}
                      </p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">
                      Creado en
                    </h3>
                    <p className="text-lg text-gray-800">{creationTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 italic">
            Nota: Debido a que ReqRes.in es una API de prueba, este usuario no
            se guardará permanentemente.
          </p>
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 mt-2 inline-block"
          >
            &larr; Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Crear Nuevo Usuario
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${
                  formErrors.first_name ? "border-red-500" : "border-gray-300"
                }`}
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Apellido
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${
                  formErrors.last_name ? "border-red-500" : "border-gray-300"
                }`}
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              <div className="h-5 mt-1">
                {formErrors.email && (
                  <p className="text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar
              </label>

              <div className="mb-4">
                <div className="flex items-center justify-center">
                  <img
                    src={imagePreview || "/avatar-placeholder.jpg"}
                    alt="Avatar Preview"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
                {selectedFileName && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Archivo seleccionado: {selectedFileName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">
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
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
                  <p className="text-sm text-gray-500 mb-2">O usar URL:</p>
                  <input
                    type="url"
                    value={selectedFileName ? "" : formData.avatar}
                    onChange={handleImageUrlChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
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
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreatePage;
