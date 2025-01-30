import React, { useEffect, useRef, useState } from "react";
import ImageUploader from "./ImageUploader";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginUser, logoutUser } from "../../Redux/userSlice";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const state = useSelector((state) => {
    return state.user;
  });
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileBtnDisable, setProfileBtnDisable] = useState(false);
  const [passwordBtnDisable, setPasswordBtnDisable] = useState(false);
  const [forget, setForget] = useState(false);
  const [showImage, setShowImage] = useState(state?.userData?.image || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [userData, setUserData] = useState({
    email: state?.userData?.email || "",
    image: image || null,
    name: state?.userData?.name || "",
    phone: state?.userData?.phone || "",
    location: state?.userData?.location || "",
    profession: state?.userData?.profession || "",
    old_password: "",
    password: "",
    confirmPassword: "",
    country: state?.userData?.country?.replace(",", ",,") || "",
    state: state?.userData?.state?.replace(",", ",,") || "",
    city: state?.userData?.city || "",
    work_space_name: state?.userData?.work_space_name || "",
    work_space_email: state?.userData?.work_space_email || "",
    work_space_address: state?.userData?.work_space_address || "",
    work_space_number: state?.userData?.work_space_number || "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("https://api.countrystatecity.in/v1/countries", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSCAPI-KEY":
          "TExJVmdYa1pFcWFsRWViS0c3dDRRdTdFV3hnWXJveFhQaHoyWVo3Mw==",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // Check if userData.country exists and matches an entry in the result
        let obj = result.find((e) => {
          return e.name === userData.country.split(",,")[1];
        });

        if (obj) {
          updateCountry(
            {
              target: {
                value: `${obj.iso2},,${userData.country.split(",,")[1]}`,
                name: "country",
              },
            },
            false
          );
        }

        setCountries(result);
      })
      .catch((err) => {});
  }, []);

  function updateCountry(e, flag = true) {
    const { name, value } = e.target;
    changer(e);
    setError((prev) => ({ ...prev, [name]: "" }));

    changer({
      target: {
        name: "country" ? "state" : "nativeState",
        value: "",
      },
    });

    const countryCode = value.split(",,")[0];
    fetch(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSCAPI-KEY":
            "TExJVmdYa1pFcWFsRWViS0c3dDRRdTdFV3hnWXJveFhQaHoyWVo3Mw==",
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setStates(result);
        if (userData.state) {
          let stateObject = result.find((e) => {
            return e.name === userData.state.split(",,")[1];
          });
          if (stateObject) {
            updateState(
              {
                target: {
                  value: stateObject?.iso2 + ",," + stateObject.name,
                  name: "state",
                },
              },
              countryCode
            );
          }
        }
      });
  }

  function updateState(e, code) {
    const { name, value } = e.target;
    changer(e);
    setError((prev) => ({ ...prev, [name]: "" }));
    if (!code) {
      changer({
        target: { name: name === "state" ? "city" : "nativeCity", value: "" },
      });
    }

    const stateCode = value.split(",,")[0];
    const countryCode = code ? code : userData.country.split(",,")[0];

    fetch(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSCAPI-KEY":
            "TExJVmdYa1pFcWFsRWViS0c3dDRRdTdFV3hnWXJveFhQaHoyWVo3Mw==",
        },
      }
    )
      .then((response) => response.json())
      .then((result) => setCities(result));
  }

  const [error, setError] = useState({
    image: "",
    name: "",
    phone: "",
    location: "",
    profession: "",
    old_password: "",
    password: "",
    confirmPassword: "",
  });

  const inputRefs = {
    name: useRef(),
    phone: useRef(),
    location: useRef(),
    profession: useRef(),
    old_password: useRef(),
    password: useRef(),
    confirmPassword: useRef(),
  };

  const changer = (e) => {
    const name = e.target.name;
    let value = e.target?.value;
    const file = e.target.files?.[0];

    if (name == "image") {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setImage(file);
    }

    if (name === "phone") {
      // Only allow numbers
      value = value.replace(/\D/g, "");
    }

    if (name === "work_space_email") {
      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setError((prev) => ({ ...prev, [name]: "Invalid email format" }));
      } else {
        setError((prev) => ({ ...prev, [name]: "" }));
      }
    }

    if (value !== "") {
      setError((prev) => {
        return { ...prev, [name]: "" };
      });
    } else {
      setError((prev) => {
        return { ...prev, [name]: "required" };
      });
    }

    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitData = async () => {
    setProfileBtnDisable(true);
    let a = null;

    // Validation for empty fields except image
    Object.keys(userData).forEach((e) => {
      if (
        e !== "old_password" &&
        e !== "password" &&
        e !== "confirmPassword" &&
        e !== "work_space_email" &&
        e !== "work_space_name" &&
        e !== "work_space_number" &&
        e !== "work_space_address" &&
        e !== "country" &&
        e !== "state" &&
        e !== "city"
      ) {
        if (e == "image") {
          return;
        }

        if (userData[e] == "" || !userData[e]) {
          setError((prev) => ({ ...prev, [e]: "required" }));

          if (a == null) {
            a = e;
          }
          setProfileBtnDisable(false);
        }
      }
    });

    // Focus on the first field with an error
    if (a) {
      inputRefs[a].current.focus();
      inputRefs[a].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const hasErrors = Object.keys(error).some((e) => error[e] !== "");

    if (hasErrors === false) {
      // Create a FormData object to handle the image and other data
      const formData = new FormData();

      // Append all user data to the FormData object
      Object.keys(userData).forEach((key) => {
        if (key === "image" && image) {
          formData.append("image", image); // Append image file
        } else if (key == "country") {
          const country = userData[key]?.replace(",,", ",");
          formData.append(key, country);
        } else if (key == "state") {
          const state = userData[key]?.replace(",,", ",");
          formData.append(key, state);
        } else if (
          key !== "old_password" &&
          key !== "password" &&
          key !== "confirmPassword"
        ) {
          formData.append(key, userData[key]); // Append other fields, except passwords
        }
      });

      try {
        const res = await axios.post(
          process.env.REACT_APP_API_URL + `api/user/${state?.userData?.id}`,
          formData, // Send the FormData
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
              "Content-Type": "multipart/form-data", // Ensure correct headers
            },
          }
        );
        if (res.data.success === "User updated successfully") {
          toast.success("User updated successfully");
          dispatch(
            loginUser({
              token: state.token,
              userData: res?.data?.data,
            })
          );
        }

        setProfileBtnDisable(false);
      } catch (err) {
        if (err.response?.data?.message === "Unauthenticated.") {
          toast.error(
            "Your session has expired. Please log in again to continue."
          );
          dispatch(logoutUser());
          navigate("/");
        }

        if (err.message === "Network Error") {
          toast.error("Check your internet connection");
        }

        setProfileBtnDisable(false);
      }
    }
  };

  const changePassword = async () => {
    if (userData.confirmPassword != userData.password) {
      toast.error("Password and confirm password should be same!");
      return;
    }

    setPasswordBtnDisable(true);
    let a = null;

    Object.keys(userData).forEach((e) => {
      if (e === "old_password" || e === "password" || e === "confirmPassword") {
        if (userData[e] == "" || !userData[e]) {
          setError((prev) => ({ ...prev, [e]: "required" }));

          if (a == null) {
            a = e;
          }
          setPasswordBtnDisable(false);
        }
      }
    });

    if (a) {
      inputRefs[a].current.focus();
      inputRefs[a].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const hasErrors = Object.keys(error).some((e) => error[e] !== "");

    if (hasErrors) {
      setPasswordBtnDisable(false);
      return;
    }

    const formData = new FormData();

    Object.keys(userData).forEach((key) => {
      if (key === "old_password" || key === "password") {
        formData.append(key, userData[key]);
      }
    });

    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL +
          `api/updatePassword/${state?.userData?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "multipart/form-data", // Ensure correct headers
          },
        }
      );
      if (res.data.success === "Password updated successfully") {
        toast.success("Password updated successfully");
        setUserData((prev) => ({
          ...prev,
          old_password: "",
          password: "",
          confirmPassword: "",
        }));
      }

      setPasswordBtnDisable(false);
    } catch (err) {
      if (
        err.response.data.error ==
        "New password cannot be the same as the old password"
      ) {
        toast.error("New password cannot be the same as the old password");
        setPasswordBtnDisable(false);
        setForget(true);
      }
      if (err.response.data.error == "Old password is incorrect") {
        toast.error("Old password is incorrect");
        setPasswordBtnDisable(false);
        setForget(true);
      }
      if (err.response?.data?.error == "Unauthenticated.") {
        toast.error(
          "Your session has expired. Please log in again to continue."
        );
        dispatch(logoutUser());
        navigate("/");
      }
      if (err.message === "Network Error") {
        toast.error("Check your internet connection");
      }

      setPasswordBtnDisable(false);
    }
  };

  return (
    <div className="bg-white row px-5 py-4 w-100 m-0 mt-3 mt-lg-5 mb-3 rounded">
      <ImageUploader
        image={image}
        changer={changer}
        preview={preview}
        showImage={showImage}
      />
      <div className="p-0">
        <h3 className="mt-3 fw-bold p-0">{state?.userData?.name}</h3>
        <p className="p-0 m-0 text-grey2">{state?.userData?.email}</p>
      </div>
      <div className="row mt-3">
        <div className="col-sm-6 pe-sm-4 p-0">
          <div className="d-flex flex-column gap-2 mb-4">
            <label htmlFor="" className="fw-medium text-nowrap">
              Customer Name
            </label>
            <input
              type="text"
              name="name"
              value={userData.name}
              ref={inputRefs.name}
              onChange={changer}
              placeholder="John Doe"
              className="form-control py-2 px-3 border-0 input-color"
            />
            {error.name && (
              <p style={{ fontSize: "0.7rem" }} className="text-danger p-0 m-0">
                Name is required
              </p>
            )}
          </div>
          <div className="d-flex flex-column gap-2 mb-4">
            <label htmlFor="" className="fw-medium">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={userData.email}
              placeholder="example@gmail.com"
              className="form-control py-2 px-3 border-0 input-color"
              readOnly
            />
          </div>
          <div className="d-flex flex-column gap-2 mb-4">
            <label htmlFor="" className="fw-medium">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={userData.phone}
              ref={inputRefs.phone}
              onChange={changer}
              placeholder="0300000000"
              className="form-control py-2 px-3 border-0 input-color"
            />
            {error.phone && (
              <p style={{ fontSize: "0.7rem" }} className="text-danger p-0 m-0">
                Phone number is required and should be numeric
              </p>
            )}
          </div>
        </div>
        <div className="col-sm-6 ps-sm-4 p-0">
          <div className="d-flex flex-column gap-2 mb-4">
            <label htmlFor="" className="fw-medium">
              Profession
            </label>
            <input
              type="text"
              name="profession"
              value={userData.profession}
              ref={inputRefs.profession}
              onChange={changer}
              placeholder="i.e (Doctor, Surgen)"
              className="form-control py-2 px-3 border-0 input-color"
            />
            {error.profession && (
              <p style={{ fontSize: "0.7rem" }} className="text-danger p-0 m-0">
                Profession is required
              </p>
            )}
          </div>
          <div className="d-flex flex-column gap-2 mb-4">
            <label htmlFor="" className="fw-medium">
              Address
            </label>
            <input
              type="text"
              name="location"
              value={userData.location}
              ref={inputRefs.location}
              onChange={changer}
              placeholder="Your Address"
              className="form-control py-2 px-3 border-0 input-color"
            />
            {error.location && (
              <p style={{ fontSize: "0.7rem" }} className="text-danger p-0 m-0">
                Address is required
              </p>
            )}
          </div>
        </div>

        <h4 className="fw-bold p-0 mt-0 mx-0 my-4">Workplace Info</h4>
        <div>
          <div className="row">
            <div className="col-sm-6 pe-sm-4 p-0">
              <div className="d-flex flex-column gap-2 mb-4">
                <label htmlFor="" className="fw-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="work_space_name"
                  value={userData.work_space_name}
                  onChange={changer}
                  placeholder="Workplace Name"
                  className="form-control py-2 px-3 border-0 input-color"
                />
              </div>
              <div className="d-flex flex-column gap-2 mb-4">
                <label htmlFor="" className="fw-medium">
                  Email
                </label>
                <input
                  type="text"
                  name="work_space_email"
                  value={userData.work_space_email}
                  onChange={changer}
                  placeholder="workplace@gmail.com"
                  className="form-control py-2 px-3 border-0 input-color"
                />
                {error.work_space_email && (
                  <p
                    style={{ fontSize: "0.7rem" }}
                    className="text-danger p-0 m-0"
                  >
                    {error.work_space_email}
                  </p>
                )}
              </div>
              <div className="d-flex flex-column gap-2 mb-4">
                <label htmlFor="" className="fw-medium">
                  Phone
                </label>
                <input
                  type="text"
                  name="work_space_number"
                  value={userData.work_space_number}
                  onChange={changer}
                  placeholder="0300000000"
                  className="form-control py-2 px-3 border-0 input-color"
                />
              </div>
              <div className="d-flex flex-column gap-2 mb-4">
                <label htmlFor="" className="fw-medium">
                  Address
                </label>
                <input
                  type="text"
                  name="work_space_address"
                  value={userData.work_space_address}
                  onChange={changer}
                  placeholder="Workplace Address"
                  className="form-control py-2 px-3 border-0 input-color"
                />
              </div>
            </div>
            <div className="col-sm-6 ps-sm-4 p-0">
              <div className="d-flex flex-column gap-2 mb-4">
                <label htmlFor="" className="fw-medium">
                  Country
                </label>
                <select
                  className="border-0 form-select py-2 input-color"
                  value={userData.country}
                  onChange={updateCountry}
                  name="country"
                >
                  <option value="" disabled selected>
                    Select Country
                  </option>
                  {countries.map((country, index) => (
                    <option
                      value={`${country.iso2},,${country.name}`}
                      key={index}
                    >
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-2 mb-4">
                <label htmlFor="" className="fw-medium">
                  State
                </label>

                <select
                  className="border-0 form-select py-2 input-color"
                  value={userData.state}
                  name="state"
                  onChange={updateState}
                >
                  <option value="" disabled selected>
                    Select State
                  </option>
                  {states?.length ? (
                    states?.map((state, index) => (
                      <option
                        value={state.iso2 + ",," + state.name}
                        key={index}
                      >
                        {state.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Select State
                    </option>
                  )}
                </select>
              </div>
              <div className="d-flex flex-column gap-2 mb-4">
                <label htmlFor="" className="fw-medium">
                  City
                </label>

                <select
                  className="border-0 form-select py-2 input-color"
                  value={userData.city}
                  name="city"
                  onChange={changer}
                >
                  <option value="" disabled selected>
                    Select City
                  </option>
                  {cities.length ? (
                    cities.map((city, index) => (
                      <option key={index} value={city.name}>
                        {city.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Cities Available
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          disabled={profileBtnDisable}
          onClick={submitData}
          className="text-white py-2 px-5 btn save-btn w-auto"
        >
          Update Profile
        </button>
      </div>
      <div className="mt-4 ">
        <h4 className="fw-bold p-0 mt-0 mx-0 mb-4">Change Password</h4>
        <div className="col-sm-6 ">
          <div className="d-flex flex-column pe-sm-4 gap-2 mb-4">
            <label htmlFor="" className="fw-medium">
              Current Password
            </label>
            <div className="position-relative">
              <input
                placeholder="*************"
                onChange={changer}
                value={userData.old_password}
                name="old_password"
                ref={inputRefs.old_password}
                type={showCurrentPassword ? "text" : "password"}
                className="py-2 px-3 border-0 input-color form-control"
              />
              <span
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className={`pointer eye-icon text-grey2 fa-regular fa-eye${
                  showCurrentPassword ? "-slash" : ""
                }`}
              ></span>
            </div>
            {error.old_password && (
              <p style={{ fontSize: "0.7rem" }} className="text-danger p-0 m-0">
                Current Password is required
              </p>
            )}
            {forget && (
              <Link to="/auth/forgot-password" className="text-decoration-none">
                <p style={{ fontSize: "0.8rem" }} className="p-0 m-0">
                  Forgot Password?
                </p>
              </Link>
            )}
          </div>
          <div className="d-flex flex-column pe-sm-4 gap-2 mb-4">
            <label htmlFor="" className="fw-medium">
              New Password
            </label>
            <div className="position-relative">
              <input
                placeholder="*************"
                value={userData.password}
                name="password"
                ref={inputRefs.password}
                onChange={changer}
                type={showNewPassword ? "text" : "password"}
                className="py-2 px-3 border-0 input-color form-control"
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={`pointer eye-icon text-grey2 fa-regular fa-eye${
                  showNewPassword ? "-slash" : ""
                }`}
              ></span>
            </div>
            {error.password && (
              <p style={{ fontSize: "0.7rem" }} className="text-danger p-0 m-0">
                New Password is required
              </p>
            )}
          </div>
          <div className="d-flex flex-column pe-sm-4 gap-2 mb-4">
            <label htmlFor="" className="fw-medium">
              Confirm Password
            </label>
            <div className="position-relative">
              <input
                placeholder="*************"
                value={userData.confirmPassword}
                name="confirmPassword"
                ref={inputRefs.confirmPassword}
                onChange={changer}
                type={showConfirmPassword ? "text" : "password"}
                className="py-2 px-3 border-0 input-color form-control"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`pointer eye-icon text-grey2 fa-regular fa-eye${
                  showConfirmPassword ? "-slash" : ""
                }`}
              ></span>
            </div>
            {error.confirmPassword && (
              <p style={{ fontSize: "0.7rem" }} className="text-danger p-0 m-0">
                Confirm Password is required
              </p>
            )}
          </div>

          <button
            disabled={passwordBtnDisable}
            onClick={changePassword}
            className="text-white py-2 px-5 btn save-btn w-auto"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
