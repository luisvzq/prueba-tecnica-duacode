import { Route, Routes } from "react-router-dom";
import UserCreatePage from "./pages/UserCreatePage";
import UserDetailPage from "./pages/UserDetailPage";
import UserEditPage from "./pages/UserEditPage";
import UserListPage from "./pages/UserListPage";

function App() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Routes>
        <Route path="/" element={<UserListPage />} />
        <Route path="/user/:id" element={<UserDetailPage />} />
        <Route path="/user/:id/edit" element={<UserEditPage />} />
        <Route path="/user/create" element={<UserCreatePage />} />
      </Routes>
    </main>
  );
}

export default App;
