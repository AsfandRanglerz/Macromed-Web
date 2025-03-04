import "./home.css";
import { forwardRef, useContext, useState } from "react";
import sort from "../../assets/sort-icon.png";
import heart from "../../assets/heart-icon.png";
import heart2 from "../../assets/heart2.png";
import navigation from "../../assets/navigation-icon.png";
import compare from "../../assets/compare.png";
import shareIcone from "../../assets/share-icon.png";
import { useEffect, useRef } from "react";
import star from "../../assets/star.png";
import axios from "axios";
import LoadingComponent from "../../components/LaodingComponent";
import { useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import { WishlistContext } from "../../Context/WishlistContext";
import DiscountCoupon from "../../components/discountCoupon/DiscountCoupon";
export default function Home() {
  const [sort1, setSort1] = useState(false);
  const [sort2, setSort2] = useState(false);
  const sortRef = useRef();
  const [showSort, setShowSort] = useState(false);
  const [suggestions, setSuggestions] = useState();
  const [word, setWord] = useState("");
  const productRef = useRef(null);
  const [dollarPrice, setDollarPrice] = useState(null);
  const [categoryData, setCatageoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const queryClient = useQueryClient();
  // Get the CSRF token value from the meta tag
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  if (csrfToken) {
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
  }

  useEffect(() => {
    const discountGetting = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}api/getCategoryBrand`)
        .then((res) => {
          setBrandData(res?.data?.brands);
          setCatageoryData(res?.data?.categories);
        })
        .catch((err) => {});
    };

    discountGetting();
  }, []);

  const [filters, setFilters] = useState({
    company: [],
    brand_id: [],
    category_id: [],
    certification_id: [],
    country: [],
    min_price: "",
    max_price: "",
    available_product: false,
    key_words: "",
    page: 1,
    price_order: "",
    product_class: [],
    product_use_status: [],
    warranty_period: [],
    product_condition: [],
  });
  const [filters1, setFilters1] = useState({
    company: [],
    brand_id: [],
    category_id: [],
    certification_id: [],
    country: [],
    min_price: "",
    max_price: "",
    available_product: false,
    key_words: "",
    page: 1,
    suggested_word: word,
    price_order: "",
    product_class: [],
    product_use_status: [],
    warranty_period: [],
    product_condition: [],
  });
  const [page, setPage] = useState(1);

  const getProducts = async (page) => {
    let filters2 = { ...filters1, page };

    // Clean and format filters
    Object.keys(filters2).forEach((e) => {
      if (
        e === "company" ||
        e === "category_id" ||
        e === "country" ||
        e === "product_class" ||
        e === "product_use_tatus" ||
        e === "warranty_period" ||
        e === "product_condition" ||
        e === "brand_id" ||
        e === "certification_id"
      ) {
        if (Array.isArray(filters2[e])) {
          if (filters2[e].length === 0) {
            delete filters2[e];
          } else {
            filters2[e] = filters2[e].join(",");
          }
        }
      } else if (!filters2[e] || filters2[e] === "") {
        delete filters2[e];
      } else if (e === "max_price" || e === "min_price") {
        filters2[e] =
          parseInt(filters2[e]) /
          (productsData?.pkrAmount || dollarPrice)?.toString();
      }
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/getProducts`,
        filters2
      );

      if (page > 1) {
        queryClient.setQueryData(["homeproducts", filters1], (prevData) => {
          return {
            ...prevData,
            products: [
              ...(prevData?.products || []),
              ...response?.data?.products,
            ],
            // Update any additional fields as necessary
          };
        });
        return;
      }

      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error.message == "Network Error") {
        toast.error("Check your internet connection");
      }
    }
  };

  const { data: sideBaarData, isLoading } = useQuery(
    ["sidebarData", filters1],
    async ({ queryKey }) => {
      const [, filters1] = queryKey;

      // Filter out empty or default values
      const filteredFilters = Object.fromEntries(
        Object.entries(filters1).filter(([key, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return value !== "" && value !== false && value !== null;
        })
      );

      const queryString = new URLSearchParams(filteredFilters).toString();
      const url = `${process.env.REACT_APP_API_URL}api/getDropDownData?${queryString}`;

      let response = await axios.get(url);

      return response.data.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {},
    }
  );
  const { data: productsData, isLoading: isLoading1 } = useQuery(
    ["homeproducts", filters1], // Ensure filters1 includes the page number
    () => getProducts(1),
    {
      keepPreviousData: true, // Keep old data while fetching new data
      // Optionally, you can add other configurations like refetch intervals or stale time
    }
  );
  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(
      (filterValue) =>
        (Array.isArray(filterValue) && filterValue.length > 0) ||
        (typeof filterValue === "string" && filterValue !== "") ||
        (typeof filterValue === "boolean" && filterValue === true) ||
        (typeof filterValue === "number" && filterValue > 0)
    );

    const hasActiveFilters1 = Object.values(filters1).some(
      (filterValue) =>
        (Array.isArray(filterValue) && filterValue.length > 0) ||
        (typeof filterValue === "string" && filterValue !== "") ||
        (typeof filterValue === "boolean" && filterValue === true) ||
        (typeof filterValue === "number" && filterValue > 0)
    );

    if (hasActiveFilters || hasActiveFilters1) {
      if (page !== 1) {
        setPage(1);
      } else {
        getProducts(1);
      }
    }
  }, [filters, filters1]);

  useEffect(() => {
    if (page <= productsData?.totalProducts) {
      getProducts(page);
    } else {
      setPage((prevPage) => (prevPage === 1 ? 1 : prevPage - 1));
    }
  }, [page, word, productsData?.totalProducts]);

  const timeRef = useRef();
  function changeFilter(value, name) {
    clearTimeout(timeRef.current);
    setPage(1);
    let newFilters = {
      ...filters,
      [name]: value,
      page: 1,
    };
    setFilters(() => {
      return newFilters;
    });
    if (name == "min_price" || name == "max_price") {
      if (
        (newFilters.min_price && newFilters.max_price) ||
        (!newFilters.min_price && !newFilters.max_price)
      ) {
        timeRef.current = setTimeout(() => {
          setFilters1(() => {
            return newFilters;
          });
        }, 800);
      } else {
        return;
      }
    } else {
      setFilters1(() => {
        return newFilters;
      });
    }
  }

  useEffect(() => {
    if (productsData) {
      if (productsData?.pkrAmount) {
        setDollarPrice(productsData?.pkrAmount);
      }
    }
  }, [productsData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortRef]);

  const navigate = useNavigate();

  const [comapreCounter, setCompareCounter] = useState(0);

  const compareProducts = () => {
    const ids = JSON.parse(localStorage.getItem("productIds")) || [];

    if (ids.length < 2) {
      toast.error("There should be at least 2 items in the compare list.");
      return;
    }

    navigate(`/compare-products/${ids.join(",")}`);
  };

  const carouselRef = useRef(null);

  // Function to scroll the carousel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -150 : 150;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        // If at the end, scroll back to the start
        if (scrollLeft + clientWidth >= scrollWidth) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll to the right by a fixed amount
          carouselRef.current.scrollBy({ left: 150, behavior: "smooth" });
        }
      }
    }, 2000); // Adjust timing as needed

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (isLoading || isLoading1) {
    return <LoadingComponent />;
  }
  return (
    <>
      <div className="container-fluid home mb-5 px-3 px-md-4 px-xl-5">
        <div className="show-case-container mb-5">
          <h4 className="text-theme-light mb-4 text-center font-500">
            High Quality Certified Surgical Items
          </h4>
          <div className="show-case-container">
            {/* <button
              onClick={() => scrollCarousel("left")}
              className="btn btn-primary me-2"
            >
              Prev
            </button> */}
            <div className="show-case">
              <div
                ref={carouselRef}
                className="child py-2 ps-md-5 text-end ps-xl-0 scrollable"
                style={{ whiteSpace: "nowrap", overflowX: "auto" }}
              >
                {sideBaarData?.silders?.map((e, index) => (
                  <img
                    key={`96${index}ajklkaj`}
                    className={`rounded-2 shadow-sm ${
                      index < sideBaarData?.silders?.length - 1 ? "me-3" : ""
                    }`}
                    src={process.env.REACT_APP_API_URL + e.images}
                    alt="slider item"
                    style={{
                      objectFit: "cover",
                      width: "5.5rem",
                      height: "5.5rem",
                    }}
                  />
                ))}
              </div>
            </div>
            {/* <button
              onClick={() => scrollCarousel("right")}
              className="btn btn-primary ms-2"
            >
              Next
            </button> */}
          </div>
        </div>
        <div className="position-relative row gx-2 mb-5 align-items-start">
          <div className="col-md-4 col-lg-3 mb-3 mb-md-0 side-baar-parent">
            <div className="side-baar bg-white">
              <h6 className="mb-0 small py-2 px-3 side-baar-header">
                SHOW RESULT BY
              </h6>
              <SideBaar
                filters={filters}
                changeFilter={changeFilter}
                sideBaarData={sideBaarData}
                suggestions={suggestions}
                setSuggestions={setSuggestions}
                word={word}
                setWord={setWord}
              />
            </div>
            <DiscountCoupon />
          </div>
          <div className="col-md-8 col-lg-9">
            <div className="products-section">
              <div className="filter-section mb-3 d-flex flex-column flex-xl-row justify-content-between pb-3">
                <div>
                  <div className="d-flex gap-2 flex-wrap">
                    <ShowFilters
                      setSort1={setSort1}
                      setSort2={setSort2}
                      setFilters1={setFilters1}
                      setFilters={setFilters}
                      changeFilter={changeFilter}
                      filters={filters}
                      word={word}
                    />
                  </div>
                </div>
                <div className="d-flex gap-3 mt-3 mt-xl-0 justify-content-end position-relative">
                  <p className="text-grey small mb-0 font-500 white-space p-0">
                    Total Products ({productsData?.totalProducts || 0})
                  </p>

                  <p
                    onClick={compareProducts}
                    className="mb-0 text-grey small font-500 pb-0 white-space pointer"
                  >
                    Compare ({comapreCounter})
                  </p>
                  <p
                    ref={sortRef}
                    onClick={() => {
                      setShowSort(!showSort);
                    }}
                    className="mb-0 pb-0 text-grey small font-500 pointer white-space"
                  >
                    Sort <img src={sort} className="sort-icon" alt="" />
                  </p>
                  {showSort == true && (
                    <div
                      ref={sortRef}
                      className="z-3 w-75 position-absolute sort-menu"
                    >
                      <ul className="list-group shadow rounded-0 keyword-ul">
                        <li
                          onClick={() => {
                            setSort1(true);
                            setSort2(false);
                            setFilters((prev) => {
                              return {
                                ...prev,
                                price_order: "low_to_high",
                              };
                            });
                            setFilters1((prev) => {
                              return {
                                ...prev,
                                price_order: "low_to_high",
                              };
                            });
                            setShowSort(false);
                            getProducts(page);
                          }}
                          className={`list-group-item px-2 py-1 small pointer keyword ${
                            sort1 ? "sort-btn-click" : ""
                          }`}
                        >
                          Low to High Price
                        </li>
                        <li
                          onClick={() => {
                            setSort1(false);
                            setSort2(true);
                            setFilters((prev) => {
                              return {
                                ...prev,
                                price_order: "high_to_low",
                              };
                            });
                            setFilters1((prev) => {
                              return {
                                ...prev,
                                price_order: "high_to_low",
                              };
                            });
                            setShowSort(false);
                            getProducts(page);
                          }}
                          className={`list-group-item px-2 py-1 small pointer keyword ${
                            sort2 ? "sort-btn-click" : ""
                          }`}
                        >
                          High to Low Price
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {productsData?.totalProducts >= 0 ? (
                ""
              ) : (
                <h3 className="text-danger text-center mt-2">
                  No Result Found!
                </h3>
              )}
              <div className="d-none d-lg-block ">
                <ProductsContainer2
                  comapreCounter={comapreCounter}
                  setCompareCounter={setCompareCounter}
                  ref={productRef}
                  setPage={setPage}
                  filters={filters}
                  filters1={filters1}
                  products={productsData?.products || []}
                  counter={productsData?.totalProducts}
                  categoryData={categoryData}
                  brandData={brandData}
                />
              </div>

              <div className="d-block d-lg-none">
                <ProductsContainer
                  comapreCounter={compareProducts}
                  setCompareCounter={setCompareCounter}
                  ref={productRef}
                  setPage={setPage}
                  filters={filters}
                  products={productsData?.products || []}
                  categoryData={categoryData}
                  brandData={brandData}
                />
              </div>
            </div>
          </div>
        </div>
        <Slider
          categoryData={categoryData}
          brandData={brandData}
          feature={true}
          featureProducts={sideBaarData?.featureProducts}
        />
      </div>
    </>
  );
}
export function Slider({
  featureProducts = [],
  feature,
  categoryData,
  brandData,
}) {
  const ref = useRef();
  function helper() {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    ref.current.scrollTo({
      left: ref.current.scrollLeft + 216 + rootFontSize,
      behavior: "smooth",
    });
  }

  function helper1() {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    ref.current.scrollTo({
      left: ref.current.scrollLeft - 216 - rootFontSize,
      behavior: "smooth",
    });
  }

  return (
    <div className="position-relative">
      <span className="angle-left" onClick={helper1}>
        <span className="fa-solid fa-angle-left"></span>
      </span>
      <span className="angle-right pointer" onClick={helper}>
        <span className="fa-solid fa-angle-right"></span>
      </span>
      <div ref={ref} className="d-flex slider">
        <>
          {featureProducts.map((element, index) => {
            if (index == 0) {
              return (
                <Card
                  feature={feature}
                  key={`${element.id}jadfadh4${index}`}
                  {...element}
                  index={0}
                  categoryData={categoryData}
                  brandData={brandData}
                />
              );
            }
            return (
              <Card
                feature={feature}
                key={`${element.id}jadfadh4${index}`}
                {...element}
                index={index}
                categoryData={categoryData}
                brandData={brandData}
              />
            );
          })}
        </>
      </div>
    </div>
  );
}
function Card({
  feature,
  index = 1,
  thumbnail_image,
  id,
  short_name,
  short_description,
  categoryData,
  brandData,
  product_category,
  product_brands,
  discount_percentage,
}) {
  const [discountOnCategory, setDiscountOnCategory] = useState(null);
  const [discountOnBrand, setDiscountOnBrand] = useState(null);
  useEffect(() => {
    if (categoryData && product_category) {
      // Find the first category with a discount
      const discountedCategory = categoryData?.find((category) =>
        product_category.some(
          (productCategory) =>
            productCategory.categories?.name === category.name &&
            category.discount_percentage
        )
      );

      if (discountedCategory) {
        setDiscountOnCategory(discountedCategory);
      } else {
        setDiscountOnCategory(null);
      }
    }
  }, [categoryData]);

  useEffect(() => {
    if (brandData && product_brands) {
      // Find the first category with a discount
      const discountedBrand = brandData?.find((brand) =>
        product_brands.some(
          (productCategory) =>
            productCategory.brands?.name === brand.name &&
            brand.discount_percentage
        )
      );

      if (discountedBrand) {
        setDiscountOnBrand(discountedBrand); // Set the entire discounted category object
      } else {
        setDiscountOnBrand(null); // Clear discount if no category has a discount
      }
    }
  }, [brandData]);

  const brandDiscount = discountOnBrand?.discount_percentage
    ? Number(discountOnBrand?.discount_percentage)
    : 0;
  const categoryDiscount = discountOnCategory?.discount_percentage
    ? Number(discountOnCategory?.discount_percentage)
    : 0;

  const productDiscount = discount_percentage ? Number(discount_percentage) : 0;

  const discountPercentage = Math.max(
    brandDiscount,
    categoryDiscount,
    productDiscount
  );

  // Set the badge color based on discount percentage
  const badgeClass = discountPercentage >= 75 ? "purple-badge" : "blue-badge";
  return (
    <>
      <div className={`py-1`} style={{ marginLeft: index == 0 ? "0.5rem" : 0 }}>
        <div className="px-2 px-sm-0 h-100">
          <div className="slider-card d-flex flex-column justify-content-between position-relative h-100  pb-2 overflow-hidden">
            {discountPercentage > 0 && (
              <div
                className={`discount-badg-product shadow position-absolute py-1 d-flex align-items-center justify-content-center ${badgeClass}`}
              >
                <p
                  style={{ fontSize: "0.8rem" }}
                  className="m-0 p-0 text-center text-white"
                >
                  <strong>-{discountPercentage}%</strong> off
                </p>
              </div>
            )}
            {feature && (
              <div className="slider-star-container">
                <img src={star} alt="" />
              </div>
            )}
            <div>
              <img
                className="slider-img w-100"
                src={`${process.env.REACT_APP_API_URL}${thumbnail_image}`}
                alt=""
              />
              <div className="p-2">
                <h6 className="small font-700">
                  <span className="small">{short_name}</span>
                </h6>
                <p className="small mb-0">
                  {" "}
                  <span className="small text-grey featureProduct-description">
                    {short_description}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-center">
              <Link target="_blank" to={`/details/${id}`}>
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
function Product({
  data,
  index,
  setHeight,
  setCompareCounter,
  check,
  setCheck,
  categoryData,
  brandData,
}) {
  const [discountOnCategory, setDiscountOnCategory] = useState(null);
  const [discountOnBrand, setDiscountOnBrand] = useState(null);
  const ref = useRef();
  function updateHeight() {
    if (index == 0) {
      if (ref.current) {
        setHeight(ref.current.offsetHeight);
      }
    }
  }
  useEffect(() => {
    updateHeight();
    if (index == 0) {
      window.addEventListener("resize", updateHeight);
      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, [ref.current]);

  useEffect(() => {
    // Category Discount Logic
    let categoryDiscount = null;
    if (data?.product_category) {
      categoryDiscount = categoryData?.find((category) =>
        data.product_category.some(
          (productCategory) =>
            productCategory.categories?.name === category.name &&
            category.discount_percentage
        )
      );
    }
    setDiscountOnCategory(categoryDiscount || null);

    // Brand Discount Logic
    let brandDiscount = null;
    if (data?.product_brands) {
      brandDiscount = brandData?.find((brand) =>
        data.product_brands?.some(
          (productBrand) =>
            productBrand.brands?.name === brand.name &&
            brand.discount_percentage
        )
      );
    }
    setDiscountOnBrand(brandDiscount || null);
  }, [data?.product_category, categoryData, data?.product_brands, brandData]);

  const [discountPercentage, setDiscountPercentage] = useState(0);
  useEffect(() => {
    const totalDiscount = Math.max(
      Number(
        discountOnBrand?.discount_percentage > 0
          ? discountOnBrand?.discount_percentage
          : 0
      ),
      Number(
        discountOnCategory?.discount_percentage > 0
          ? discountOnCategory?.discount_percentage
          : 0
      ),
      Number(data?.discount_percentage > 0 ? data?.discount_percentage : 0)
    );
    setDiscountPercentage(totalDiscount);
  }, [
    discountOnBrand,
    discountOnCategory,
    data?.discount_percentage,
    categoryData,
    brandData,
  ]);

  // Set the badge color based on discount percentage
  const badgeClass = discountPercentage >= 75 ? "purple-badge" : "blue-badge";

  return (
    <div ref={ref}>
      <div className="pb-3">
        <div className="home-product py-3 px-3 px-xl-4 position-relative overflow-hidden">
          {parseFloat(discountPercentage).toFixed(2).replace(/^0+/, "") > 0 && (
            <div
              className={`discount-badg-product shadow position-absolute py-1 d-flex align-items-center justify-content-center ${badgeClass}`}
            >
              <p
                style={{ fontSize: "0.8rem" }}
                className="m-0 p-0 text-center text-white"
              >
                <strong>
                  -
                  {parseFloat(discountPercentage).toFixed(2).replace(/^0+/, "")}
                  %
                </strong>{" "}
                off
              </p>
            </div>
          )}
          <div className="rounded-1  d-flex justify-content-between">
            <div className="product-info">
              <div className="d-flex flex-column gap-2 flex-sm-row justify-content-between mb-1 align-items-lg-center">
                <h6 className="pb-1 me-3 me-sm-0 mb-sm-0 product-name">
                  <Link
                    target="_blank"
                    style={{ textDecoration: "none" }}
                    to={`/details/${data?.id}`}
                  >
                    {data?.short_name} - {data?.product_code}
                  </Link>
                </h6>
              </div>
              <div className="row">
                <div className="col-xl-7 col-xxl-6">
                  <div className="d-flex mb-1">
                    <p className="small col-5 col-sm-4 text-lighter mb-0">
                      No. Of Variants
                    </p>
                    <p className="small  text-grey mb-0">
                      {data?.variant_count}
                    </p>
                  </div>
                  <div className="d-flex mb-1">
                    <p className="small col-5 col-sm-4 mb-0 text-lighter ">
                      Country
                    </p>
                    <p className="small text-grey mb-0">{data?.country}</p>
                  </div>
                  <div className="d-flex mb-1">
                    <p className="small col-5 col-sm-4  text-lighter mb-0">
                      Brand
                    </p>
                    <p className="small  text-grey mb-0">
                      {data?.product_brands
                        ?.map((e) => {
                          return e?.brands?.name;
                        })
                        .join(",")}
                    </p>
                  </div>
                  <div className="d-flex mb-1">
                    <p className="small col-5 col-sm-4  text-lighter mb-0 ">
                      Sterilization
                    </p>
                    <p className="small  text-grey mb-0">
                      {data?.sterilizations}
                    </p>
                  </div>
                </div>
                <div className="col-xl-5 col-xxl-6">
                  <div className="d-flex mb-1">
                    <p className="small col-5 col-sm-4 col-xl-5 text-lighter mb-0">
                      Company
                    </p>
                    <p className="small  text-grey mb-0">{data?.company}</p>
                  </div>
                  <div className="d-flex mb-1">
                    <p className="small col-5 col-sm-4 col-xl-5 text-lighter mb-0 ">
                      Certificate
                    </p>
                    <p className="small   text-grey mb-0">
                      {data?.product_certifications
                        ?.map((e) => {
                          return e?.certification?.name;
                        })
                        .join(", ")}
                    </p>
                  </div>
                  <div className="d-flex  mb-1">
                    <p className="small col-5 col-sm-4 col-xl-5  text-lighter mb-0">
                      Price Range
                    </p>
                    <p className="small  text-grey mb-0 ">
                      {!data?.min_price_range_pkr && !data?.max_price_range_pkr
                        ? "0"
                        : ""}
                      {data?.min_price_range_pkr}{" "}
                      {data?.max_price_range_pkr &&
                        "- " + data?.max_price_range_pkr}
                    </p>
                  </div>
                  <div className="d-flex mb-1">
                    <p className="small col-5 col-sm-4 col-xl-5 text-lighter mb-0">
                      No. Of Use
                    </p>
                    <p className="small text-grey mb-0">
                      {data?.product_use_status}
                    </p>
                  </div>
                </div>
              </div>
              <p className="small mt-2 text-lighter mb-0">
                <span className="small">{data?.short_description}</span>
              </p>
            </div>
            <ProductShowCase
              thumbNale={data?.thumbnail_image}
              id={data?.id}
              setCompareCounter={setCompareCounter}
              setCheck={setCheck}
              check={check}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function ShowFilters({
  filters,
  changeFilter,
  setFilters,
  setFilters1,
  word,
  setSort1,
  setSort2,
}) {
  function resetFilters() {
    setSort1(false);
    setSort2(false);
    setFilters((prev) => {
      const newFilters = { ...prev };
      Object.keys(newFilters).forEach((key) => {
        if (key == "available_product") {
          newFilters[key] = false;
        } else if (
          key == "company" ||
          key == "category_id" ||
          key == "country" ||
          key == "brand_id" ||
          key == "certification_id"
        ) {
          newFilters[key] = [];
        } else {
          newFilters[key] = "";
        }
      });
      setFilters1(() => {
        return newFilters;
      });
      return newFilters;
    });
  }
  return (
    <>
      {Object.keys(filters).map((e) => {
        if (filters[e] == "" || !filters[e]) {
          return "";
        } else if (e == "max_price" || e == "min_price" || e == "page") {
          return "";
        } else if (
          e == "company" ||
          e == "category_id" ||
          e == "country" ||
          e == "brand_id" ||
          e == "certification_id"
        ) {
          if (filters[e].length > 0) {
            if (e == "category_id") {
              return (
                <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
                  <span>
                    {filters[e].length >= 2 ? "Categories" : "category"} (
                    {filters[e].length})
                  </span>{" "}
                  <span>
                    <span
                      onClick={() => changeFilter([], e)}
                      className="fa-solid fa-xmark text-lighter"
                    ></span>
                  </span>{" "}
                </button>
              );
            } else if (e == "country") {
              return (
                <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
                  <span>
                    {filters[e].length >= 2 ? "Countries" : "Country"} (
                    {filters[e].length})
                  </span>{" "}
                  <span>
                    <span
                      onClick={() => changeFilter([], e)}
                      className="fa-solid fa-xmark text-lighter"
                    ></span>
                  </span>{" "}
                </button>
              );
            } else if (e == "company") {
              return (
                <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
                  <span>
                    {filters[e].length >= 2 ? "Comapnies" : "Company"} (
                    {filters[e].length})
                  </span>{" "}
                  <span>
                    <span
                      onClick={() => changeFilter([], e)}
                      className="fa-solid fa-xmark text-lighter"
                    ></span>
                  </span>{" "}
                </button>
              );
            } else if (e == "brand_id") {
              return (
                <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
                  <span>{filters[e].length >= 2 ? "Brands" : "Brand"}</span> (
                  {filters[e].length})
                  <span>
                    <span
                      onClick={() => changeFilter([], e)}
                      className="fa-solid fa-xmark text-lighter"
                    ></span>
                  </span>{" "}
                </button>
              );
            } else if (e == "certification_id") {
              return (
                <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
                  <span>
                    {filters[e].length >= 2 ? "Certificates" : "Certificate"} (
                    {filters[e].length})
                  </span>{" "}
                  <span>
                    <span
                      onClick={() => changeFilter([], e)}
                      className="fa-solid fa-xmark text-lighter"
                    ></span>
                  </span>{" "}
                </button>
              );
            }
          }
        } else if (e == "available_product" || e == "key_words") {
          return (
            <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
              <span>{e == "key_words" ? word : "Availablity"}</span>{" "}
              <span>
                <span
                  onClick={() => changeFilter(e == "key_words" ? "" : false, e)}
                  className="fa-solid fa-xmark text-lighter"
                ></span>
              </span>{" "}
            </button>
          );
        } else if (e == "price_order") {
          return (
            <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
              <span>{e == "price_order" ? "Price Order" : ""}</span>{" "}
              <span>
                <span
                  onClick={() => changeFilter(e == "key_words" ? "" : false, e)}
                  className="fa-solid fa-xmark text-lighter"
                ></span>
              </span>{" "}
            </button>
          );
        } else if (e == "product_class") {
          return (
            <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
              <span>{e == "product_class" ? "Product Class" : ""}</span>(
              {filters[e].length})
              <span>
                <span
                  onClick={() => changeFilter([], e)}
                  className="fa-solid fa-xmark text-lighter"
                ></span>
              </span>{" "}
            </button>
          );
        } else if (e == "product_use_status") {
          return (
            <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
              <span>
                {e == "product_use_status" ? "Product Use Status" : ""}
              </span>
              ({filters[e].length})
              <span>
                <span
                  onClick={() => changeFilter([], e)}
                  className="fa-solid fa-xmark text-lighter"
                ></span>
              </span>{" "}
            </button>
          );
        } else if (e == "product_condition") {
          return (
            <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
              <span>{e == "product_condition" ? "Product Condition" : ""}</span>
              ({filters[e].length})
              <span>
                <span
                  onClick={() => changeFilter([], e)}
                  className="fa-solid fa-xmark text-lighter"
                ></span>
              </span>{" "}
            </button>
          );
        } else if (e == "warranty_period") {
          return (
            <button className="filter-btn py-1 px-2 rounded-1 small d-flex gap-2 align-items-center text-grey">
              <span>{e == "warranty_period" ? "Warranty Period" : ""}</span>(
              {filters[e].length})
              <span>
                <span
                  onClick={() => changeFilter([], e)}
                  className="fa-solid fa-xmark text-lighter"
                ></span>
              </span>{" "}
            </button>
          );
        }
      })}

      <button
        onClick={resetFilters}
        className="filter-btn-clear py-1 px-3 rounded-1 small"
      >
        Clear All
      </button>
    </>
  );
}
function ProductShowCase({
  thumbNale,
  id,
  setCompareCounter,
  setCheck,
  check,
}) {
  const { userData } = useSelector((state) => {
    return state.user;
  });
  const [isInStorage, setIsInStorage] = useState(false);
  const [share, setShare] = useState(null);
  const [isHiding, setIsHiding] = useState(false);

  const optionRef = useRef(null);

  const toggleOption = (id) => {
    if (isHiding) {
      // If we are currently hiding, do not toggle
      setIsHiding(false); // Reset the hiding flag
      return;
    }

    setShare((prev) => (prev === id ? null : id));
  };

  const { data, setData, getWishListData } = useContext(WishlistContext);

  const addToWishlist = async () => {
    if (!userData?.id) {
      toast.error("Login to add wishlist");
      return;
    }
    const formData = {
      user_id: userData?.id,
      product_id: id,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/getProducts`,
        formData
      );

      if (response.data.success == "Wishlist added successfully!") {
        toast.success("Product added to your wishlist");
      }
      if (response.data.success == "Wishlist item removed successfully!") {
        toast.success("Product removed from your wishlist");
      }
      getWishListData();
      setCheck(!check);
    } catch (err) {
      if (err.message === "Network Error") {
        toast.error("Check your internet connection");
      }
    }
  };

  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem("productIds")) || [];
    setIsInStorage(storedIds.includes(id));
  }, [id]);

  const handleNavigateClick = () => {
    let storedIds = JSON.parse(localStorage.getItem("productIds")) || [];

    if (isInStorage) {
      storedIds = storedIds.filter((storedId) => storedId !== id);
    } else {
      if (storedIds.length < 3) {
        storedIds.push(id);
      } else {
        toast.error("You can only store 3 product IDs.");
        return;
      }
    }
    localStorage.setItem("productIds", JSON.stringify(storedIds));
    setIsInStorage(!isInStorage);
  };

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("productIds")) || [];
    setCompareCounter(ids.length);
  }, [isInStorage]);

  const handleClickOutside = (event) => {
    if (optionRef.current && !optionRef.current.contains(event.target)) {
      setShare(null);
      setIsHiding(true); // Set the hiding flag to true
    }
  };

  useEffect(() => {
    if (share !== null) {
      setIsHiding(false); // Reset when opening an option
    }
  }, [share]);
  useEffect(() => {
    if (share !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [share]);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Trigger the transition effect when share matches the id
    if (share === id) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [share, id]);

  return (
    <div>
      <div className="product-showCase gap-2 d-flex align-items-center position-relative">
        <div
          ref={optionRef}
          className={`position-absolute showcase-styling ${
            isActive ? "active" : ""
          }`}
        >
          <ShareComponent id={id} />
        </div>

        <div className="d-flex flex-column product-social justify-content-between gap-1">
          <span>
            <img
              onClick={() => toggleOption(id)}
              src={shareIcone}
              className="img1 pointer"
              alt=""
            />
          </span>
          <span onClick={handleNavigateClick}>
            <img
              style={{ height: `${isInStorage ? "15px" : ""}` }}
              src={isInStorage ? compare : navigation}
              className="img2 pointer"
              alt=""
            />
          </span>
          <span>
            <img
              onClick={addToWishlist}
              src={
                data.some((product) => product.product_id == id)
                  ? heart2
                  : heart
              }
              className="img1 pointer"
              alt=""
            />
          </span>
        </div>
        <div>
          <img
            className="product-image rounded-3 mb-2"
            src={process.env.REACT_APP_API_URL + thumbNale}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

function SideBaar({
  sideBaarData,
  filters,
  changeFilter,
  suggestions,
  setSuggestions,
  word,
  setWord,
}) {
  const formData = {
    suggested_word: word,
  };

  const ref = useRef();
  const [showSug, setShowSug] = useState(false);

  useEffect(() => {
    const getKeyWords = async () => {
      await axios
        .post(`${process.env.REACT_APP_API_URL}api/getProducts`, formData)
        .then((res) => {
          setSuggestions(res?.data?.suggested_words);
        })
        .catch((err) => {});
    };

    getKeyWords();
  }, [word]);

  function helper(name, value, change) {
    if (change) {
      let arr = [...filters[name], value];
      changeFilter(arr, name);
      return;
    }
    let arr = filters[name].filter((e) => {
      return e !== value;
    });
    changeFilter(arr, name);
  }

  function searchByKeywords() {
    changeFilter(word, "key_words");
    setShowSug(false);
  }

  function handleSelect(e) {
    setWord(e);
    setShowSug(false);
  }

  useEffect(() => {
    setWord(filters.key_words);
  }, [filters.key_words]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSug(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <>
      <div className="side-baar-body pb-3 px-2 px-xl-3 bg-white">
        <p className="small font-500 mt-3 mb-2">SEARCH BY KEYWORDS</p>
        <div className="search-keywords position-relative">
          {showSug && (
            <div
              ref={ref}
              className="z-3 w-100 position-absolute suggestion-keywords"
            >
              <ul className="list-group shadow rounded-0 scrollable keyword-ul">
                {suggestions?.length > 0 ? (
                  suggestions?.map((e) => {
                    return (
                      <li
                        onClick={() => handleSelect(e)}
                        className="list-group-item px-2 py-1 small pointer keyword"
                      >
                        {e}
                      </li>
                    );
                  })
                ) : (
                  <li className="list-group-item px-2 py-1 small pointer keyword">
                    No suggestions
                  </li>
                )}
              </ul>
            </div>
          )}
          <input
            ref={ref}
            type="text"
            value={word}
            onChange={(e) => {
              setWord(e.target.value);
              setShowSug(true);
            }}
            placeholder="Search by the keywords"
          />
          <button className="sarchkeywords-btn" onClick={searchByKeywords}>
            <span className="fa-solid fa-magnifying-glass"></span>
          </button>
        </div>

        <SideBaarAccordion
          heading={"MFG Country"}
          counter={sideBaarData?.countries_of_manufacture?.length}
          openAcc={filters.country.length > 0}
        >
          <div
            className="side-baar-select"
            style={{
              maxHeight:
                sideBaarData?.countries_of_manufacture?.length > 10
                  ? "200px"
                  : "auto",
              overflowY:
                sideBaarData?.countries_of_manufacture?.length > 10
                  ? "scroll"
                  : "visible",
            }}
          >
            {sideBaarData?.countries_of_manufacture
              ?.sort((a, b) => a.country.localeCompare(b.country))
              .map((e, index) => {
                return (
                  <div
                    key={`${e.country + "asdfjkh" + index}`}
                    className="d-flex flex-row-reverse justify-content-end gap-2 align-items-center"
                  >
                    <div className="text-lighter small-text font-400">
                      {`(${e.count})`}
                    </div>
                    <div>
                      <label className="small pointer" htmlFor={e.country}>
                        {e.country}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        onChange={(event) =>
                          helper("country", e.country, event.target.checked)
                        }
                        checked={filters.country.includes(e.country)}
                        id={e.country}
                        style={{ height: "1rem", width: "1rem" }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </SideBaarAccordion>
        <SideBaarAccordion
          heading={"BRAND"}
          counter={sideBaarData?.brands?.length}
          openAcc={filters.brand_id.length > 0}
        >
          <div
            className="side-baar-select"
            style={{
              maxHeight: sideBaarData?.brands?.length > 10 ? "200px" : "auto",
              overflowY:
                sideBaarData?.brands?.length > 10 ? "scroll" : "visible",
            }}
          >
            {sideBaarData?.brands
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((e, index) => {
                return (
                  <div className="d-flex justify-content-between gap-3 mb-1">
                    <div
                      key={`${e.name + "13af23j64sdfjkh" + index}`}
                      className="d-flex flex-row justify-content-start gap-2 align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          id={e.name}
                          checked={filters.brand_id.includes(e.id)}
                          onChange={(event) =>
                            helper("brand_id", e.id, event.target.checked)
                          }
                          style={{ height: "1rem", width: "1rem" }}
                        />
                      </div>

                      <div>
                        <label className="small pointer" htmlFor={e.name}>
                          {e.name}
                        </label>
                      </div>
                      <div className="text-lighter small-text font-400">
                        {`(${e.count})`}
                      </div>
                    </div>
                    {e?.discount_percentage && (
                      <div
                        className={`rounded-pill px-2 text-white d-flex align-items-center ${
                          e?.discount_percentage <= 74 && "blue-badge"
                        }  ${
                          e?.discount_percentage >= 75 && "purple-badge"
                        } discount-badge`}
                      >
                        <p className="p-0 m-0">{e?.discount_percentage}% off</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </SideBaarAccordion>
        <SideBaarAccordion
          heading={"PRICE RANGE"}
          counter={`${filters.min_price} - ${filters.max_price}`}
          openAcc={filters.min_price > 0}
        >
          <div className="side-baar-select">
            <div className="row">
              <div className="form-group pe-1 col-6">
                <input
                  name="min_price"
                  min={0}
                  value={filters?.min_price}
                  onChange={(e) =>
                    changeFilter(
                      e.target.value > 0 ? e.target.value : "",
                      "min_price"
                    )
                  }
                  className="price-range-input ps-2"
                  placeholder="min price"
                  type="number"
                />
              </div>
              <div className="form-group ps-1 col-6">
                <input
                  name="max_price"
                  min={0}
                  value={filters?.max_price}
                  onChange={(e) =>
                    changeFilter(
                      e.target.value > 0 ? e.target.value : "",
                      "max_price"
                    )
                  }
                  className="price-range-input ps-2"
                  placeholder="max price"
                  type="number"
                />
              </div>
            </div>
          </div>
          {/* certifications */}
        </SideBaarAccordion>
        <SideBaarAccordion
          heading={"CERTIFICATION"}
          counter={sideBaarData?.certifications.length}
          openAcc={filters.certification_id.length > 0}
        >
          <div
            className="side-baar-select"
            style={{
              maxHeight:
                sideBaarData?.certifications?.length > 10 ? "200px" : "auto",
              overflowY:
                sideBaarData?.certifications?.length > 10
                  ? "scroll"
                  : "visible",
            }}
          >
            {sideBaarData?.certifications
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((e, index) => {
                return (
                  <div
                    key={`${e.name + "13aj64sdfjkh" + index}`}
                    className="d-flex flex-row-reverse justify-content-end gap-2 align-items-center"
                  >
                    <div className="text-lighter small-text font-400">
                      {`(${e.count})`}
                    </div>
                    <div>
                      <label className="small pointer" htmlFor={e.name}>
                        {e.name}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={e.name}
                        checked={filters.certification_id.includes(e.id)}
                        onChange={(event) =>
                          helper("certification_id", e.id, event.target.checked)
                        }
                        style={{ height: "1rem", width: "1rem" }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </SideBaarAccordion>
        <SideBaarAccordion
          heading={"AVAILABILITY"}
          openAcc={filters.available_product}
        >
          <div className="d-flex flex-row-reverse justify-content-end gap-2 align-items-center">
            <div>
              <label className="small pointer" htmlFor="checkme">
                Check Me
              </label>
            </div>
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                id="checkme"
                checked={filters?.available_product}
                onChange={(e) =>
                  changeFilter(e.target.checked, "available_product")
                }
                style={{ height: "1rem", width: "1rem" }}
              />
            </div>
          </div>
        </SideBaarAccordion>
        <SideBaarAccordion
          heading={"CATEGORY"}
          counter={sideBaarData?.categories?.length}
          openAcc={filters.category_id.length > 0}
        >
          <div
            className="side-baar-select"
            style={{
              maxHeight:
                sideBaarData?.categories?.length > 10 ? "200px" : "auto",
              overflowY:
                sideBaarData?.categories?.length > 10 ? "scroll" : "visible",
            }}
          >
            {sideBaarData?.categories
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((e, index) => {
                return (
                  <div className="d-flex justify-content-between gap-3 mb-1">
                    <div
                      key={`${e.name + "13af23j64sdfjkh" + index}`}
                      className="d-flex flex-row justify-content-start gap-2 align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          checked={filters.category_id.includes(e.id)}
                          id={e.name}
                          onChange={(event) =>
                            helper("category_id", e.id, event.target.checked)
                          }
                          style={{ height: "1rem", width: "1rem" }}
                        />
                      </div>

                      <div>
                        <label className="small pointer" htmlFor={e.name}>
                          {e.name}
                        </label>
                      </div>
                      <div className="text-lighter small-text font-400">
                        {`(${e.count})`}
                      </div>
                    </div>
                    {e?.discount_percentage && (
                      <div
                        className={`rounded-pill px-2 text-white d-flex align-items-center ${
                          e?.discount_percentage <= 74 && "blue-badge"
                        }  ${
                          e?.discount_percentage >= 75 && "purple-badge"
                        } discount-badge`}
                      >
                        <p className="p-0 m-0">{e?.discount_percentage}% off</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </SideBaarAccordion>
        <SideBaarAccordion
          heading={"COMPANY"}
          counter={sideBaarData?.companies?.length}
          openAcc={filters.company.length > 0}
        >
          <div
            className="side-baar-select"
            style={{
              maxHeight:
                sideBaarData?.companies?.length > 10 ? "200px" : "auto",
              overflowY:
                sideBaarData?.companies?.length > 10 ? "scroll" : "visible",
            }}
          >
            {sideBaarData?.companies
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((e, index) => {
                return (
                  <div
                    key={`${e.name + "13aj6gd4sdfjkh" + index}`}
                    className="d-flex flex-row-reverse justify-content-end gap-2 align-items-center"
                  >
                    <div className="text-lighter small-text font-400">
                      {`(${e.count})`}
                    </div>
                    <div>
                      <label className="small pointer" htmlFor={e.name}>
                        {e.name}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={e.name}
                        checked={filters.company.includes(e.name)}
                        onChange={(event) =>
                          helper("company", e.name, event.target.checked)
                        }
                        style={{ height: "1rem", width: "1rem" }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </SideBaarAccordion>
        <SideBaarAccordion
          heading={"PRODUCT CLASS"}
          counter={sideBaarData?.productClass?.length}
          openAcc={filters.product_class.length > 0}
        >
          <div
            className="side-baar-select"
            style={{
              maxHeight:
                sideBaarData?.productClass?.length > 10 ? "200px" : "auto",
              overflowY:
                sideBaarData?.productClass?.length > 10 ? "scroll" : "visible",
            }}
          >
            {sideBaarData?.productClass
              ?.sort((a, b) => a.productClass.localeCompare(b.productClass))
              .map((e, index) => {
                return (
                  <div
                    key={`${e.productClass + "13aj6gd4sdfjkh" + index}`}
                    className="d-flex flex-row-reverse justify-content-end gap-2 align-items-center"
                  >
                    <div className="text-lighter small-text font-400">
                      {`(${e.count})`}
                    </div>
                    <div>
                      <label className="small pointer" htmlFor={e.productClass}>
                        {e.productClass}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={e.productClass}
                        checked={filters.product_class.includes(e.productClass)}
                        onChange={(event) =>
                          helper(
                            "product_class",
                            e.productClass,
                            event.target.checked
                          )
                        }
                        style={{ height: "1rem", width: "1rem" }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </SideBaarAccordion>
        <SideBaarAccordion
          heading={"PRODUCT USE STATUS"}
          counter={sideBaarData?.productUseStatus?.length}
          openAcc={filters.product_use_status.length > 0}
        >
          <div
            className="side-baar-select"
            style={{
              maxHeight:
                sideBaarData?.productUseStatus?.length > 10 ? "200px" : "auto",
              overflowY:
                sideBaarData?.productUseStatus?.length > 10
                  ? "scroll"
                  : "visible",
            }}
          >
            {sideBaarData?.productUseStatus
              ?.sort((a, b) => a.numberOfUses.localeCompare(b.numberOfUses))
              .map((e, index) => {
                return (
                  <div
                    key={`${e.productUseStatus + "13aj6gd4sdfjkh" + index}`}
                    className="d-flex flex-row-reverse justify-content-end gap-2 align-items-center"
                  >
                    <div className="text-lighter small-text font-400">
                      {`(${e.count})`}
                    </div>
                    <div>
                      <label className="small pointer" htmlFor={e.numberOfUses}>
                        {e.numberOfUses}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={e.numberOfUses}
                        checked={filters.product_use_status.includes(
                          e.numberOfUses
                        )}
                        onChange={(event) =>
                          helper(
                            "product_use_status",
                            e.numberOfUses,
                            event.target.checked
                          )
                        }
                        style={{ height: "1rem", width: "1rem" }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </SideBaarAccordion>
        <SideBaarAccordion
          heading={"PRODUCT CONDITION"}
          counter={sideBaarData?.productCondition?.length}
          openAcc={filters.product_condition.length > 0}
        >
          <div
            className="side-baar-select"
            style={{
              maxHeight:
                sideBaarData?.productCondition?.length > 10 ? "200px" : "auto",
              overflowY:
                sideBaarData?.productCondition?.length > 10
                  ? "scroll"
                  : "visible",
            }}
          >
            {sideBaarData?.productCondition
              ?.sort((a, b) =>
                a.productCondition.localeCompare(b.productCondition)
              )
              .map((e, index) => {
                return (
                  <div
                    key={`${e.productCondition + "13aj6gd4sdfjkh" + index}`}
                    className="d-flex flex-row-reverse justify-content-end gap-2 align-items-center"
                  >
                    <div className="text-lighter small-text font-400">
                      {`(${e.count})`}
                    </div>
                    <div>
                      <label
                        className="small pointer"
                        htmlFor={e.productCondition}
                      >
                        {e.productCondition}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={e.productCondition}
                        checked={filters.product_condition.includes(
                          e.productCondition
                        )}
                        onChange={(event) =>
                          helper(
                            "product_condition",
                            e.productCondition,
                            event.target.checked
                          )
                        }
                        style={{ height: "1rem", width: "1rem" }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </SideBaarAccordion>
        <SideBaarAccordion
          heading={"WARRANTY PERIOD"}
          counter={sideBaarData?.warrantyPeriod?.length}
          openAcc={filters.warranty_period.length > 0}
        >
          <div
            className="side-baar-select"
            style={{
              maxHeight:
                sideBaarData?.warrantyPeriod?.length > 10 ? "200px" : "auto",
              overflowY:
                sideBaarData?.warrantyPeriod?.length > 10
                  ? "scroll"
                  : "visible",
            }}
          >
            {sideBaarData?.warrantyPeriod
              ?.sort((a, b) =>
                a?.warrantyPeriod?.localeCompare(b?.warrantyPeriod)
              )
              .map((e, index) => {
                return (
                  <div
                    key={`${e.warrantyPeriod + "13aj6gd4sdfjkh" + index}`}
                    className="d-flex flex-row-reverse justify-content-end gap-2 align-items-center"
                  >
                    <div className="text-lighter small-text font-400">
                      {`(${e.count})`}
                    </div>
                    <div>
                      <label
                        className="small pointer"
                        htmlFor={e.warrantyPeriod}
                      >
                        {e.warrantyPeriod}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={e.warrantyPeriod}
                        checked={filters.warranty_period.includes(
                          e.warrantyPeriod
                        )}
                        onChange={(event) =>
                          helper(
                            "warranty_period",
                            e.warrantyPeriod,
                            event.target.checked
                          )
                        }
                        style={{ height: "1rem", width: "1rem" }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </SideBaarAccordion>
      </div>
    </>
  );
}
function SideBaarAccordion({ heading, children, counter = null, openAcc }) {
  const [height, setHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      setHeight(() => {
        return ref.current.scrollHeight;
      });
    }
  }, [ref.current, children]);

  useEffect(() => {
    if (openAcc) {
      setOpen(true);
      setShow(true);
    } else {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (show === false) {
      setOpen(false);
    }
  }, [show, setShow]);

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className="d-flex pointer mt-3 mb-2 justify-content-between align-items-center"
      >
        <p className="small font-500 mb-0">
          {heading}
          {counter && (
            <span className="text-lighter small font-400"> ({counter})</span>
          )}
        </p>
        <span
          className={`${
            show ? "rotated-icon" : ""
          } fa-solid fa-caret-right text-lighter`}
        ></span>
      </div>
      <div
        ref={ref}
        style={{ height: show || open ? height : 0 }}
        className="sidbaar-accordion-body"
      >
        {children}
      </div>
    </>
  );
}
const ProductsContainer = forwardRef(
  ({
    products = [],
    filters,
    setPage,
    setCompareCounter,
    categoryData,
    brandData,
  }) => {
    const ref2 = useRef(); // For filters reference
    const ref = useRef(); // For scroll container reference
    const ref1 = useRef(); // Timeout reference for debouncing
    const [height, setHeight] = useState("auto");

    function handleScroll() {
      clearTimeout(ref1.current);

      let scrollTop = ref.current.scrollTop;
      let clientHeight = ref.current.clientHeight;
      let scrollHeight = ref.current.scrollHeight;

      // Calculate if we are close to the bottom of the container
      if (scrollTop + clientHeight + 1 >= scrollHeight) {
        ref1.current = setTimeout(() => {
          setPage((prevPage) => prevPage + 1); // Trigger pagination
        }, 500); // Add some debounce time
      }
    }

    // Use Effect to handle dynamic filter changes
    useEffect(() => {
      ref2.current = filters; // Update filters when changed
    }, [filters]);

    // Use Effect to attach scroll event listener to the container
    useEffect(() => {
      let container = ref.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
      }

      // Clean up event listener on component unmount
      return () => {
        if (container) {
          container.removeEventListener("scroll", handleScroll);
        }
      };
    }, [ref.current, products]);

    return (
      <>
        <div>
          <div
            ref={ref}
            className="pe-1 scrollable position-relative"
            id="products-container"
            style={{
              height:
                height === "auto"
                  ? "auto"
                  : (products.length < 6
                      ? height * (products.length + 0.5)
                      : height * 6 - height / 4) + "px", // Dynamically calculate height
              overflow: "auto",
            }}
          >
            {products?.map((e, index) => (
              <Product
                setHeight={setHeight} // Pass setHeight to adjust dynamically
                index={index}
                data={e}
                key={`0,82w${index}jkad`}
                setCompareCounter={setCompareCounter}
                categoryData={categoryData}
                brandData={brandData}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
);
const ProductsContainer2 = forwardRef(
  ({
    counter,
    products = [],
    filters,
    setPage,
    filters1,
    setCompareCounter,
    categoryData,
    brandData,
  }) => {
    const ref = useRef();
    const ref2 = useRef(); // For filters reference
    const ref1 = useRef(); // Timeout reference for debouncing
    const [height, setHeight] = useState("auto");
    const [isAtTop, setIsAtTop] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(false);

    function helper() {
      clearTimeout(ref1.current);

      if (ref.current) {
        const { scrollTop, scrollHeight, clientHeight } = ref.current;

        // Check if user has scrolled to the bottom
        if (scrollTop + clientHeight >= scrollHeight - 1) {
          ref1.current = setTimeout(() => {
            setPage((prev) => prev + 1);
          }, 300); // Reduced debounce time for better response
        }
      }
    }

    // Update ref2 when filters change
    useEffect(() => {
      ref2.current = filters;
    }, [filters]);

    // Attach scroll event to trigger helper function
    useEffect(() => {
      if (ref.current) {
        ref.current.addEventListener("scroll", helper);
      }

      return () => {
        if (ref.current) {
          ref.current.removeEventListener("scroll", helper);
        }
      };
    }, [ref.current, products, filters, filters1]);

    // Scroll up by one card
    const handleUp = () => {
      if (ref.current) {
        const scrollAmount =
          products.length < 1 ? height * products.length : height;
        ref.current.scrollBy({
          top: -scrollAmount,
          behavior: "smooth",
        });
      }
    };

    // Scroll down by one card
    const handleDown = () => {
      if (ref.current) {
        const scrollAmount =
          products.length < 1 ? height * products.length : height;
        ref.current.scrollBy({
          top: scrollAmount,
          behavior: "smooth",
        });
      }
    };

    // Handle scroll to check if we are at the top or bottom
    let prevScrollTop = 0; // Track previous scroll position

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;

      setIsAtTop(scrollTop === 0); // Set isAtTop based on current scroll position

      // Detect scroll direction
      const isScrollingDown = scrollTop > prevScrollTop;

      // Update the previous scroll position
      prevScrollTop = scrollTop;

      if (scrollTop == 0) {
        setIsAtBottom(false);
      }

      // If scrolling up, set isAtBottom to false
      if (!isScrollingDown) {
        setIsAtBottom(false);
      }

      // Only check if you're at the bottom when all products are loaded
      if (products.length === counter) {
        if (scrollTop + clientHeight >= scrollHeight - 1 && isScrollingDown) {
          setIsAtBottom(true);
        }
      }
    };

    useEffect(() => {
      if (ref.current) {
        ref.current.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (ref.current) {
          ref.current.removeEventListener("scroll", handleScroll);
        }
      };
    }, [products, height, filters1, filters]);

    useEffect(() => {
      ref?.current?.scrollTo({
        top: 0,
        behavior: "smooth", // This makes the scroll smooth
      });
    }, [filters, filters1]);

    return (
      <>
        {/* Pagination buttons */}
        <div className="d-none position-absolute d-xl-flex flex-column align-items-center gap-2 w-auto p-0 pagination-btn">
          <button
            disabled={isAtTop}
            className="btn rounded-circle bg-primary arrow-btn"
            onClick={handleUp}
          >
            <span className="fa-solid fa-arrow-up text-light arrow-size"></span>
          </button>
          <button
            disabled={isAtBottom}
            className="btn rounded-circle bg-primary arrow-btn"
            onClick={handleDown}
          >
            <span className="fa-solid fa-arrow-down text-light arrow-size"></span>
          </button>
        </div>

        {/* Products container */}
        <div className="">
          <div
            ref={ref}
            className="pe-1 scrollable position-relative"
            id="products-container"
            style={{
              height:
                height === "auto"
                  ? "auto"
                  : (products.length < 6
                      ? height * (products.length + 0.5)
                      : height * 6 - height / 4) + "px",
              overflow: "auto",
            }}
          >
            {products?.map((e, index) => (
              <Product
                product={products}
                setHeight={setHeight}
                index={index}
                data={e}
                key={`0,82w${index}jkad`}
                setCompareCounter={setCompareCounter}
                categoryData={categoryData}
                brandData={brandData}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
);

const ShareComponent = ({ id }) => {
  // Dynamic URL to include product ID
  const shareUrl = `https://macromed.com.pk/details/${id}`;
  const title = "Check out this awesome product!";

  // Email body content with dynamic URL
  const emailBody = `Check out this awesome product: ${shareUrl}`;

  return (
    <div
      style={{ display: "flex", gap: "10px", zIndex: "99" }}
      className="bg-white shadow py-3 px-4 rounded-pill"
    >
      {/* Facebook Share Button */}
      <FacebookShareButton url={shareUrl} quote={title}>
        <FacebookIcon size={28} round />
      </FacebookShareButton>

      {/* WhatsApp Share Button */}
      <WhatsappShareButton url={shareUrl} title={title} separator=" - ">
        <WhatsappIcon size={28} round />
      </WhatsappShareButton>

      {/* Email Share Button */}
      <EmailShareButton subject={title} body={emailBody}>
        <EmailIcon size={28} round />
      </EmailShareButton>
    </div>
  );
};

export { Product };
