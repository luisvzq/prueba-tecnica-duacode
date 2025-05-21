"use client";

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../services/api";

const UserEditPage = () => {
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
    const errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = "El nombre es obligatorio";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "El apellido es obligatorio";
    }

    if (!formData.email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El email no es válido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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

    if (!file.type.startsWith("image/")) {
      setFormErrors((prev) => ({
        ...prev,
        avatar: "El archivo debe ser una imagen",
      }));
      return;
    }

    if (file.size > 500 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        avatar:
          "La imagen no debe superar los 500KB debido a limitaciones de la API",
      }));
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

      setUpdateSuccess(true);

      setTimeout(() => {
        navigate(`/user/${id}`);
      }, 7000);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (updateSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6"
          role="alert"
        >
          <h3 className="font-bold text-lg mb-2">
            ¡Usuario actualizado correctamente!
          </h3>
          <p className="mb-2">Se han realizado los siguientes cambios:</p>

          {changes.length > 0 ? (
            <ul className="list-disc pl-5 mb-4">
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
          ) : (
            <p className="mb-4">No se detectaron cambios en los datos.</p>
          )}

          <p className="text-sm italic">
            Nota: Debido a que ReqRes.in es una API de prueba, estos cambios no
            se guardarán permanentemente. Serás redirigido en unos segundos...
          </p>

          <div className="mt-4">
            <Link
              to={`/user/${id}`}
              className="text-green-800 font-medium hover:underline"
            >
              Volver a la página de detalles ahora
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Usuario</h1>

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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.first_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.first_name && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.first_name}
                </p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.last_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.last_name && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.last_name}
                </p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar
              </label>

              <div className="mb-4">
                <div className="flex items-center justify-center">
                  <img
                    src={
                      imagePreview || "/placeholder.svg?height=100&width=100"
                    }
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              {formErrors.avatar && (
                <p className="mt-1 text-sm text-red-600">{formErrors.avatar}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={() => navigate(`/user/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
