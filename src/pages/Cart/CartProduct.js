import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decreaseCounter,
  increaseCounter,
  removeFromCart,
} from "../../Redux/cartSlices";
import { Link } from "react-router-dom";

function CartProduct({ cart, userId }) {
  const dispatch = useDispatch();
  return (
    <>
      {cart?.length > 0
        ? cart?.map((e) => {
            return (
              <div key={e.id} className="mb-5">
                <div className="d-flex flex-nowrap mt-3 gap-4 product-detail-name">
                  <img
                    src={process.env.REACT_APP_API_URL + e?.image}
                    alt=""
                    className="rounded-2 img-fluid product-image"
                  />
                  <Link
                    to={`/details/${e?.id}`}
                    className="text-decoration-none"
                  >
                    <h6 className="fw-semibold text-wrap text-theme">
                      {e.productName}
                    </h6>
                    {e.discount > 0 && (
                      <span
                        style={{
                          background: "rgba(13, 110, 253, 0.1)",
                          fontSize: "0.7rem",
                          backdropFilter: "blur(25px)",
                        }}
                        className="mt-2 text-theme py-1 px-2 rounded"
                      >
                        -{e?.discount}% off
                      </span>
                    )}
                  </Link>
                </div>
                {e.variants.map((v, index) => {
                  return (
                    <div key={index}>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="col-5 col-lg-4">
                          <div className="d-flex pe-md-0 pe-xl-4 align-items-center justify-lg-content-between gap-5">
                            <p className="fw-semibold mb-0">{v.s_k_u}</p>
                            <p
                              onClick={() => {
                                dispatch(
                                  removeFromCart({
                                    userId,
                                    id: e.id,
                                    s_k_u: v.s_k_u,
                                  })
                                );
                              }}
                              className="fw-medium mb-0 remove-btn ms-2 me-lg-0 ms-5 border-bottom-0 pointer"
                            >
                              Remove Item
                            </p>
                          </div>
                        </div>
                        <div className="col-7 d-flex justify-content-between align-items-center">
                          <div className="d-flex col-4 justify-content-center gap-3">
                            <button
                              onClick={() => {
                                dispatch(
                                  decreaseCounter({
                                    userId,
                                    id: e.id,
                                    s_k_u: v.s_k_u,
                                  })
                                );
                              }}
                              disabled={v.count == 1}
                              className="px-2 rounded border-0 sign-bg"
                            >
                              -
                            </button>
                            <span>{v.count}</span>
                            <button
                              disabled={v.count == v.remaining_quantity}
                              onClick={() => {
                                dispatch(
                                  increaseCounter({
                                    userId,
                                    id: e.id,
                                    s_k_u: v.s_k_u,
                                  })
                                );
                              }}
                              className="px-2 rounded border-0 sign-bg"
                            >
                              +
                            </button>
                          </div>
                          {e?.discount > 0 ? (
                            <div className="col-4 text-center">
                              <p className="fw-semibold mb-0 small text-grey text-decoration-line-through">
                                {v.selling_price_per_unit_pkr?.toLocaleString(
                                  "en-PK",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>
                              <p className="p-0 m-0">
                                {(
                                  v.selling_price_per_unit_pkr *
                                  (1 - e.discount / 100)
                                )?.toLocaleString("en-PK", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          ) : (
                            <div className="col-4 text-center">
                              <p className="fw-semibold mb-0">
                                {v.selling_price_per_unit_pkr?.toLocaleString(
                                  "en-PK",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>
                            </div>
                          )}
                          {e.discount > 0 ? (
                            <div className="col-4 text-center">
                              <p className="fw-semibold mb-0 small text-grey text-decoration-line-through">
                                {v.totalPrice?.toLocaleString("en-PK", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                              <p className="p-0 m-0">
                                {(
                                  v.totalPrice *
                                  (1 - e.discount / 100)
                                )?.toLocaleString("en-PK", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          ) : (
                            <div className="col-4 text-center">
                              <p className="fw-semibold mb-0">
                                {v.totalPrice?.toLocaleString("en-PK", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        : ""}
    </>
  );
}

export default CartProduct;
