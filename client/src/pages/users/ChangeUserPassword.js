import React from "react";
import { useForm } from "react-hook-form";
import "../auth/Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import style from "../home/Home.module.css";
import Navbar from "../../components/Navbar";

function ChangeUserPassword() {
    const userId = localStorage.getItem("userId");
    const user=localStorage.getItem('firstName')+' '+localStorage.getItem('lastName')
  const navigate = useNavigate();
  const schema = yup.object().shape({
    password: yup
      .string()
      .min(6, "Password must be At least 6 character")
      .required(),
      newPassword: yup
      .string()
      .min(6, "Password must be At least 6 character")
      .required(),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });
  const loginHandler = async (data) => {
    try {
      const res = await axios.put(
        `http://localhost:5678/api/v1/users/change-password/${userId}`,
        data
      );
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  return (
    <>
    <Navbar title={user}/>
    <div className="registerBody" >
      <p className="title" style={{backgroundColor:"#0F2045", color:"white"}}>Change Password Form</p>
      <form className="registerApp" onSubmit={handleSubmit(loginHandler)} style={{backgroundColor:"#0F2045", color:"white"}}>
        <label style={{ textAlign:"left", padding:'1px 5px'}}>Current Password</label>
        <input
          className={`form-control ${errors.password ? style.errorBorder : ""}`}
          type="password"
          {...register("password")}
          placeholder="Password"
        />
        {errors.password && (
          <span className="err">{errors.password.message} </span>
        )}
        <label style={{ textAlign:"left", padding:'1px 5px'}}>New Password</label>
        <input
          className={`form-control ${errors.newPassword ? style.errorBorder : ""}`}
          type="password"
          {...register("newPassword")}
          placeholder="newPassword"
        />
        {errors.newPassword && (
          <span className="err">{errors.newPassword.message} </span>
        )}
        <label style={{ textAlign:"left", padding:'1px 5px'}}>Confirm New Password</label>
        <input
          className={`form-control ${errors.confirmNewPassword ? style.errorBorder : ""}`}
          type="password"
          {...register("confirmNewPassword")}
          placeholder="Confirm New Password"
        />
        {errors.confirmNewPassword && (
          <span className="err">{errors.confirmNewPassword.message} </span>
        )}
        <br></br>
        <button
          type={"submit"}
          className="btn btn-primary"
          style={{
            border:"2px solid white",
            width: "50%",
            padding: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            margin: "0 auto",
            fontWeight:500         
           }}
        >
          Send
        </button>
        <br></br>
        <Link
          to={"/"}
          style={{
            width: "50%",
            padding: "3px",
            borderRadius: "8px",
            textDecoration: "none",
            margin: "0 auto",
            border:"2px solid white",
          }}
          className="btn btn-secondary "
        >
          Cancel
        </Link>
      </form>
    </div>
    </>
  );
}
export default ChangeUserPassword;
