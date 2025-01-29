import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import logo from "../../assets/logo.png";

export default function QuoteModel({ show, handleClose, data, discount }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    let total = 0;
    data?.forEach((product) => {
      product.variants.forEach((variant) => {
        const discountedPrice =
          variant.selling_price_per_unit_pkr * (1 - product.discount / 100);
        total += discountedPrice * variant.count;
      });
    });

    setSubtotal(total);
  }, [data]);
  useEffect(() => {
    let total = 0;
    data?.forEach((product) => {
      product.variants.forEach((variant) => {
        const discountedPrice =
          variant.selling_price_per_unit_pkr * (1 - product.discount / 100);
        total += discountedPrice * variant.count;
      });
    });

    if (discount?.discount_percentage) {
      const discountPercentage = Number(discount.discount_percentage);
      total = total - (total * discountPercentage) / 100;
    }

    setTotalPrice(total);
  }, [data, discount]);

  return (
    <Modal
      style={{ zIndex: 9999 }}
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
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <h4>Order Detail</h4>
              <img src={logo} />
            </div>
            <div className="row justify-content-between mt-4">
              <div className="col-5 col-lg-3">
                <h6 className="text-grey mb-0">Contact:</h6>
                <p className="text-grey2 small">+92 (310) 760 8641</p>
                <h6 className="text-grey mb-0">Email:</h6>
                <p className="text-grey2 small">info@macromed.com.pk</p>
                <h6 className="text-grey mb-0">Location:</h6>
                <p className="text-grey2 small">
                  FF 130, Defence Shopping Mall , DHA Main Boulevard ,
                </p>
              </div>
              <div className="col-5 col-lg-3 text-end"></div>
            </div>
            {/* <div className="row justify-content-between mt-4">
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
          </div> */}
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
                      SKU
                    </div>
                  </th>
                  <th>
                    <div className="px-3 px-lg-0 py-2 text-center white-space">
                      Product Name
                    </div>
                  </th>
                  <th>
                    <div className="px-3 px-lg-0 py-2 text-center white-space">
                      Price/Unit
                    </div>
                  </th>
                  <th>
                    <div className="px-3 px-lg-0 py-2 text-center white-space">
                      Quantity
                    </div>
                  </th>
                  <th>
                    <div className="px-3 px-lg-0 py-2 text-center white-space">
                      Brand Disc.
                    </div>
                  </th>
                  <th>
                    <div className="px-3 px-lg-0 py-2 text-center white-space">
                      Category Disc.
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
                      Total Price
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((product, index) =>
                  product.variants.map((variant, variantIndex) => {
                    const discountedPrice =
                      variant.selling_price_per_unit_pkr *
                      (1 - product.discount / 100);
                    return (
                      <tr
                        className="table-row"
                        key={`${index}-${variantIndex}`}
                      >
                        <td>
                          <div className="white-space py-1 d-flex font-500 px-2 align-items-center table-row-color">
                            {index + 1}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center align-items-center gap-3 model-description-dash position-relative py-1 table-row-color">
                            <p className="p-0 m-0 text-center">
                              {variant.s_k_u}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color">
                            <a
                              title={product.productName}
                              className="model-product-name"
                              target="_blank"
                              href={`/details/${product.id}`}
                            >
                              <p className="mb-0">
                                {product.productName.length > 12
                                  ? `${product.productName.slice(0, 12)}...`
                                  : product.productName}
                              </p>
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color">
                            {discountedPrice?.toLocaleString("en-PK", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                        <td>
                          <div className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color">
                            {variant.count}
                          </div>
                        </td>
                        <td>
                          <div className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color">
                            {product.brandDiscount}%
                          </div>
                        </td>
                        <td>
                          <div className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color">
                            {product.categoryDiscount}%
                          </div>
                        </td>
                        <td>
                          <div className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color">
                            {product.productDiscount}%
                          </div>
                        </td>
                        <td>
                          <div className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color">
                            {product.discount}%
                          </div>
                        </td>
                        <td>
                          <div className="align-items-center d-flex gap-3 justify-content-center pe-2 position-relative ps-2 py-1 table-row-color">
                            {Number(
                              discountedPrice * variant.count
                            )?.toLocaleString("en-PK", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-end">
            <p className="small text-grey mb-0">Subtotal:</p>
            <h5>
              {subtotal?.toLocaleString("en-PK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h5>
          </div>
          <div className="mt-4 text-end">
            <p className="small text-grey mb-0">Total Price:</p>
            <h5>
              {totalPrice?.toLocaleString("en-PK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h5>
          </div>
          <div className="mt-4 text-end">
            <button className="web-button">Request for quote</button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
