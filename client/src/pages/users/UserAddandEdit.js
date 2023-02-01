import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import style from "../home/Home.module.css";
import { userById, onSubmit } from "../api/userApi";
import useHttp from "../../hooks/useHttp";

const AddEditUsers = () => {
  const { send: getUserById } = useHttp(userById);
  const { send: submit } = useHttp(onSubmit);
  const navigate = useNavigate();
  const params = useParams();
  const isUpdate = params.id !== "new";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isUpdate) {
      getUserById({ id: params.id, reset });
    }
  }, []);

  return (
    <Layout title={isUpdate ? "Edit User " : "Add a new User"}>
      <form
        onSubmit={handleSubmit((data) =>
          submit({ data, isUpdate, id: params.id, navigate, reset })
        )}
        className={[style.container, style.formStyle].join(" ") + " "}
      >
         <label htmlFor="text" style={{color:"white", padding:"2px 10px"}}>FirstName</label>
        <input
          className="form-control"
          id="text"
          type="text"
          placeholder="FirstName"
          {...register("firstName", {
            required: { value: true, message: "FirstName kiriting" },
          })}
        />
        {errors.firstName && <p>{errors.firstName.message}</p>}
        <label htmlFor="text" style={{color:"white", padding:"2px 10px"}}>LastName</label>
        <input
          className="form-control"
          id="text"
          type="text"
          placeholder="LastName"
          {...register("lastName", {
            required: { value: true, message: "lastName kiriting" },
          })}
        />
        {errors.lasName && <p>{errors.lastName.message}</p>}
        <label htmlFor="text" style={{color:"white", padding:"2px 10px"}}>UserName</label>
        <input
          className="form-control"
          id="text"
          type="text"
          placeholder="UserName"
          {...register("username", {
            required: { value: true, message: "Username kiriting" },
          })}
        />
        {errors.username && <p>{errors.email.message}</p>}
        {errors.password && <p>{errors.password.message}</p>}
        <label htmlFor="text" style={{color:"white", padding:"2px 10px"}}>Email</label>
        <input
          className="form-control"
          id="text"
          type="text"
          placeholder="email"
          {...register("email", {
            required: { value: true, message: "email kiriting" },
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
        <label htmlFor="text" style={{color:"white", padding:"2px 10px"}}>PhoneNumber</label>
        <input
          className="form-control"
          id="text"
          type="text"
          placeholder="phoneNumber"
          {...register("phoneNumber", {
            required: { value: true, message: "phoneNumber kiriting" },
          })}
        />
        {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        <br></br>
        <button className="btn btn-primary ">Save</button>
        <Link to={`/`} className="btn btn-secondary ">
          Back
        </Link>
      </form>
    </Layout>
  );
};

export default AddEditUsers;
