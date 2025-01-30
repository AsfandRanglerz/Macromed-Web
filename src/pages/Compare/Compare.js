import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Picture from "../../assets/picture.png";
import "./compare.css";
import { Slider } from "../home/Home";
import { useQuery } from "react-query";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingComponent from "../../components/LaodingComponent";

function Compare() {
  const ref = useRef(null);
  const removeRef = useRef(null);
  const companyRef = useRef(null);
  const [removeBtn, setRemoveBtn] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: sideBaarData, isLoading } = useQuery(
    "sidebarData",
    async () => {
      let response = await axios.get(
        `${process.env.REACT_APP_API_URL}api/getDropDownData`
      );
      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {},
    }
  );

  useLayoutEffect(() => {
    if (removeRef.current) {
      setRemoveBtn(removeRef.current.clientHeight);
    }
  }, [removeRef, data]);

  const param = useParams();

  const { productIds } = param;

  const compareIds = async (ids) => {
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}api/productComparison?product_ids=${
          ids || productIds
        }`
      )
      .then((res) => {
        setData(res?.data?.comparison);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message == "Network Error") {
          toast.error("Check your internet connection");
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    compareIds();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const handleRemove = (id) => {
    const ids = JSON.parse(localStorage.getItem("productIds")) || [];
    const newIds = ids.filter((e) => e !== id);
    localStorage.setItem("productIds", JSON.stringify(newIds));

    const checkIds = productIds.split(",");
    const updatedId = checkIds.filter((e) => e !== String(id));

    if (updatedId.length == 0) {
      toast.error("There should be 2 or more products in compare");
      navigate("/");
      return;
    }

    navigate(`/compare-products/${updatedId.join(",")}`);
    compareIds(updatedId.join(","));
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <div className="container-fluid px-3 px-md-4 px-xl-5 mx-auto my-5">
        <div className="row justify-content-center mb-5">
          <div className="col-3 p-0 left-side">
            <div className="text-theme text-center heading d-flex align-items-center justify-content-center">
              <p className="p-0 m-0 text-center fw-medium">PRODUCT DETAILS</p>
            </div>
            <div className="fields-border">
              <div className="py-3 field">
                <p className="small text-center fw-medium p-0 m-0">
                  No. of variants
                </p>
              </div>
              <div className="py-3 field">
                <p className="small text-center fw-medium p-0 m-0">Price</p>
              </div>
              <div className="py-3 field">
                <p className="small text-center fw-medium p-0 m-0">
                  Availablity
                </p>
              </div>
              <div className="py-3 field">
                <p className="small text-center fw-medium p-0 m-0">Country</p>
              </div>
              <div className="py-3 field">
                <p className="small text-center fw-medium p-0 m-0">Brand</p>
              </div>
              <div className="py-3 field">
                <p className="small text-center fw-medium p-0 m-0">
                  Sterlization
                </p>
              </div>
              <div className="py-3 field">
                <p className="small text-center fw-medium p-0 m-0">
                  Certificate
                </p>
              </div>
              <div className="py-3 field">
                <p className="small text-center fw-medium p-0 m-0">Comapany</p>
              </div>
              <div className="py-3 field">
                <p className="small text-center fw-medium p-0 m-0">
                  No. of Use
                </p>
              </div>
              <div
                style={{ height: `${removeBtn + 2}px` }}
                className="field remove-btn"
              ></div>
            </div>
          </div>
          {data?.map((e, index) => {
            return (
              <div className="col-3 p-0">
                <div
                  key={index}
                  className="text-theme text-center d-flex flex-column justify-content-center align-items-center heading"
                >
                  <img
                    style={{ width: "60px", height: "60px" }}
                    src={process.env.REACT_APP_API_URL + e.thumbnail_image}
                    alt=""
                    className="rounded product-image"
                  />
                  <Link
                    className="text-decoration-none"
                    to={`/details/${e.id}`}
                  >
                    <p className="text-center fw-medium mt-2 px-3">
                      {e.short_name.length > 27
                        ? `${e.short_name.slice(0, 27)}...`
                        : e.short_name}
                    </p>
                  </Link>
                </div>
                <div className="fields-border">
                  <div className="py-3 field">
                    <p className="small text-center fw-medium p-0 m-0">
                      {e.variant_count ? e.variant_count : 0}
                    </p>
                  </div>
                  <div className="py-3 field">
                    <p className="small text-center fw-medium p-0 m-0">
                      {e.price?.toLocaleString("en-PK")}
                    </p>
                  </div>
                  <div className="py-3 field">
                    <p className="small text-center fw-medium p-0 m-0">
                      {e.remaining_quantities == 0
                        ? "Not in stock"
                        : "In Stock"}
                    </p>
                  </div>
                  <div className="py-3 field">
                    <p className="small text-center fw-medium p-0 m-0">
                      {e.country}
                    </p>
                  </div>
                  <div ref={ref} className="py-3 field">
                    <p className="small text-center fw-medium p-0 m-0">
                      {e.brands.join(", ")}
                    </p>
                  </div>
                  <div className="py-3 field">
                    <p className="small text-center fw-medium p-0 m-0">
                      {e.sterilizations}
                    </p>
                  </div>
                  <div className="py-3 field">
                    <p className="small text-center fw-medium p-0 m-0">FDA</p>
                  </div>
                  <div ref={companyRef} className="py-3 field">
                    <p className="small text-center fw-medium p-0 m-0">
                      {e.company}
                    </p>
                  </div>
                  <div className="py-3 field">
                    <p className="small text-center fw-medium p-0 m-0">
                      {e.certifications.join(", ")}
                    </p>
                  </div>
                  <div
                    ref={removeRef}
                    className="py-3 d-flex justify-content-center align-items-center gap-2 field remove-btn"
                  >
                    <p
                      onClick={() => handleRemove(e.id)}
                      className="p-0 m-0 small fw-medium pointer"
                    >
                      Remove
                    </p>
                    <span className="fa-solid fa-xmark p-0 m-0"></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Slider
          feature={true}
          featureProducts={sideBaarData?.featureProducts}
        />
      </div>
    </>
  );
}

export default Compare;
