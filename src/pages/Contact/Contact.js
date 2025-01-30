import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./contact.css";
import Picture from "../../assets/contact.png";
import { toast } from "react-toastify";

function Contact() {
  const [disabled, setDisabled] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Function to handle form submission
  const onSubmit = async (formData) => {
    setDisabled(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/sendContactMessage
`,
        formData
      );
      if (
        response?.data?.message == "Your message has been sent successfully!"
      ) {
        toast.success("Your message has been sent successfully!");
        reset();
      }
      setDisabled(false);
    } catch (err) {
      if (err.message == "Network Error") {
        toast.error("Check your internet connection");
      }
      setDisabled(false);
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-xl-5 mx-auto my-5">
      <div className="row">
        <div className="col-12 col-sm-6">
          <h3 className="m-0 p-0">Contact us</h3>
          <p className="text-grey p-0 m-0">Send us your query</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-5 col-lg-9">
              <label htmlFor="email" className="fw-medium">
                Email
              </label>
              <input
                type="text"
                className="form-control mt-2 py-2 shadow-none"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-danger small mt-1 error">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mt-3 col-lg-9">
              <label htmlFor="message" className="fw-medium">
                Message
              </label>
              <textarea
                className="form-control shadow-none"
                {...register("message", { required: "Enter your message" })}
                cols={45}
                rows={8}
              ></textarea>
              {errors.message && (
                <p className="text-danger small mt-1 error">
                  {errors.message.message}
                </p>
              )}
            </div>
            <button
              disabled={disabled}
              onClick={onSubmit}
              type="submit"
              className="btn mt-4 text-white py-2 checkout-btn send-btn send-btn-setting"
            >
              Send
            </button>
          </form>
        </div>
        <div className="d-none d-sm-block col-sm-6 d-flex justify-content-end">
          <div className="px-3 pt-2 pb-5 image-container h-100 d-flex align-items-center">
            <img src={Picture} alt="" className="img-fluid w-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
