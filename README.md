# Prueba técnica DUACODE <small><em>(por Luis Díaz Vázquez)</em></small>

Este proyecto es una aplicación de gestión de usuarios construida con **React + Vite**, que se conecta a la API pública [ReqRes.in](https://reqres.in).

Permite **listar**, **crear**, **editar**, **ver detalles** y **eliminar** usuarios con una interfaz moderna, validación de formularios, temas claro/oscuro, animaciones suaves y enrutamiento dinámico.

> ⚠️ **Importante:** ReqRes.in es una API de pruebas. Aunque las operaciones como `POST`, `PUT` y `DELETE` se ejecutan y responden correctamente, **los datos no se guardan** de forma persistente y no aparecerán en el listado después de actualizar.

---

## Tecnologías utilizadas

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) – Estilos utilitarios
- [Axios](https://axios-http.com/) – Peticiones HTTP
- [React Router DOM](https://reactrouter.com/) – Enrutamiento SPA
- [Framer Motion](https://www.framer.com/motion/) – Animaciones suaves
- [Lucide React](https://lucide.dev/) – Iconografía moderna
- Context API – Gestión del tema claro/oscuro
- Validación de formularios personalizada (`utils/validator.js`)

---

## Instalación, configuración y ejecución

### 1. Clonar el repositorio

Abre una terminal y ejecuta:

```bash
git clone https://github.com/luisvzq/prueba-tecnica-duacode.git
cd prueba-tecnica-duacode
npm install
```

### 3. Obtener y configurar la API key

Este proyecto utiliza la API pública de [ReqRes.in](https://reqres.in), que requiere una API key.

Sigue estos pasos para configurarla:

1.  Ve a [https://reqres.in/signup](https://reqres.in/signup)
2.  Regístrate para obtener una API key gratuita
3.  Copia la clave que te proporciona la API
4.  Renombra el archivo `.env.example` a `.env`:
5.  Abre el archivo `.env` y reemplaza el valor de `VITE_API_KEY` con tu clave:

```bash
VITE_API_KEY=tu_api_key_aqui
```

### 4. Ejecutar la aplicación en modo desarrollo

```bash
npm run dev
```

Esto levantará la aplicación en [http://localhost:5173](http://localhost:5173)

Si lo prefieres, también puedes visualizar el proyecto desplegado en [https://prueba-tecnica-duacode.vercel.app//](https://prueba-tecnica-duacode.vercel.app/)
