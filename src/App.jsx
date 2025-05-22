import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import FloatingThemeToggle from "./components/FloatingThemeToggle";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";
import UserCreatePage from "./pages/UserCreatePage";
import UserDetailPage from "./pages/UserDetailPage";
import UserEditPage from "./pages/UserEditPage";
import UserListPage from "./pages/UserListPage";

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<UserListPage />} />
          <Route path="/user/:id" element={<UserDetailPage />} />
          <Route path="/user/:id/edit" element={<UserEditPage />} />
          <Route path="/user/create" element={<UserCreatePage />} />
        </Routes>
      </main>

      <FloatingThemeToggle />
    </div>
  );
}

export default App;
