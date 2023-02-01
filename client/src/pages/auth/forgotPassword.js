import React from "react";
import { useForm } from "react-hook-form";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import style from "../home/Home.module.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const schema = yup.object().shape({
    email: yup.string().email("Email required").required(),
  });
  const loginHandler = async (email) => {
    try {
      const res = await axios.post(
        "http://localhost:5678/api/v1/auth/forgot-password",
        email
      );
      toast.success(res.data.message);
      navigate("/login");
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
    <div className="registerBody">
      <p className="title">Forgot Password Form</p>
      <form className="registerApp" onSubmit={handleSubmit(loginHandler)}>
        <input
          className={`form-control ${errors.email ? style.errorBorder : ""}`}
          type="text"
          {...register("email")}
          placeholder="Email "
        />
        {errors.email && (
          <span className="err">{errors.email.message} </span>
        )}
        <br></br>
        <button
          type={"submit"}
          style={{
            backgroundColor: "#a1eafb",
            width: "60%",
            padding: "5px",
            borderRadius: "4px",
            textDecoration: "none",
            margin: "0 auto",
          }}
        >
          Send
        </button>
        <br></br>
        <Link
          to={"/login"}
          style={{
            color: "white",
            backgroundColor: "grey",
            width: "40%",
            padding: "2px",
            borderRadius: "4px",
            textDecoration: "none",
            margin: "0 auto",
          }}
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}
export default ForgotPassword;
