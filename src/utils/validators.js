export const validateUserForm = (formData, setFormErrors) => {
  const errors = {};
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (!formData.first_name?.trim()) {
    errors.first_name = "El nombre es obligatorio";
  } else if (formData.first_name.trim().length < 3) {
    errors.first_name = "El nombre debe tener al menos 3 caracteres";
  } else if (!nameRegex.test(formData.first_name.trim())) {
    errors.first_name = "El nombre solo debe contener letras y espacios";
  }

  if (!formData.last_name?.trim()) {
    errors.last_name = "El apellido es obligatorio";
  } else if (formData.last_name.trim().length < 3) {
    errors.last_name = "El apellido debe tener al menos 3 caracteres";
  } else if (!nameRegex.test(formData.last_name.trim())) {
    errors.last_name = "El apellido solo debe contener letras y espacios";
  }

  if (!formData.email?.trim()) {
    errors.email = "El email es obligatorio";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "El email no es válido";
  }

  setFormErrors(errors);

  return Object.keys(errors).length === 0;
};

export const validateImage = (file, setFormErrors) => {
  if (!file) return true;

  if (!file.type.startsWith("image/")) {
    setFormErrors((prev) => ({
      ...prev,
      avatar: "El archivo debe ser una imagen",
    }));
    return false;
  }

  if (file.size > 500 * 1024) {
    setFormErrors((prev) => ({
      ...prev,
      avatar:
        "La imagen no debe superar los 500KB debido a limitaciones de la API",
    }));
    return false;
  }

  return true;
};
