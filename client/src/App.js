import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Verify from "./pages/auth/verify";
import Users from "./pages/users/User";
import AddEditUsers from "./pages/users/UserAddandEdit";
import { useEffect } from "react";
import VerifyByPhone from "./pages/auth/verifyByPhone";
import ForgotPassword from "./pages/auth/forgotPassword";
import ChangeUserPassword from "./pages/users/ChangeUserPassword";

function App() {
  const navigate = useNavigate();
  const userrole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, userrole]);

  return (
    <>
      <ToastContainer />
      <Routes>
        {<Route path="/" element={<Home />} />}
        {userrole === "SUPER_ADMIN" && (
          <Route path="/users/" element={<Users />} />
        )}
        
          <Route path="/users/:id" element={<AddEditUsers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/users/change-password/:id" element={<ChangeUserPassword />} />
        <Route path="/verify/:id" element={<Verify />} />
        <Route path="/verifyByPhone/:id" element={<VerifyByPhone />} />
      </Routes>
    </>
  );
}

export default App;
