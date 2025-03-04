import React, {
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  useContext,
} from "react";
import LoadingComponent from "../../components/LaodingComponent";
import "./productDetails.css";
import { Slider } from "../home/Home";
import info_btn from "../../assets/info-btn.png";
import shareIcon from "../../assets/share-icon.png";
import cart_2 from "../../assets/cart-2.png";
import heart from "../../assets/heart-icon.png";
import heart2 from "../../assets/heart2.png";
import navigation from "../../assets/navigation-icon.png";
import compare from "../../assets/compare.png";
import picture from "../../assets/picture.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/cartSlices";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import { WishlistContext } from "../../Context/WishlistContext";
export default function ProductDetail() {
  const { userData } = useSelector((state) => {
    return state?.user;
  });
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState(0);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [productDetail, setProductDetail] = useState({});
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [height, setHeight] = useState("auto");
  const [opacity, setOpacity] = useState(1);
  const [discountOnCategory, setDiscountOnCategory] = useState(null);
  const [discountOnBrand, setDiscountOnBrand] = useState(null);
  const [check, setCheck] = useState(false);
  const [comapreCounter, setCompareCounter] = useState(0);
  const id = productDetail?.productDetails?.id;
  const [zoomStyle, setZoomStyle] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const { login } = useSelector((state) => state.user);

  const handleMouseEnter = () => {
    clearInterval(intervalId);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
    setIsHovered(false);
    startImageInterval(currentImage); // Pass the current image index to continue from the correct order
  };

  const startImageInterval = (startIndex = 0) => {
    const id = setInterval(() => {
      if (!isHovered) {
        // Check if the image is not hovered
        setOpacity(0); // Set opacity to 0 to trigger fade-out
        setTimeout(() => {
          setCurrentImage((pre) => {
            let nextImageIndex =
              (pre + 1) % productDetail.productDetails.product_images.length;
            return nextImageIndex;
          });
          setOpacity(1); // Set opacity to 1 to trigger fade-in
        }, 900); // Match this duration with the CSS transition duration
      }
    }, 3600);
    setIntervalId(id);
    setCurrentImage(startIndex); // Ensure the interval starts from the correct image index
  };

  useEffect(() => {
    setLoading(true);
    const discountGetting = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}api/getCategoryBrand`)
        .then((res) => {
          setBrand(res?.data?.brands);
          setCategory(res?.data?.categories);
          setLoading(false);
        })
        .catch((err) => {});
    };

    discountGetting();
  }, []);
  async function getProductDetail() {
    try {
      setLoading(true);
      let response = await axios.get(
        `${process.env.REACT_APP_API_URL}api/getProductdetails/${params.id}`
      );
      setProductDetail(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (category || productDetail?.productDetails?.product_category) {
      // Find the first category with a discount
      const discountedCategory = category.find((categoryItem) =>
        productDetail?.productDetails?.product_category.some(
          (productCategoryItem) =>
            productCategoryItem.category_id === categoryItem.id &&
            categoryItem.discount_percentage
        )
      );

      if (discountedCategory) {
        setDiscountOnCategory(discountedCategory); // Set the entire discounted category object
      } else {
        setDiscountOnCategory(null); // Clear discount if no category has a discount
      }
    }
  }, [category, loading, setCategory, productDetail]);

  useEffect(() => {
    if (brand || productDetail?.productDetails?.product_brands) {
      const discountedBrand = brand.find((brandItem) =>
        productDetail?.productDetails?.product_brands?.some(
          (productBrand) =>
            productBrand.brand_id === brandItem.id &&
            brandItem.discount_percentage // Checks for a non-null discount
        )
      );
      if (discountedBrand) {
        setDiscountOnBrand(discountedBrand); // Store the discounted brand object
      } else {
        setDiscountOnBrand(null); // Clear if no matching brand with discount is found
      }
    }
  }, [brand, loading, setBrand, productDetail]);

  const ref = useRef();
  useEffect(() => {
    getProductDetail();
  }, [params]);

  function helper() {
    if (ref.current) {
      setHeight(ref.current.offsetWidth); // Set height to the current width
    }
  }

  useEffect(() => {
    helper();
  }, [ref.current]);

  useEffect(() => {
    window.addEventListener("resize", helper);
    helper();

    return () => {
      window.removeEventListener("resize", helper);
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  useEffect(() => {
    if (productDetail?.productDetails?.product_images?.length && !isHovered) {
      startImageInterval(currentImage); // Pass the current image index to continue from the correct order
    }

    return () => clearInterval(intervalId);
  }, [productDetail, isHovered]);

  const brandDiscount = discountOnBrand?.discount_percentage
    ? Number(discountOnBrand?.discount_percentage)
    : 0;
  const categoryDiscount = discountOnCategory?.discount_percentage
    ? Number(discountOnCategory?.discount_percentage)
    : 0;

  const productDiscount = productDetail?.productDetails?.discount_percentage
    ? Number(productDetail?.productDetails?.discount_percentage)
    : 0;

  const discountPercentage = Math.max(
    brandDiscount,
    categoryDiscount,
    productDiscount
  );
  const badgeClass = discountPercentage >= 75 ? "purple-badge" : "blue-badge";
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
        toast.success("Added to compare list");
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

  const downloadPdf = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}${productDetail?.productDetails?.pdf}`,
      "_blank"
    );
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxVisibleImages, setMaxVisibleImages] = useState(3); // Default for larger screens

  const images = productDetail?.productDetails?.product_images || [];

  useEffect(() => {
    const updateMaxVisibleImages = () => {
      if (window.innerWidth <= 768) {
        setMaxVisibleImages(2);
      } else {
        setMaxVisibleImages(3);
      }
    };

    updateMaxVisibleImages(); // Set initial value
    window.addEventListener("resize", updateMaxVisibleImages);

    return () => {
      window.removeEventListener("resize", updateMaxVisibleImages);
    };
  }, []);

  const handleUpClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleDownClick = () => {
    if (currentIndex + maxVisibleImages < images.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    if (share === id) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [share, id]);

  if (loading) return <LoadingComponent />;
  return (
    <div className="container-fluid tables mb-5 px-3 px-md-4">
      <div className="product-detail">
        <div className="sm-img-contaner d-flex flex-column ">
          <div className="vertical-carousel">
            <button
              className="carousel-button"
              onClick={handleUpClick}
              disabled={currentIndex === 0}
            >
              <span class="fa-solid fa-angle-up"></span>
            </button>

            <div className="carousel-images">
              {images
                .slice(currentIndex, currentIndex + maxVisibleImages)
                .map((image, index) => (
                  <div
                    key={`${index}+ajdf80`}
                    onClick={() => setCurrentImage(index + currentIndex)}
                    className="sm-img-card p-2 pointer p-md-3 p-lg-2"
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}${image?.image}`}
                      alt={`Image ${index}`}
                      className="carousel-image"
                    />
                  </div>
                ))}
            </div>

            <button
              className="carousel-button"
              onClick={handleDownClick}
              disabled={currentIndex + maxVisibleImages >= images.length}
            >
              <span class="fa-solid fa-angle-down"></span>
            </button>
          </div>
        </div>
        <div
          ref={ref}
          style={{ height: height == "auto" ? "auto" : height + "px" }}
          className="p-2 detail-img-container overflow-hidden position-relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {discountPercentage > 0 && (
            <div
              className={`discount-badge-product shadow position-absolute py-1 d-flex align-items-center justify-content-center ${badgeClass}`}
            >
              <p
                style={{ fontSize: "0.8rem" }}
                className="m-0 p-0 text-center text-white"
              >
                <strong>-{discountPercentage}%</strong> off
              </p>
            </div>
          )}
          <img
            style={{
              height: "100%",
              width: "100%",
              opacity: opacity,
              transition: "opacity 0.9s ease-in-out",
              transform: isHovered ? "scale(1.8)" : "scale(1)", // Add zoom effect
              ...zoomStyle,
            }}
            className="detail-img zoom-effect"
            src={
              process.env.REACT_APP_API_URL +
              productDetail?.productDetails?.product_images[currentImage]?.image
            }
            alt=""
          />
        </div>
        <div className="product-detail-info">
          <div>
            <h4>
              {productDetail?.productDetails?.product_name} -{" "}
              {productDetail?.productDetails?.product_code}
            </h4>
            <div className="pe-xl-5">
              <div className="d-flex mb-2 mb-sm-3 justify-content-between">
                <h6 className="mb-0">Features</h6>
              </div>

              <div className="detail-content pe-xl-5">
                <div className="d-flex mb-2 mb-sm-3 ">
                  <h6 className="small col-5 col-sm-4  col-lg-6 text-lighter mb-0">
                    Product HTS Code
                  </h6>
                  <h6 className="small mb-0">
                    {productDetail?.productDetails?.product_hts}
                  </h6>
                </div>
                <div className="d-flex mb-2 mb-sm-3 ">
                  <h6 className="small col-5 col-sm-4  col-lg-6 text-lighter mb-0">
                    No. Of Variants
                  </h6>
                  <h6 className="small mb-0">
                    {productDetail?.productVariants?.length}
                  </h6>
                </div>
                <div className="d-flex mb-2 mb-sm-3 ">
                  <h6 className="small col-5 col-sm-4  col-lg-6 mb-0 text-lighter">
                    Country
                  </h6>
                  <h6 className="small  mb-0">
                    {productDetail?.productDetails?.country}
                  </h6>
                </div>
                <div className="d-flex mb-2 mb-sm-3">
                  <h6 className="small col-5 col-sm-4 col-lg-6 mb-0 text-lighter">
                    Brand
                  </h6>
                  <h6 className="small  mb-0">
                    {productDetail?.productDetails?.product_brands
                      ?.map((e) => {
                        return e?.brands?.name;
                      })
                      .join(", ")}
                  </h6>
                </div>
                <div className="d-flex mb-2 mb-sm-3">
                  <h6 className="small col-5 col-sm-4  col-lg-6 mb-0 text-lighter">
                    Strerilization
                  </h6>
                  <h6 className="small mb-0">
                    {productDetail?.productDetails?.sterilizations}
                  </h6>
                </div>
                <div className="d-flex mb-2 mb-sm-3">
                  <h6 className="small col-5 col-sm-4  col-lg-6 mb-0 text-lighter">
                    No Of Use
                  </h6>
                  <h6 className="small  mb-0">
                    {productDetail?.productDetails?.product_use_status}
                  </h6>
                </div>
                <div className="d-flex mb-2 mb-sm-3">
                  <h6 className="small col-5 col-sm-4 col-lg-6 mb-0 text-lighter">
                    Company
                  </h6>
                  <h6 className="small mb-0">
                    {productDetail?.productDetails?.company}
                  </h6>
                </div>
                <div className="d-flex mb-2 mb-sm-3">
                  <h6 className="small col-5 col-sm-4  col-lg-6 mb-0 text-lighter">
                    Certificate
                  </h6>
                  <h6 className="small mb-0">
                    {productDetail?.productDetails?.product_certifications
                      ?.map((e) => {
                        return e?.certification?.name;
                      })
                      .join(", ")}
                  </h6>
                </div>
              </div>
              {productDetail?.productDetails?.pdf && (
                <div className="mt-5 download-image">
                  <button
                    onClick={downloadPdf}
                    className="d-flex align-items-center gap-2 btn p-0"
                  >
                    <span class="fa-solid fa-file-lines"></span>
                    <h6 className="mb-0">Download PDF</h6>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-lg px-0">
        <div className="model-table mt-5 position-relative">
          <h2 className="text-sm-center text-theme font-500">
            Select Your Model
          </h2>
          <div className="d-flex gap-4 share-pointers">
            <div
              style={{ top: "-20px" }}
              ref={optionRef}
              className={`position-absolute showcase-styling ${
                isActive ? "active" : ""
              }`}
            >
              <ShareComponent id={id} />
            </div>
            <span onClick={() => toggleOption(id)} className="pointer">
              <img src={shareIcon} alt="" />
            </span>
            <span onClick={handleNavigateClick} className="pointer">
              <img
                style={{ height: `${isInStorage ? "20px" : "20px"}` }}
                src={isInStorage ? compare : navigation}
                alt=""
              />
            </span>
            <span className="pointer">
              <img
                style={{ height: "20px" }}
                onClick={addToWishlist}
                src={
                  data.some((product) => product.product_id == id)
                    ? heart2
                    : heart
                }
                alt=""
              />
            </span>
          </div>
        </div>
        <div className="table-container scrollbar">
          <table className="table">
            <tr className="table-header">
              <th>
                <div className="white-space px-2">SKU</div>
              </th>
              <th>
                <div className="white-space ps-2 pe-5 model-description">
                  Detail Description of Model
                </div>
              </th>
              <th>
                <div className="white-space px-2">Packing</div>
              </th>
              <th>
                <div className="white-space px-2">Unit</div>
              </th>
              <th>
                <div className="white-space px-2">Status</div>
              </th>
              <th>
                <div className="white-space px-2">Price/Unit</div>
              </th>
              <th>
                <div className="white-space px-2">Qty(Unit)</div>
              </th>
              <th>
                <div className="white-space px-2">Total Price</div>
              </th>
              <th>
                <div className="white-space px-2">Add to Cart</div>
              </th>
            </tr>
            {productDetail?.productVariants?.length > 0 ? (
              productDetail?.productVariants?.map((e, index) => {
                return (
                  <TableRow
                    categoryDiscount={categoryDiscount}
                    brandDiscount={brandDiscount}
                    productDiscount={productDiscount}
                    discount={discountPercentage}
                    variant_id={e.id}
                    {...e}
                    id={productDetail?.productDetails?.id}
                    thumbnail={productDetail?.productDetails?.thumbnail_image}
                    productName={productDetail?.productDetails?.product_name}
                    dispatch={dispatch}
                    key={`${index}adf73mb.`}
                    userId={userData?.id} // Pass userId to TableRow
                  />
                );
              })
            ) : (
              <tr className="d-table-row w-100 py-2 mt-3 border-1 text-center small">
                <td colSpan="100%">
                  {" "}
                  {/* Ensure the text spans all columns */}
                  <p className="text-center mb-0 text-grey2">
                    No variants available
                  </p>
                </td>
              </tr>
            )}
          </table>
        </div>
        <Tabs productDetails={productDetail?.productDetails} />
      </div>
      <h3 className="font-600 mt-4 mb-4">Related Products</h3>
      <Slider
        categoryData={category}
        brandData={brand}
        feature={true}
        featureProducts={
          productDetail?.relatedProducts ? productDetail?.relatedProducts : []
        }
      />
    </div>
  );
}

function TableRow(props) {
  const [cartCounter, setCartCounter] = useState(0);
  const cart = useSelector((state) => state.cart[props.userId] || []);
  const [variantData, setVariantData] = useState();

  useEffect(() => {
    const product = cart.find((e) => e.id === props.id);
    let variantCounter = 0;

    if (product) {
      const variant = product.variants.find((v) => v.s_k_u === props?.s_k_u);
      setVariantData(variant);
      if (variant) {
        variantCounter = variant.count; // Get the count of the found variant
      }
    }

    setCartCounter(variantCounter); // Update the cartCounter state
  }, [cart, props.id, props.s_k_u]);

  const dispatch = useDispatch();
  const params = useParams();
  const [count, setCount] = useState(0);
  const [height, setHeight] = useState("auto");
  const [show, setShow] = useState(false);
  const ref = useRef();

  const discount = props.discount;
  let productDiscount = props.productDiscount;
  let brandDiscount = props.brandDiscount;
  let categoryDiscount = props.categoryDiscount;

  const maxDiscount = Math.max(
    productDiscount,
    brandDiscount,
    categoryDiscount
  );

  if (productDiscount === maxDiscount && productDiscount === discount) {
    brandDiscount = 0;
    categoryDiscount = 0;
  } else if (brandDiscount === maxDiscount && brandDiscount === discount) {
    productDiscount = 0;
    categoryDiscount = 0;
  } else if (
    categoryDiscount === maxDiscount &&
    categoryDiscount === discount
  ) {
    productDiscount = 0;
    brandDiscount = 0;
  }

  function helper() {
    if (window.innerWidth < 576) {
      setShow(!show);
    }
  }

  const { login } = useSelector((state) => state.user);

  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }, [params.id]);

  console.log(props);

  return (
    <tr className="table-row">
      <td>
        <div
          style={{ height: height == "auto" ? "auto" : height + "px" }}
          className="white-space py-1 d-flex small font-500 small px-2 align-items-center"
        >
          {props?.s_k_u}
        </div>
      </td>
      <td>
        <div
          ref={ref}
          style={{ height: height == "auto" ? "auto" : height + "px" }}
          className="model-description position-relative py-3 ps-2 pe-5"
        >
          <span
            className="small sent-description"
            dangerouslySetInnerHTML={{ __html: props.description }}
          />
          <span
            className="info-btn"
            onClick={helper}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            <img src={info_btn} className="w-100 info-btn pointer" alt="" />
          </span>
          {show && (
            <div className="m-0 tool-tip small">
              <div className="m-0 border-0 small position-relative d-flex justify-content-between">
                <div className="border-0 m-0 d-flex align-items-center px-1 col-6 small overflow-hidden">
                  <p className="m-0">{props.tooltip_information}</p>
                </div>
                <div className="border-0 m-0 col-6">
                  {props?.image ? (
                    <img
                      src={
                        process.env.REACT_APP_API_URL +
                        "/public/admin/assets/images/products/" +
                        props?.image
                      }
                      alt=""
                      className="w-100 h-100"
                    />
                  ) : (
                    <img
                      src={
                        process.env.REACT_APP_API_URL +
                        "public/admin/assets/images/products/product.png"
                      }
                      alt=""
                      className="w-100 h-100"
                    />
                  )}
                </div>
                <span className="tip"></span>
              </div>
            </div>
          )}
        </div>
      </td>
      <td>
        <div
          style={{ height: height == "auto" ? "auto" : height + "px" }}
          className="white-space py-1 px-2 small font-500 d-flex justify-content-center align-items-center"
        >
          {props?.packing}
        </div>
      </td>
      <td>
        <div
          style={{ height: height == "auto" ? "auto" : height + "px" }}
          className="white-space py-1 px-2 small font-500 d-flex justify-content-center align-items-center"
        >
          {props?.unit}
        </div>
      </td>
      <td>
        <div
          style={{ height: height == "auto" ? "auto" : height + "px" }}
          className="white-space py-1 px-2 small font-500 d-flex justify-content-center align-items-center"
        >
          {props?.remaining_quantity > 0 ? "In Stock" : "Out of Stock"}
        </div>
      </td>
      <td>
        {props.discount > 0 ? (
          <div
            style={{ height: height == "auto" ? "auto" : height + "px" }}
            className="white-space py-2 px-2 small font-500 d-flex flex-column justify-content-center align-items-center gap-1"
          >
            <p
              style={{ fontSize: "0.8rem" }}
              className="text-grey text-decoration-line-through m-0"
            >
              {props?.selling_price_per_unit_pkr?.toLocaleString("en-PK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="m-0 p-0">
              {(
                props.selling_price_per_unit_pkr *
                (1 - props.discount / 100)
              )?.toLocaleString("en-PK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        ) : (
          <div
            style={{ height: height == "auto" ? "auto" : height + "px" }}
            className="white-space py-1 px-2 small font-500 d-flex justify-content-center align-items-center"
          >
            {props?.selling_price_per_unit_pkr?.toLocaleString("en-PK", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        )}
      </td>
      <td>
        <div
          style={{ height: height == "auto" ? "auto" : height + "px" }}
          className="white-space py-1 px-2 small font-500 d-flex justify-content-center align-items-center"
        >
          <AddtoCart
            count={count}
            setCount={setCount}
            remaining_quantity={props.remaining_quantity}
          />
        </div>
      </td>
      <td>
        {props.discount > 0 && count > 0 ? (
          <div
            style={{ height: height == "auto" ? "auto" : height + "px" }}
            className="white-space py-1 px-2 small font-500 d-flex flex-column justify-content-center align-items-center gap-1"
          >
            <p
              style={{ fontSize: "0.8rem" }}
              className="text-decoration-line-through text-grey small p-0 m-0"
            >
              {(
                Number(count) * Number(props?.selling_price_per_unit_pkr)
              )?.toLocaleString("en-PK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="m-0 p-0">
              {count > 0
                ? (
                    Number(count) *
                    Number(props?.selling_price_per_unit_pkr) *
                    (1 - Number(props.discount) / 100)
                  )?.toLocaleString("en-PK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : 0}
            </p>
          </div>
        ) : (
          <div
            style={{ height: height == "auto" ? "auto" : height + "px" }}
            className="white-space py-1 px-2 small font-500 d-flex justify-content-center align-items-center"
          >
            {count > 0
              ? (
                  Number(count) * Number(props?.selling_price_per_unit_pkr)
                )?.toLocaleString("en-PK", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : 0}
          </div>
        )}
      </td>
      <td>
        <div
          style={{ height: height == "auto" ? "auto" : height + "px" }}
          className="white-space py-1 px-2 small font-500 d-flex justify-content-center align-items-center"
        >
          <button
            disabled={variantData?.count === props?.remaining_quantity}
            className="cart-2 border-0 bg-white"
          >
            <img
              src={cart_2}
              alt="carting"
              onClick={() => {
                if (login === false) {
                  toast.error("Login to add to cart");
                  return;
                }
                if (count > 0) {
                  toast.success("Variant added to cart successfully");
                  dispatch(
                    addToCart({
                      userId: props.userId,
                      discount: discount,
                      productDiscount: productDiscount,
                      brandDiscount: brandDiscount,
                      categoryDiscount: categoryDiscount,
                      productName: props.productName,
                      id: props.id,
                      image: props.thumbnail,
                      variant: {
                        variant_id: props.variant_id,
                        s_k_u: props.s_k_u,
                        selling_price_per_unit_pkr: Number(
                          props.selling_price_per_unit_pkr
                        ),
                        remaining_quantity: Number(props.remaining_quantity),
                        count: Number(count),
                        totalPrice: Number(
                          count * props?.selling_price_per_unit_pkr
                        ),
                      },
                    })
                  );
                } else {
                  toast.error("Add a variant");
                  return;
                }
              }}
            />
            <span className="cart-2-counter">{cartCounter}</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
function Tabs({ productDetails = {} }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [totalTabs, setTotalTabs] = useState(-1);
  function helper() {
    let count = 0;
    if (
      productDetails?.tab_1_heading !== "" &&
      productDetails?.tab_1_heading !== null
    )
      count++;
    if (
      productDetails?.tab_2_heading !== "" &&
      productDetails?.tab_2_heading !== null
    )
      count++;
    if (
      productDetails?.tab_3_heading !== "" &&
      productDetails?.tab_3_heading !== null
    )
      count++;
    if (
      productDetails?.tab_4_heading !== "" &&
      productDetails?.tab_4_heading !== null
    )
      count++;
    setTotalTabs(count);
  }

  useLayoutEffect(() => {
    helper();
  }, [productDetails]);
  return (
    <div className="mt-4 d-flex flex-column flex-sm-row flex-lg-column">
      {totalTabs > 0 && (
        <div className="tabs-baar flex-wrap  col-sm-4 col-md-3 col-lg-12 d-flex flex-sm-column flex-lg-row justify-content-lg-between">
          {productDetails?.tab_1_heading && (
            <h6
              onClick={() => {
                setCurrentTab(0);
              }}
              className={` ${
                currentTab == 0 && "active"
              } col-6 col-sm-12 col-lg-${
                12 / totalTabs
              }  text-theme-light py-lg-2 mb-lg-0 px-lg-4 pointer`}
            >
              {productDetails?.tab_1_heading}
            </h6>
          )}
          {productDetails?.tab_2_heading && (
            <h6
              onClick={() => {
                setCurrentTab(1);
              }}
              className={`${
                currentTab == 1 && "active"
              } col-6 col-sm-12  col-lg-${
                12 / totalTabs
              }  text-theme-light py-lg-2 mb-lg-0  px-lg-4 pointer`}
            >
              {productDetails?.tab_2_heading}
            </h6>
          )}
          {productDetails?.tab_3_heading && (
            <h6
              onClick={() => {
                setCurrentTab(2);
              }}
              className={`${
                currentTab == 2 && "active"
              }  col-6 col-sm-12 col-lg-${
                12 / totalTabs
              } text-theme-light py-lg-2 mb-lg-0 px-lg-4 pointer`}
            >
              {productDetails?.tab_3_heading}
            </h6>
          )}
          {productDetails?.tab_4_heading && (
            <h6
              onClick={() => {
                setCurrentTab(3);
              }}
              className={`${
                currentTab == 3 && "active"
              }  col-6 col-sm-12 col-lg-${
                12 / totalTabs
              } text-theme-light py-lg-2 mb-lg-0 px-lg-4 pointer`}
            >
              {productDetails?.tab_4_heading}
            </h6>
          )}
        </div>
      )}
      <div className="px-3 px-md-4 small text-grey2 py-3 tabs-text">
        <div>
          {currentTab === 0 && (
            <div
              dangerouslySetInnerHTML={{ __html: productDetails.tab_1_text }}
            />
          )}
          {currentTab === 1 && (
            <div
              dangerouslySetInnerHTML={{ __html: productDetails.tab_2_text }}
            />
          )}
          {currentTab === 2 && (
            <div
              dangerouslySetInnerHTML={{ __html: productDetails.tab_3_text }}
            />
          )}
          {currentTab === 3 && (
            <div
              dangerouslySetInnerHTML={{ __html: productDetails.tab_4_text }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AddtoCart({ count, setCount, remaining_quantity }) {
  return (
    <main className="d-flex table-addtocart gap-3">
      <button
        disabled={remaining_quantity == 0 || count == 0}
        className="minus-btn rounded-1 border-0 pointer"
        onClick={() => setCount((prev) => (prev > 0 ? prev - 1 : prev))}
      >
        <span className="fa-solid fa-minus"></span>
      </button>
      <span>{count}</span>
      <button
        disabled={remaining_quantity == 0 || count == remaining_quantity}
        className="plus-btn rounded-1 border-0 pointer"
        onClick={() => setCount((prev) => prev + 1)}
      >
        <span className="fa-solid fa-plus"></span>
      </button>
    </main>
  );
}

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
