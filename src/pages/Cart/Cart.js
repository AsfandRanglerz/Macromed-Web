import React, { useEffect, useState } from "react";
import "./Cart.css";
import CartProduct from "./CartProduct";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import Logo from "../../assets/logo.png";

function Cart() {
  const { userData } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart[userData?.id] || []);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

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

  const exportToExcel = () => {
    const data = cart.flatMap((product) =>
      product.variants.map((variant) => ({
        "Product Name": product.productName,
        "Product Link": {
          f: `HYPERLINK("https://macromed.com.pk/details/${product.id}", "https://macromed.com.pk/details/${product.id}")`,
        },
        SKU: variant.s_k_u,
        Quantity: variant.count,
        "Price/Unit": variant.selling_price_per_unit_pkr,
        "Discounted Price/Unit":
          variant.selling_price_per_unit_pkr * (1 - product.discount / 100),
        "Total Price": variant.totalPrice,
        "Discounted Total Price":
          variant.totalPrice * (1 - product.discount / 100),
        "Brand Discount": product.brandDiscount,
        "Category Discount": product.categoryDiscount,
        "Product Discount": product.productDiscount,
        "Total Discount": product.discount,
      }))
    );

    // Convert JSON to Sheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Add headers separately to apply styling
    const headers = [
      [
        "Product Name",
        "Product Link",
        "SKU",
        "Quantity",
        "Price/Unit",
        "Discounted Price/Unit",
        "Total Price",
        "Discounted Total Price",
        "Brand Discount",
        "Category Discount",
        "Product Discount",
        "Total Discount",
      ],
    ];

    XLSX.utils.sheet_add_aoa(ws, headers, { origin: "A1" });

    // **Apply bold styling to the first row (headers only)**
    headers[0].forEach((_, colIdx) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx }); // First row, each column
      if (ws[cellRef]) {
        ws[cellRef].s = { font: { bold: true } }; // Apply bold styling
      }
    });

    // **Set column widths**
    ws["!cols"] = [
      { wch: 30 }, // Product Name
      { wch: 50 }, // Product Link (adjusted for long URLs)
      { wch: 15 }, // SKU
      { wch: 10 }, // Quantity
      { wch: 12 }, // Price/Unit
      { wch: 20 }, // Discounted Price/Unit
      { wch: 15 }, // Total Price
      { wch: 20 }, // Discounted Total Price
      { wch: 15 }, // Brand Discount
      { wch: 15 }, // Category Discount
      { wch: 15 }, // Product Discount
      { wch: 15 }, // Total Discount
    ];

    // Create Workbook and Save
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cart Details");
    XLSX.writeFile(
      wb,
      `${userData?.name || "User"} | Cart Details | Macromed.xlsx`
    );
  };

  return (
    <>
      <div className="container-fluid mt-5 mb-5 px-3 px-xl-5 ">
        <div
          onClick={() => navigate(-1)}
          className="text-decoration-none text-theme pointer"
        >
          <div className="d-flex align-items-center gap-2">
            <span className="fa-solid fa-arrow-left text-theme"></span>
            <p className="small fw-medium p-0 m-0">Back</p>
          </div>
        </div>
        {cart.length > 0 ? (
          <div className="row">
            <div className="col-md-8 shop-cart-p col-xl-9">
              <div className="py-4 pe-xl-5">
                <div className="border-1 border-bottom pb-3 mb-3 d-flex justify-content-between align-items-center">
                  <h5 className="font-500 mb-0">Shopping Cart</h5>
                  <div className="d-flex gap-3 align-items-center">
                    <h5 className="font-500 mb-0">
                      {cart?.length} {cart?.length > 1 ? "Items" : "Item"}
                    </h5>
                    <button
                      onClick={exportToExcel}
                      className="d-flex align-items-center px-3 gap-2 btn text-white rounded print-btn"
                    >
                      <span className="fa-solid fa-print"></span>
                      <p className="m-0">Print</p>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="pt-3">
                    <div className="d-flex justify-content-between">
                      <div className="col-5  col-lg-4">
                        <h6 className="fw-semibold">
                          Product Detail & Variants
                        </h6>
                      </div>
                      <div className="col-7  d-flex justify-content-between">
                        <div className="col-4">
                          <h6 className="fw-semibold text-center">Quantity</h6>
                        </div>
                        <div className="col-4">
                          <h6 className="fw-semibold text-center">
                            Price/unit
                          </h6>
                        </div>
                        <div className="col-4">
                          <h6 className="fw-semibold text-center whitespace">
                            Total Price
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CartProduct cart={cart} userId={userData?.id} />
                </div>
              </div>
            </div>
            <div className="col-md-4 col-xl-3">
              <div className="p-md-3 p-lg-4 summary">
                <div className="border-2 border-bottom pb-2 mb-3">
                  <h5 className="font-500">Order Summary</h5>
                </div>
                <div className="d-flex pb-5 align-items-center justify-content-between">
                  <p className="small font-500">
                    {cart?.length} {cart?.length > 1 ? "Items" : "Item"}
                  </p>
                  <p className="small font-600">
                    {totalPrice?.toLocaleString("en-PK", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="pt-3">
                  <div className="d-flex mt-5 align-items-center justify-content-between border-2 border-top pt-3 total-price">
                    <p className="font-500 small">Total</p>
                    <p className="font-600 small">
                      {totalPrice?.toLocaleString("en-PK", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div className="pt-3">
                  <Link to="/checkout" className="text-decoration-none">
                    <button
                      disabled={cart?.length == 0}
                      className="btn w-100 mt-4 text-white py-2 checkout-btn "
                    >
                      CHECKOUT
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{ height: "50vh" }}
            className="text-grey text-center small d-flex align-items-center justify-content-center message-page"
          >
            <p>No items added to the cart</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
