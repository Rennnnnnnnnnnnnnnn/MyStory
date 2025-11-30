
import RegisterAccount from "./pages/Register";
import LoginAccount from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./pages/auth/AuthProvider";
import PrivateRoute from "./pages/auth/PrivateRoute";
import Profile from "./pages/Profile";
import Layout from "./layout/Layout";
import Feed from "./pages/Feed";

export default function App() {

  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<LoginAccount />}></Route>
          <Route path="/register" element={<RegisterAccount />}></Route>
          {/* PRIVATE ROUTES */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/feed" element={<Feed />} />
          </Route>
        </Routes>
      </BrowserRouter >
    </>
  )
}

