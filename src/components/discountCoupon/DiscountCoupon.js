import React, { useEffect, useState } from "react";
import "./coupon.css";
import ticket from "../../assets/tickets.png";
import axios from "axios";
import { toast } from "react-toastify";

function DiscountCoupon() {
  const [data, setData] = useState(null);

  const copyCode = () => {
    navigator.clipboard.writeText(data?.discount_code || "");
    toast.success("Code copied to clipboard!");
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/orderDiscount`)
      .then((res) => {
        setData(res?.data?.discountCodes?.[0]);
      })
      .catch((err) => {});
  }, []);
  return (
    data?.status == "1" && (
      <div onClick={copyCode} className="mt-3 row w-100 m-0 pointer coupon">
        <div className="col-7 py-3 d-flex flex-column align-items-center justify-content-between text-theme text-center px-3">
          <p className="p-0 m-0">{data?.discount_message.toUpperCase()}</p>
          <h1 className="p-0 m-0 fw-light">
            {data?.discount_percentage.split(".")[0]}%
          </h1>
          <h1 className="p-0 m-0 fw-light">OFF</h1>
          <p style={{ fontSize: "0.6rem" }} className="p-0 m-0">
            Enjoy a {data?.discount_percentage.split(".")[0]}% discount by using
            this code at checkout!
          </p>
        </div>
        <div className="col-5 py-3 d-flex flex-column align-items-center justify-content-center text-white text-center px-3 right-side">
          <h3 className="p-0 m-0 fw-light">SUPER</h3>
          <h3 className="p-0 m-0 fw-light">SALE</h3>
          <img src={ticket} alt="" className="w-100 my-2" />
          <p style={{ fontSize: "0.7rem" }} className="p-0 m-0 text-nowrap">
            CODE: {data?.discount_code}
          </p>
        </div>
      </div>
    )
  );
}

export default DiscountCoupon;
