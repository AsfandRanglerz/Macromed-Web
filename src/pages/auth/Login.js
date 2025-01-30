import React, { useState } from "react";
import "./Auth.css";
import AuthLogo from "./AuthLogo";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/userSlice";
import AuthLoading from "./AuthLoading";
import { toast } from "react-toastify";

function Login() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selector = useSelector((state) => {
    return state.user;
  });

  const dispatch = useDispatch();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("*Email is not valid")
      .required("*Email is required"),
    password: yup.string().required("*Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitForm = async (data) => {
    try {
      setLoading(true);
      let response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/login`,
        data,
        { withCredentials: true }
      );

      dispatch(
        loginUser({
          userData: response.data.user,
          token: response.data.token,
        })
      );
      setLoading(false);
      toast.success(response.data.message || "Login successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.error || "Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      {loading && <AuthLoading />}
      <div className="container-fluid">
        <div className="row align-items-start">
          <AuthLogo />
          <div className="col-sm-7 my-4">
            <div className="px-2 px-sm-0 col-sm-12 col-md-10 col-lg-9 col-xl-7 mx-auto">
              <h3 className="font-700">Welcome to Macromed</h3>
              <h5 className="text-grey2 font-400 mb-3">Login your account</h5>
              <form onSubmit={handleSubmit(submitForm)}>
                <div className="form-group mb-3">
                  <label htmlFor="" className="form-label font-500">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("email")}
                  />
                  <span className="text-danger error">
                    {errors?.email?.message || ""}
                  </span>
                </div>
                <div className="form-group password-input mb-3">
                  <label htmlFor="" className="form-label font-500">
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={show ? "text" : "password"}
                      className="form-control"
                      {...register("password")}
                    />
                    <span
                      onClick={() => setShow(!show)}
                      className={`pointer eye-icon fa-regular fa-eye${
                        show ? "-slash" : ""
                      }`}
                    ></span>
                  </div>
                  <span className="text-danger error">
                    {errors?.password?.message || ""}
                  </span>
                  <Link
                    to="/auth/forgot-password"
                    className="text-decoration-none text-grey forgot-link"
                  >
                    <p className="mt-1">Forgot Password?</p>
                  </Link>
                </div>
                <div className="text-center">
                  <input
                    type="submit"
                    value="Login"
                    className="text-white border-0 rounded text-center mt-5 form-button"
                  />
                </div>
                <p className="text-center mt-1 text-grey f-size">
                  Don't have an account?{" "}
                  <span className="text-theme fw-medium link">
                    <Link to="/auth/register" className="text-decoration-none">
                      Register
                    </Link>
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
