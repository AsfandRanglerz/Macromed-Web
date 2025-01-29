import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Orders from "../../assets/orders.png";
import Clock from "../../assets/clock.png";
import Delivered from "../../assets/delivered.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Redux/userSlice";
import { toast } from "react-toastify";

function DashBoardContent() {
  const { token, userData } = useSelector((state) => {
    return state.user;
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/getOrderCount/${userData?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        if (err.response?.data?.error === "Unauthenticated.") {
          toast.error(
            "Your session has expired. Please log in again to continue."
          );
          dispatch(logoutUser());
          navigate("/");
        }
        if (err.message === "Network Error") {
          toast.error("Check your internet connection");
        }
      });
  }, []);

  return (
    <div
      style={{ height: "90%" }}
      className="bg-white row p-4 w-100 m-0 mt-3 mt-lg-5 rounded overflow-y-auto"
    >
      <div className="col-sm-4 mb-3 p-0 px-2">
        <div className="p-3 rounded blocks">
          <div className="bg-white d-flex align-items-center justify-content-center image-block">
            <img src={Orders} alt="" />
          </div>
          <div className="mt-0 mt-md-2 text-center">
            <h1 className="fw-bold">{data.total_orders || "0"}</h1>
            <p className="fw-medium">Total Orders</p>
          </div>
        </div>
      </div>
      <div className="col-sm-4 mb-3 p-0 px-2">
        <div className="p-3 rounded blocks">
          <div className="bg-white d-flex align-items-center justify-content-center image-block">
            <img src={Clock} alt="" />
          </div>
          <div className="mt-0 mt-md-2 text-center">
            <h1 className="fw-bold">{data.pending_orders || "0"}</h1>
            <p className="fw-medium">Pending Orders</p>
          </div>
        </div>
      </div>
      <div className="col-sm-4 p-0 px-2">
        <div className="p-3 rounded blocks">
          <div className="bg-white d-flex align-items-center justify-content-center image-block">
            <img src={Delivered} alt="" />
          </div>
          <div className="mt-0 mt-md-2 text-center">
            <h1 className="fw-bold">{data.delivered_orders || "0"}</h1>
            <p className="fw-medium">Delivered Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoardContent;
