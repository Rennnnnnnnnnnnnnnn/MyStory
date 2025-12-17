import RegisterAccount from "./pages/Register";
import LoginAccount from "./pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
          {/* 
          <Route path="/login" element={<LoginAccount />} />
          <Route path="/register" element={<RegisterAccount />} />
          */}
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route element={<Layout />}>
            <Route path="/feed" element={<Feed />} />
          </Route>

          {/* PRIVATE ROUTES */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter >
    </>
  )
}

