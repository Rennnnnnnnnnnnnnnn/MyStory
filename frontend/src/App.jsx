import RegisterAccount from "./pages/Register";
import LoginAccount from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./pages/auth/AuthProvider";
import PrivateRoute from "./pages/auth/PrivateRoute";
import Profile from "./pages/Profile";
import Layout from "./layout/Layout";
import Feed from "./pages/Feed";
import ScrollRestorationWrapper from "./layout/ScrollRestorationWrapper";

export default function App() {

  return (
    <>
      <BrowserRouter>
        <ScrollRestorationWrapper />
        <Routes>
      
          <Route element={<Layout />}>
            <Route path="/feed" element={<Feed />} />
          </Route>

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

