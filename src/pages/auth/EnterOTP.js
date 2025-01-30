import React, { useState } from "react";
import "./Auth.css";
import AuthLogo from "./AuthLogo";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import AuthLoading from "./AuthLoading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EnterOTP() {
  const navigate = useNavigate();

  const schema = yup.object().shape({
    otp: yup
      .string()
      .min(4, "OTP should have four numbers")
      .required("*OTP is required")
      .matches(/^\d+$/, "*OTP must be a number"),
  });

  const [loading, setLoding] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitForm = async (data) => {
    try {
      setLoding(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/verifyOtp`,
        data
      );

      localStorage.setItem("optRequest", true);
      setLoding(false);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/auth/new-password");
    } catch (error) {
      setLoding(false);
      toast.error(error.response.data.error, {
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
              <h5 className="text-grey2 font-400 mb-3">Enter OTP</h5>
              <form onSubmit={handleSubmit(submitForm)}>
                <div className="form-group mb-3">
                  <label htmlFor="" className="form-label font-500">
                    OTP
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("otp")}
                  />
                  <span className="text-danger error">
                    {errors?.otp?.message || ""}
                  </span>
                </div>

                <div className="text-center pt-5">
                  <input
                    type="submit"
                    value="Send OTP"
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

export default EnterOTP;
