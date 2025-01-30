import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";

export default function Model({ show, handleClose, data }) {
  const dateString = data?.created_at;
  const date = new Date(dateString);
  const formattedDate = date?.toLocaleDateString("en-GB");
  const ref = useRef();
  const [height, setHeight] = useState("auto");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    data?.order_item?.forEach((e) => {
      setTotalPrice(
        (prev) =>
          prev + (e?.subtotal > 0 ? Number(e?.subtotal) : Number(e?.price))
      );
    });
  }, [data, show]);

  useEffect(() => {
    if (show == false) {
      setTotalPrice(0);
    }
  }, [show, handleClose]);

  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight - 6.5);
    }
  }, [data]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className={`relative form-modal`}
      centered
    >
      <span
        onClick={handleClose}
        style={{ top: "-10px", right: "-25px", fontSize: "1.3rem" }}
        className="fa-solid fa-xmark text-white pointer position-absolute"
      ></span>
      <Modal.Body className="p-3">
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <h4>Order Detail</h4>
            <p className="text-grey">Order Id: {data?.order_id}</p>
          </div>
          <div className="row justify-content-between mt-4">
            <div className="col-5 col-lg-3">
              <h6 className="text-grey">Billed To:</h6>
              {data?.billing_address ? (
                <p className="text-grey2 small">{data.billing_address}</p>
              ) : (
                <p className="text-danger small">No billing Address</p>
              )}
            </div>
            <div className="col-5 col-lg-3 text-end">
              <h6 className="text-grey mb-3">Shipped To:</h6>
              <p className="text-grey2 small">{data?.address}</p>
            </div>
          </div>
          <div className="row justify-content-between mt-4">
            <div className="col-5 col-lg-3">
              <h6 className="text-grey">Payment Method:</h6>
              <p className="text-grey2 small text-nowrap p-0 m-0">
                {data?.payment_type} ending ****
                {data.card_number?.slice(12, 16)}
              </p>
              <p className="text-grey2 small p-0 m-0 make-text-wrap">
                {data?.users?.email}
              </p>
            </div>
            <div className="col-5 col-lg-3 text-end">
              <h6 className="text-grey mb-3">Order Date:</h6>
              <p className="text-grey2 small">{formattedDate}</p>
            </div>
          </div>
        </div>
        <div className="w-100 overflow-x-auto table-container-dash mt-4">
          <table className="table-dash w-100">
            <thead>
              <tr className="table-header-dash">
                <th>
                  <div className="white-space px-2 py-2">#</div>
                </th>
                <th>
                  <div className="px-3 px-lg-0 py-2 text-center white-space model-description-dash">
                    Item
                  </div>
                </th>
                <th>
                  <div className="px-3 px-lg-0 py-2 text-center white-space">
                    Product Name
                  </div>
                </th>
                <th>
                  <div className="px-3 px-lg-0 py-2 text-center white-space">
                    Price
                  </div>
                </th>
                <th>
                  <div className="px-3 px-lg-0 py-2 text-center white-space">
                    Quantity
                  </div>
                </th>
                <th>
                  <div className="px-3 px-lg-0 py-2 text-center white-space">
                    Category Disc.
                  </div>
                </th>
                <th>
                  <div className="px-3 px-lg-0 py-2 text-center white-space">
                    Brand Disc.
                  </div>
                </th>
                <th>
                  <div className="px-3 px-lg-0 py-2 text-center white-space">
                    Product Disc.
                  </div>
                </th>
                <th>
                  <div className="px-3 px-lg-0 py-2 text-center white-space">
                    Total Disc.
                  </div>
                </th>
                <th>
                  <div className="px-3 px-lg-0 py-2 text-center white-space">
                    Total
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.order_item?.length > 0
                ? data?.order_item.map((e, index) => {
                    return (
                      <tr className="table-row">
                        <td>
                          <div
                            style={{
                              height:
                                height === "auto" ? "auto" : height + "px",
                            }}
                            className="white-space d-flex small font-500 small px-2 align-items-center table-row-color"
                          >
                            {index + 1}
                          </div>
                        </td>

                        <td ref={ref}>
                          <div className="d-flex justify-content-center align-items-center gap-3 model-description-dash position-relative py-1 table-row-color">
                            <p className="p-0 m-0 text-center small">
                              {e?.variant_number}
                            </p>
                          </div>
                        </td>

                        <td>
                          <div
                            style={{
                              height:
                                height === "auto" ? "auto" : height + "px",
                            }}
                            className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color"
                          >
                            <a
                              title={e?.product_variant?.products?.product_name}
                              className="model-product-name"
                              target="_blank"
                              href={`/details/${e?.product_variant?.products?.id}`}
                            >
                              <p className="mb-0">
                                {e?.product_variant?.products?.product_name?.slice(
                                  0,
                                  12
                                ) + "..."}
                              </p>
                            </a>
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              height:
                                height === "auto" ? "auto" : height + "px",
                            }}
                            className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color"
                          >
                            {Number(e?.price)?.toLocaleString("en-PK", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              height:
                                height === "auto" ? "auto" : height + "px",
                            }}
                            className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color"
                          >
                            {e?.quantity}
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              height:
                                height === "auto" ? "auto" : height + "px",
                            }}
                            className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color"
                          >
                            {e?.category_discount}%
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              height:
                                height === "auto" ? "auto" : height + "px",
                            }}
                            className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color"
                          >
                            {e?.brand_discount}%
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              height:
                                height === "auto" ? "auto" : height + "px",
                            }}
                            className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color"
                          >
                            {e?.product_discount}%
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              height:
                                height === "auto" ? "auto" : height + "px",
                            }}
                            className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color"
                          >
                            {e?.total_discount}%
                          </div>
                        </td>

                        <td>
                          <div
                            style={{
                              height:
                                height === "auto" ? "auto" : height + "px",
                            }}
                            className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color"
                          >
                            {e.subtotal > 0
                              ? Number(e.subtotal)?.toLocaleString("en-PK", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : Number(e.price)?.toLocaleString("en-PK", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : ""}
            </tbody>
          </table>
        </div>

        <div className="mt-4 row justify-content-end text-end">
          <div className="col-5 col-lg-4">
            <div className="mt-3">
              <p className="text-grey small m-0 p-0">Subtotal</p>
              <h5>
                {totalPrice?.toLocaleString("en-PK", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h5>
            </div>
            {data?.dicount_code_percentage > 0 && (
              <div className="mt-3">
                <p className="text-grey small m-0 p-0">
                  Discount by coupon code
                </p>
                <h5>{data?.dicount_code_percentage}%</h5>
              </div>
            )}

            <div className="mt-3">
              <p className="text-grey small m-0 p-0">Shipping</p>
              <h5>0</h5>
            </div>
            <div className="mt-3">
              <p className="text-grey small m-0 p-0">Total</p>
              <h5>
                {data?.discounted_total > 0
                  ? Number(data?.discounted_total)?.toLocaleString("en-PK", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : Number(data?.total)?.toLocaleString("en-PK", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </h5>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
