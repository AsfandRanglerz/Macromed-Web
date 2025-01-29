import React, { useContext, useEffect, useRef, useState } from "react";
import "./checkout.css";
import { Link, useNavigate } from "react-router-dom";
import Picture from "../../assets/product1.png";
import SelectRegion from "./SelectRegion";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../Redux/cartSlices";
import { logoutUser } from "../../Redux/userSlice";
import { NotificationContext } from "../../Context/NotificationContext";
import QuoteModel from "./QuoteModel";

function Checkout() {
  const [managerData, setManagerData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [btnDisable, setBtnDisable] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [applyDisable, setApplyDisable] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [success, setSuccess] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [check, setCheck] = useState(false);
  const [show, setShow] = useState(false);
  const [product, setProduct] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { getNotification } = useContext(NotificationContext);

  const user = useSelector((state) => {
    return state.user;
  });

  const cart = useSelector((state) => {
    return state.cart[user.userData?.id] || [];
  });

  useEffect(() => {
    const total = cart.reduce((accumulator, product) => {
      const productTotal = product.variants.reduce((variantAcc, variant) => {
        return variantAcc + (variant.totalPrice || 0); // Add the total price of each variant
      }, 0);
      return accumulator + productTotal; // Add product total to the accumulator
    }, 0);

    setOriginalPrice(total);
  }, [cart]);

  const variantsArray = cart?.flatMap((product) =>
    product?.variants.map((variant) => ({
      id: product.id,
      total_discount: product.discount > 0 ? product.discount : 0.0,
      product_discount:
        product.productDiscount > 0 ? product.productDiscount : 0.0,
      brand_discount: product.brandDiscount > 0 ? product.brandDiscount : 0.0,
      category_discount:
        product.categoryDiscount > 0 ? product.categoryDiscount : 0.0,
      productName: product.productName,
      image: product.image,
      varaint_id: variant.variant_id,
      variant_number: variant.s_k_u,
      totalVaraiantprice:
        product.discount > 0
          ? Number(variant.selling_price_per_unit_pkr) *
            (1 - Number(product?.discount) / 100)
          : Number(variant.selling_price_per_unit_pkr),
      price: Number(variant.selling_price_per_unit_pkr),

      discounted_price:
        product.discount > 0
          ? (
              Number(variant.selling_price_per_unit_pkr) *
              (1 - Number(product?.discount) / 100)
            )
              .toFixed(2)
              ?.toLocaleString("en-PK")
          : 0,
      quantity: Number(variant.count),
    }))
  );

  useEffect(() => {
    const hasDiscount = variantsArray.some((e) => e?.total_discount > 0);
    setCheck(hasDiscount);
  }, [variantsArray]);

  useEffect(() => {
    const total = cart.reduce((accumulator, product) => {
      let productTotal = product.variants.reduce((variantAcc, variant) => {
        let variantPrice = variant.totalPrice || 0; // Default price if totalPrice is missing

        // Apply product discount if available
        if (product.discount > 0) {
          // Apply the discount to the variant price
          variantPrice -= (variantPrice * product.discount) / 100;
        }

        // Accumulate the discounted price of each variant
        return variantAcc + variantPrice;
      }, 0);

      // Add the discounted product total to the accumulator
      return accumulator + productTotal;
    }, 0);

    // Set the final total price after applying all discounts
    setTotalPrice(total);
  }, [cart]);

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
    // salesAgent: "",
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
    // salesAgent: useRef(),
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

    // If billing address is the same, copy the address
    // if (name === "billingAddresSame") {
    //   setData((prev) => ({
    //     ...prev,
    //     billingAddress: prev.address,
    //   }));
    // }

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

  const submitFrom = async () => {
    setBtnDisable(true);
    if (user.login == false) {
      toast.error("Login first to place your order");
      return;
    }

    const newErrors = {};
    let a = null;

    Object.keys(data).forEach((e) => {
      if (["cardNumber", "cardDate", "cvc"].includes(e)) {
        if (data.paymentType === "pay online") {
          if (data[e] === "" || !data[e]) {
            newErrors[e] = `${e} is required`;
            if (a === null) {
              a = e;
            }
          }
        }
      } else if (
        e !== "total" &&
        e !== "billingAddress" &&
        e !== "salesAgent" &&
        (data[e] === "" || !data[e])
      ) {
        newErrors[e] = `${e} is required`;
        if (a === null) {
          a = e;
        }
      }
    });

    if (a !== null && inputRefs[a]?.current) {
      inputRefs[a].current.focus();

      inputRefs[a].current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }

    setError((prev) => {
      return {
        ...prev,
        ...newErrors,
      };
    });

    const areAllErrorsEmpty = (obj) => {
      return Object.values(obj).every((value) => {
        if (typeof value === "object" && value !== null) {
          return areAllErrorsEmpty(value);
        }

        return value === "";
      });
    };

    if (areAllErrorsEmpty(newErrors)) {
      const formData = {
        user_id: user.userData?.id,
        sales_agent_id: data?.salesAgent,
        address: data?.address,
        billing_address: data?.billingAddress,
        country: data?.country.split(",,")[1],
        state: data?.state.split(",,")[1],
        city: data?.city,
        payment_type: data.paymentType,
        card_number: data.cardNumber,
        card_date: data.cardDate,
        cvc: data?.cvc,
        total: originalPrice,
        discounted_total: success
          ? totalPrice -
            (totalPrice * Number(success?.discount_percentage)) / 100
          : check
          ? Number(totalPrice)
          : 0.0,
        discounted_price: check ? Number(totalPrice) : 0.0,
        products: JSON.stringify(variantsArray),
        discount_code: couponCode,
      };
      setBtnDisable(false);

      await axios
        .post(process.env.REACT_APP_API_URL + "api/placeOrder", formData)
        .then((res) => {
          if (res.data.status == "success") {
            toast.success("Your order place successfully");
            getNotification();
            dispatch(clearCart({ userId: user.userData?.id }));
            navigate("/dashboard?tab=orders");
            setBtnDisable(false);
          }
        })
        .catch((err) => {
          if (err.response?.data?.message === "User is not authenticated") {
            toast.error("Your session has been expired");
            dispatch(logoutUser());
            navigate("/");
          }
          if (err.response?.data?.message === "Unauthenticated.") {
            toast.error("Your session has been expired");
            dispatch(logoutUser());
            navigate("/");
          }
          if (err.response?.data?.message === "Token is invalid or expired") {
            toast.error("Your session has been expired");
            dispatch(logoutUser());
            navigate("/");
          }
          if (
            err?.response?.data?.message &&
            err.response.data.message.includes("Insufficient")
          ) {
            toast.error(err?.response.data?.message);
          }
          if (err.message == "Network Error") {
            toast.error("Check your internet connection");
          }
          if (err.response?.data?.message) {
            toast.error(err.response?.data?.message);
          }
          setBtnDisable(false);
        });
    } else {
      setBtnDisable(false);
      return;
    }
  };

  const handleCoupon = async () => {
    setApplyDisable(true);
    if (user?.login == false) {
      toast.error("Login to get dsicount");
      setApplyDisable(false);
      return;
    }

    if (couponCode == null) {
      toast.error("Provide coupon to get discount");
      setApplyDisable(false);
      return;
    }

    const formData = {
      discount_code: couponCode,
    };

    await axios
      .post(`${process.env.REACT_APP_API_URL}api/couponCode`, formData)
      .then((res) => {
        if (res?.data?.data?.expiration_status == "active") {
          setSuccess(res?.data?.data);
          setApplyDisable(false);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          toast.error(err?.response?.data?.message);
          setApplyDisable(false);
        } else {
          toast.error("There is something went wrong!");
          setApplyDisable(false);
        }
      });
  };

  return (
    <>
      <QuoteModel
        show={show}
        setShow={setShow}
        handleClose={handleClose}
        handleShow={handleShow}
        data={cart}
        discount={success}
      />
      <div className="container-fluid px-3 px-md-4 px-xl-5 mx-auto my-5">
        <div className="row">
          <div className="col-12 col-lg-7">
            <Link to="/cart" className="text-decoration-none text-theme">
              <div className="d-flex align-items-center gap-2">
                <span className="fa-solid fa-arrow-left text-theme"></span>
                <p className="small fw-medium p-0 m-0">Back to Cart</p>
              </div>
            </Link>
            <h1 className="mt-3 text-grey fw-medium mb-3">
              {Number(totalPrice)?.toLocaleString("en-PK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h1>

            {variantsArray &&
              variantsArray.map((e) => {
                return (
                  <div className="d-flex justify-content-between gap-5 p-0 mb-4 checkout-products">
                    <div className="d-flex gap-3">
                      <img
                        src={process.env.REACT_APP_API_URL + e.image}
                        alt=""
                        className="checkout-image"
                      />
                      <div className="d-flex justify-content-between">
                        <div>
                          <Link
                            to={`/details/${e.id}`}
                            className="text-decoration-none"
                          >
                            <p className="fw-semibold text-wrap text-theme m-0">
                              {e.productName.length > 25
                                ? `${e.productName.slice(0, 25)}...`
                                : e.productName}
                            </p>
                          </Link>
                          <p className="p-0 mt-0 text-grey fw-medium m-0 model">
                            {e.variant_number}
                          </p>
                          <p className="p-0 mt-0 text-grey fw-medium p-0 m-0 quantity">
                            Qty {e.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="fw-medium text-grey text-nowrap">
                      {(
                        Number(e.quantity) * Number(e.totalVaraiantprice)
                      )?.toLocaleString("en-PK", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                );
              })}

            <div className="d-flex justify-content-lg-end checkout-products">
              <div className="mt-0 subtotal">
                <div className="d-flex justify-content-between pb-2 subtotal-border">
                  <p className="fw-medium text-grey">Subtotal</p>
                  <p className="fw-medium text-grey">
                    {totalPrice?.toLocaleString("en-PK", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="py-3 subtotal-border">
                  <div className="d-flex justify-content-between">
                    <p className="text-grey m-0 p-0">Shipping</p>
                    <p className="text-grey m-0 p-0">Rs 0</p>
                  </div>
                  <p className="text-grey m-0 p-0">
                    Ground shipping (3-5 business days)
                  </p>
                </div>
                <div className="d-flex justify-content-between pt-3">
                  <p className="fw-medium text-grey">Total due</p>
                  <p className="fw-medium text-grey">
                    {totalPrice?.toLocaleString("en-PK", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <div className="mt-4 mt-lg-0 py-3 px-lg-4 info-form">
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
                      className="form-control mt-2 py-2 border-bottom-0 input-border input-field"
                    />
                    <div className="d-flex two-inputs">
                      <input
                        ref={inputRefs.cardDate}
                        onChange={onChange}
                        value={data.cardDate}
                        name="cardDate"
                        type="text"
                        placeholder="MM/YY"
                        className="form-control py-2 col-6 border-end-0 input-field-half"
                      />
                      <input
                        ref={inputRefs.cvc}
                        onChange={onChange}
                        value={data.cvc}
                        name="cvc"
                        type="text"
                        placeholder="CVC"
                        className="form-control py-2 col-6 rounded input-border-last input-field-half"
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
              <div className="border-top mt-5 coupon-section">
                <div className="row m-0 py-3">
                  <div className="col-8 p-0">
                    <input
                      className="w-100 h-100 form-control py-2 coupon-input shadow-none"
                      type="text"
                      name="couponCode"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                      }}
                      id=""
                      placeholder="Discount Code"
                    />
                  </div>
                  <div className="col-4 p-0">
                    <button
                      disabled={applyDisable}
                      onClick={handleCoupon}
                      className="btn w-100 h-100 py-2 text-white pay-btn coupon-btn"
                    >
                      Apply
                    </button>
                  </div>
                  {success && (
                    <p className="text-success p-0 m-0 small mt-1 error">
                      {success?.discount_percentage}% discount is applied on
                      your bill
                    </p>
                  )}
                  {/* <p
                    onClick={() => {
                      setProduct(cart);
                      handleShow();
                    }}
                    className="mt-2 mb-0 p-0 pointer quote-link"
                  >
                    Get a quote
                  </p> */}
                </div>
              </div>
              <button
                disabled={btnDisable || totalPrice == 0}
                onClick={submitFrom}
                className="btn py-2 mt-3 text-white pay-btn"
              >
                Place Order{" "}
                {success ? (
                  <span>
                    <span className="ms-1 text-decoration-line-through">
                      {totalPrice?.toLocaleString("en-PK", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="ms-2">
                      {(
                        totalPrice -
                        (totalPrice * Number(success?.discount_percentage)) /
                          100
                      )?.toLocaleString("en-PK", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </span>
                ) : (
                  totalPrice?.toLocaleString("en-PK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
