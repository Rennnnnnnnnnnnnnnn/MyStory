import { useEffect } from "react";
import RegisterAccount from "./pages/Register";
import LoginAccount from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./pages/auth/AuthProvider";
import PrivateRoute from "./pages/auth/PrivateRoute";
import Profile from "./pages/Profile";


export default function App() {

  const { user, isAuthenticated, login, logout } = useAuth();

  console.log(isAuthenticated, "qweqwe")

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<LoginAccount />}></Route>
          <Route path="/register" element={<RegisterAccount />}></Route>
          {/* PRIVATE ROUTES */}
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />}></Route>
        </Routes>
      </BrowserRouter >
    </>
  )
}

