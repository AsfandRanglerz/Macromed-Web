import React, { useState } from "react";
import "./Auth.css";
import AuthLogo from "./AuthLogo";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLoading from "./AuthLoading";
import { toast } from "react-toastify";

function NewPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const schema = yup.object().shape({
    password: yup.string().required("*Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "*Password must be same")
      .required("*Confirm Password is required"),
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
      const emailForVerification = localStorage.getItem("emailForVerification");
      const optRequest = localStorage.getItem("optRequest");
      if (emailForVerification && optRequest) {
        setLoading(true);
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}api/resetPassword`,
          { ...data, email: emailForVerification }
        );
        localStorage.removeItem("emailForVerification");
        localStorage.removeItem("optRequest");
        setLoading(false);
        navigate("/auth/login");
        toast.success(response.data.success, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error(`Something went wrong!`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message, {
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
              <h5 className="text-grey2 font-400 mb-3">
                Register your account
              </h5>
              <form onSubmit={handleSubmit(submitForm)}>
                <div className="form-group password-input mb-3">
                  <label htmlFor="" className="form-label font-500">
                    New Password
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
                </div>
                <div className="form-group password-input mb-3">
                  <label htmlFor="" className="form-label font-500">
                    Confirm Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="form-control"
                      {...register("confirmPassword")}
                    />
                    <span
                      onClick={() => setShowConfirm(!showConfirm)}
                      className={`pointer eye-icon fa-regular fa-eye${
                        showConfirm ? "-slash" : ""
                      }`}
                    ></span>
                  </div>
                  <span className="text-danger error">
                    {errors?.confirmPassword?.message || ""}
                  </span>
                </div>
                <div className="text-center">
                  <input
                    type="submit"
                    value="Confirm"
                    className="text-white border-0 rounded text-center mt-5 form-button"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPassword;
