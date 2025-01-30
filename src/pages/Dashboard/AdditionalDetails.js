import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import SelectRegion from "../CheckOut/SelectRegion";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdditionalDetails({ showModel, handleCloseModel }) {
  const [managerData, setManagerData] = useState([]);
  const [sameAddress, setSameAddress] = useState(false);
  const [data, setData] = useState({
    name: "",
    salesAgent: "",
    address: "",
    billingAddress: "",
    country: "PK,,Pakistan",
    state: "",
    city: "",
    paymentType: "",
    cardNumber: "",
    cardDate: "",
    cvc: "",
    total: "",
  });
  const [error, setError] = useState({
    name: "",
    address: "",
    billingAddress: "",
    country: "",
    state: "",
    city: "",
    paymentType: "",
    cardNumber: "",
    cardDate: "",
    cvc: "",
  });
  const inputRefs = {
    name: useRef(),
    address: useRef(),
    billingAddress: useRef(),
    country: useRef(),
    state: useRef(),
    city: useRef(),
    paymentType: useRef(),
    cardNumber: useRef(),
    cardDate: useRef(),
    cvc: useRef(),
    total: useRef(),
  };

  useEffect(() => {
    const managerApi = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}api/selesAgent`)
        .then((res) => {
          setManagerData(res?.data?.salesAgent);
        })
        .catch((err) => {
          if (err.message == "Network Error") {
            toast.error("Check your internet connection");
          }
        });
    };

    managerApi();
  }, []);

  const onChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // Clear error fields if "cash on delivery" is selected
    if (value === "cash on delivery") {
      setError((prevError) => ({
        ...prevError,
        cardNumber: "",
        cardDate: "",
        cvc: "",
      }));
    }

    // Clear error for the specific field
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Handle card number validation (only numbers and max 16 digits)
    if (name === "cardNumber") {
      // Only allow numbers and limit to 16 digits
      value = value.replace(/\D/g, "").slice(0, 16);
    }

    if (name === "cvc") {
      // Only allow numbers and limit to 16 digits
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    if (name === "cardDate") {
      // Remove any non-numeric characters
      value = value.replace(/\D/g, "");

      // Format as MM/YY
      if (value.length >= 3) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
    }

    // Handle payment type (convert to lowercase)
    if (name === "paymentType") {
      setData((prev) => ({
        ...prev,
        [name]: value.toLowerCase(),
      }));
    }

    // Set data for other fields
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (sameAddress == true) {
      setData((prev) => ({
        ...prev,
        billingAddress: prev.address,
      }));
    }
  }, [sameAddress, setSameAddress]);

  return (
    <Modal
      show={showModel}
      //   onHide={handleCloseModel}
      className={`relative form-modal details`}
      centered
    >
      <Modal.Body className="p-3">
        <div className="mt-4 mt-lg-0 py-3 px-lg-4">
          <h5 className="text-grey">Shipping Information</h5>
          <div className="mt-3">
            <label htmlFor="">Sale Manager/Member</label>
            <select
              name="salesAgent"
              className="form-select mt-2 input-field"
              value={data.salesAgent}
              onChange={onChange}
            >
              <option value="" disabled selected>
                Select
              </option>
              {managerData?.map((e, index) => {
                return (
                  <option key={index} value={e?.id}>
                    {e?.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mt-3">
            <label htmlFor="">Shipping address</label>
            <input
              onChange={onChange}
              value={data.name}
              ref={inputRefs.name}
              name="name"
              type="text"
              placeholder="Name"
              className="border-bottom-0 form-control mt-2 py-2 input-border input-field"
            />

            <SelectRegion
              ref={[inputRefs.country, inputRefs.state, inputRefs.city]}
              setError={setError}
              country={data?.country}
              state={data?.state}
              city={data?.city}
              names={["country", "state", "city"]}
              onChange={onChange}
            />
            <input
              onChange={onChange}
              value={data.address}
              ref={inputRefs.address}
              name="address"
              type="text"
              placeholder="Address"
              className="form-control py-2 input-border-last input-field"
            />
          </div>
          {(error.name !== "" ||
            error.country !== "" ||
            error.state !== "" ||
            error.city !== "" ||
            error.address !== "") && (
            <p className="text-danger small mt-1 error">
              {[
                error.name && "Name",
                error.country && "Country",
                error.state && "State",
                error.city && "City",
                error.address && "Address",
              ]
                .filter(Boolean) // Filters out any false/null values
                .join(", ")}{" "}
              {/* Joins valid fields with commas */}
              {[
                error.name,
                error.country,
                error.state,
                error.city,
                error.address,
              ].filter(Boolean).length > 1
                ? " are"
                : " is"}{" "}
              required
            </p>
          )}

          <div
            ref={inputRefs.paymentType}
            className="d-flex align-items-center gap-2 p-0 mt-3"
          >
            <input
              onChange={onChange}
              value="cash on delivery"
              type="radio"
              name="paymentType"
              id=""
              className="p-0 m-0"
            />
            <p className="p-0 m-0 text-grey">Cash on delivery</p>
          </div>
          <div className="d-flex align-items-center gap-2 p-0 mt-3">
            <input
              onChange={onChange}
              value="pay online"
              type="radio"
              name="paymentType"
              id=""
              className="p-0 m-0"
            />
            <p className="p-0 m-0 text-grey">Pay online</p>
          </div>
          {error.paymentType && (
            <p className="text-danger small mt-1 error">
              Payment method is required
            </p>
          )}

          {data?.paymentType == "pay online" && (
            <div>
              <h5 className="text-grey mt-3">Payment Details</h5>
              <div className="mt-3">
                <label htmlFor="">Card Information</label>
                <input
                  ref={inputRefs.cardNumber}
                  onChange={onChange}
                  value={data.cardNumber}
                  type="text"
                  name="cardNumber"
                  placeholder="1234 1234 1234 1234"
                  className="form-control mt-2 py-2 border-bottom-0 input-field input-border"
                />
                <div className="d-flex two-inputs">
                  <input
                    ref={inputRefs.cardDate}
                    onChange={onChange}
                    value={data.cardDate}
                    name="cardDate"
                    type="text"
                    placeholder="MM/YY"
                    className="form-control py-2 border-end-0 input-field-half"
                  />
                  <input
                    ref={inputRefs.cvc}
                    onChange={onChange}
                    value={data.cvc}
                    name="cvc"
                    type="text"
                    placeholder="CVC"
                    className="form-control py-2 rounded input-border-last input-field-half"
                  />
                </div>
              </div>
            </div>
          )}
          {(error.cardNumber !== "" ||
            error.cardDate !== "" ||
            error.cvc !== "") && (
            <p className="text-danger small mt-1 error">
              {[
                error.cardNumber && "Card number",
                error.cardDate && "Card date",
                error.cvc && "CVC",
              ]
                .filter(Boolean) // Removes any false or empty values
                .join(", ")}{" "}
              {/* Joins valid fields with commas */}
              {[error.cardNumber, error.cardDate, error.cvc].filter(Boolean)
                .length > 1
                ? " are"
                : " is"}{" "}
              required
            </p>
          )}

          <div className="d-flex gap-2 align-items-center mt-3">
            <input
              onChange={() => {
                setSameAddress(!sameAddress);
              }}
              type="checkbox"
              name="billingAddresSame"
              id=""
            />
            <p className="m-0 p-0">Billing address is same as shipping</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button onClick={() => {}} className="web-button">
            Place Order
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
