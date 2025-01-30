import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Product1 from "../../assets/product1.png";
import Action from "../../assets/action.png";
import Orders1 from "../../assets/orders.png";
import Clock from "../../assets/clock.png";
import Delivered from "../../assets/delivered.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Model from "./Model";
import { NotificationContext } from "../../Context/NotificationContext";

function Orders() {
  const { token, userData } = useSelector((state) => {
    return state.user;
  });
  const { getNotification } = useContext(NotificationContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const optionRef = useRef(null);
  const imageRef = useRef(null);
  const [product, setProduct] = useState([]);
  const [openOptionId, setOpenOptionId] = useState(null);
  const [isHiding, setIsHiding] = useState(false);
  const toggleOption = (id) => {
    if (isHiding) {
      setIsHiding(false);
      return;
    }

    setOpenOptionId((prev) => (prev === id ? null : id));
  };

  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef();
  const [height, setHeight] = useState("auto");
  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight - 6.5);
    }
  }, [data]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/getOrderDetail/${userData?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        getNotification();
        setData(res.data);
      })
      .catch((err) => {
        if (err?.response?.data?.message === "Unauthenticated.") {
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

  const handleClickOutside = (event) => {
    if (optionRef.current && !optionRef.current.contains(event.target)) {
      setOpenOptionId(null);
      setIsHiding(true); // Set the hiding flag to true
    }
  };

  useEffect(() => {
    if (openOptionId !== null) {
      setIsHiding(false); // Reset when opening an option
    }
  }, [openOptionId]);
  useEffect(() => {
    if (openOptionId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openOptionId]);

  return (
    <div className="bg-white row p-4 w-100 m-0 mt-3 mt-lg-5 rounded overflow-auto">
      <Model
        show={show}
        setShow={setShow}
        handleClose={handleClose}
        handleShow={handleShow}
        data={product}
      />
      <div className="col-sm-4 p-0 px-2  mb-4">
        <div className="p-3 rounded blocks">
          <div className="bg-white d-flex align-items-center justify-content-center image-block">
            <img src={Clock} alt="" />
          </div>
          <div className="mt-2 text-center">
            <h1 className="fw-bold">{data?.pending_orders || "0"}</h1>
            <p className="fw-medium">Pending Orders</p>
          </div>
        </div>
      </div>
      <div className="col-sm-4 p-0 px-2 mb-4">
        <div className="p-3 rounded blocks">
          <div className="bg-white d-flex align-items-center justify-content-center image-block">
            <img src={Orders1} alt="" />
          </div>
          <div className="mt-2 text-center">
            <h1 className="fw-bold">{data?.total_orders || "0"}</h1>
            <p className="fw-medium">Total Orders</p>
          </div>
        </div>
      </div>
      <div className="col-sm-4 p-0 px-2 mb-4">
        <div className="p-3 rounded blocks">
          <div className="bg-white d-flex align-items-center justify-content-center image-block">
            <img src={Delivered} alt="" />
          </div>
          <div className="mt-2 text-center">
            <h1 className="fw-bold">{data?.delivered_orders || "0"}</h1>
            <p className="fw-medium">Delivered Orders</p>
          </div>
        </div>
      </div>

      <div className="w-100 overflow-x-auto pb-3  table-container-dash">
        <table className="table-dash w-100">
          <tr className="table-header-dash">
            <th>
              <div className="white-space px-2 py-2">Order ID</div>
            </th>
            <th>
              <div className="white-space py-2 ps-2 pe-2 model-description-dash">
                Variants
              </div>
            </th>
            <th>
              <div className="white-space pe-5 py-2">Total Price</div>
            </th>
            <th>
              <div className="white-space pe-5 py-2">Payment Method</div>
            </th>
            <th>
              <div className="white-space pe-5 py-2">Status</div>
            </th>
            <th>
              <div className="white-space pe-5 py-2">Date</div>
            </th>
          </tr>
          {data?.order_details.length > 0 ? (
            data?.order_details?.map((e, index) => {
              // Create a comma-separated string of variant numbers
              const variantNumbers = e?.order_item
                ?.map((item) => item.variant_number)
                .join(", ");

              return (
                <React.Fragment key={index}>
                  <tr className="table-row">
                    <td>
                      <div
                        style={{
                          height: height === "auto" ? "auto" : height + "px",
                        }}
                        className="white-space d-flex small font-500 small px-2 align-items-center table-row-color"
                      >
                        <p
                          onClick={() => {
                            setProduct(e);
                            handleShow();
                            setOpenOptionId(null);
                          }}
                          className="mb-0 order-id pointer"
                        >
                          {e?.order_id}
                        </p>
                      </div>
                    </td>

                    <td ref={ref}>
                      <div className="d-flex align-items-center py-2 gap-3 model-description-dash position-relative ps-2 pe-2 table-row-color">
                        <p className="p-0 m-0 small">
                          {variantNumbers.length > 15
                            ? variantNumbers.slice(0, 15) + "..."
                            : variantNumbers}
                        </p>
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          height: height === "auto" ? "auto" : height + "px",
                        }}
                        className="white-space pe-5 small font-500 d-flex align-items-center table-row-color"
                      >
                        {e?.discounted_total != 0
                          ? Number(e?.discounted_total)?.toLocaleString(
                              "en-PK",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : Number(e?.total)?.toLocaleString("en-PK", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          height: height === "auto" ? "auto" : height + "px",
                        }}
                        className="text-capitalize white-space pe-5 small font-500 d-flex align-items-center table-row-color"
                      >
                        {e?.payment_type}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          height: height === "auto" ? "auto" : height + "px",
                        }}
                        className="text-capitalize white-space pe-5 small font-500 d-flex align-items-center table-row-color"
                      >
                        {e?.status}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          height: height === "auto" ? "auto" : height + "px",
                        }}
                        className="text-capitalize white-space pe-5 small font-500 d-flex align-items-center table-row-color"
                      >
                        {new Date(e?.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <div
              style={{ display: "table-caption" }}
              className="text-center mt-3 w-100"
            >
              <p className="text-grey2 small">No orders placed</p>
            </div>
          )}
        </table>
      </div>
    </div>
  );
}

export default Orders;
