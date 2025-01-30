import React, { useEffect, useState } from "react";
import "./Cart.css";
import CartProduct from "./CartProduct";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Cart() {
  const { userData } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart[userData?.id] || []);
  const [totalPrice, setTotalPrice] = useState(0);

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

  return (
    <>
      <div className="container-fluid mt-5 mb-5 px-3 px-xl-5 ">
        {cart.length > 0 ? (
          <div className="row">
            <div className="col-md-8 shop-cart-p col-xl-9">
              <div className="py-4 pe-xl-5">
                <div className="border-1 border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                  <h5 className="font-500">Shopping Cart</h5>
                  <h5 className="font-500">
                    {cart?.length} {cart?.length > 1 ? "Items" : "Item"}
                  </h5>
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
