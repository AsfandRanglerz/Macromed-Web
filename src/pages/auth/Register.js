import React, { useState } from "react";
import "./Auth.css";
import AuthLogo from "./AuthLogo";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import AuthLoading from "./AuthLoading";
import { toast } from "react-toastify";

function Register() {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("*It is not a valid email")
      .required("*Email is required"),
    name: yup.string().required("*Username is required"),
    phone: yup
      .string()
      .required("*Phone Number is required")
      .matches(/^\d+$/, "*Phone Number must be a valid number"),
    profession: yup.string().required("*Profession is required"),
    address: yup.string().required("*Address is required"),
    password: yup
      .string()
      .min(8, "*Password should have 8 or more characters")
      .required("*Password is required"),
    confirmPassword: yup
      .string()
      .min(8, "*Password should have 8 or more characters")
      .required("*Confirm password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitForm = async (data) => {
    if (data.password == data.confirmPassword) {
      try {
        setLoading(true);
        let response = await axios.post(
          `${process.env.REACT_APP_API_URL}api/register`,
          data
        );
        setLoading(false);

        toast.success(response.data.message || "Registered Successfully", {
          position: "top-right",
          autoClose: 3000,
        });

        navigate("/auth/login");
      } catch (error) {
        setLoading(false);

        toast.error(
          error?.response?.data?.errors?.email[0] || "Network Error!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    } else {
      toast.error("Password and confirm password should be same");
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
              <h5 className="text-grey2 font-400 mb-3">
                Register your account
              </h5>
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
                <div className="form-group mb-3">
                  <label htmlFor="" className="form-label font-500">
                    User Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("name")}
                  />
                  <span className="text-danger error">
                    {errors?.name?.message || ""}
                  </span>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="" className="form-label font-500">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("phone")}
                  />

                  <span className="text-danger error">
                    {errors?.phone?.message}
                  </span>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="" className="form-label font-500">
                    Profession
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("profession")}
                  />
                  <span className="text-danger error">
                    {errors?.profession?.message || ""}
                  </span>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="" className="form-label font-500">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("address")}
                  />
                  <span className="text-danger error">
                    {errors?.address?.message || ""}
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
                        show ? "" : "-slash"
                      }`}
                    ></span>
                  </div>
                  <span className="text-danger error">
                    {errors?.password?.message || ""}
                  </span>
                </div>
                <div className="form-group password-input mb-3">
                  <label htmlFor="" className="form-label font-500">
                    Confirm Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={show2 ? "text" : "password"}
                      className="form-control"
                      {...register("confirmPassword")}
                    />
                    <span
                      onClick={() => setShow2(!show2)}
                      className={`pointer eye-icon fa-regular fa-eye${
                        show2 ? "" : "-slash"
                      }`}
                    ></span>
                  </div>
                  <span className="text-danger error">
                    {errors?.confirmPassword?.message || ""}
                  </span>
                </div>
                <div className="mt-2">
                  <div
                    style={{ fontSize: "0.7rem" }}
                    className="text-center text-grey m-0 p-0"
                  >
                    By Continuing, you agree to Macromed{" "}
                    <Link>Terms of Service</Link> and acknowledge our{" "}
                    <Link>Privacy Policy</Link>. We may send you marketting
                    emails about Macromed products, services and local events.
                    Unsbscribe at any time.
                  </div>
                </div>
                <div className="text-center">
                  <input
                    type="submit"
                    value="Register"
                    className="text-white border-0 rounded text-center mt-4 form-button"
                  />
                </div>
                <p className="text-center mt-1 text-grey f-size">
                  Already have an account?{" "}
                  <span className="text-theme fw-medium link">
                    <Link to="/auth/login" className="text-decoration-none">
                      Login
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

export default Register;
