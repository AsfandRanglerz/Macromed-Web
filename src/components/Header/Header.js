import { useContext, useEffect, useRef, useState } from "react";
import cart from "../../assets/cart.png";
import Logo from "../../assets/logo.png";
import heart2 from "../../assets/heart2.png";
import { Link, useLocation } from "react-router-dom";
import "./header.css";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../assets/avatar.png";
import Vector from "../../assets/Vector.png";
import { logoutUser } from "../../Redux/userSlice";
import { toast } from "react-toastify";
import { WishlistContext } from "../../Context/WishlistContext";
const Header = () => {
  const [navBar, openNavBar] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [resDropDown, setResDropDown] = useState(false);
  const dropDownRef = useRef(null);
  const buttonRef = useRef(null);
  const disptach = useDispatch();

  const { data } = useContext(WishlistContext);

  const { login, userData } = useSelector((state) => {
    return state.user;
  });

  const location = useLocation();

  const cartData = useSelector((state) => {
    return state.cart[userData?.id] || [];
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown and button
      if (
        dropDownRef?.current &&
        !dropDownRef?.current?.contains(event.target) &&
        !buttonRef?.current?.contains(event.target)
      ) {
        setDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDown]);

  return (
    <nav
      style={{
        zIndex: "99",
        boxShadow: "rgba(128, 128, 128, 0.45) 0px 0px 5px 0px",
      }}
      className={`py-1 ${
        location.pathname.includes("auth") ||
        location.pathname.includes("faq") ||
        location.pathname.includes("term") ||
        location.pathname.includes("privacy") ||
        location.pathname.includes("career") ||
        location.pathname.includes("blog") ||
        location.pathname.includes("about")
          ? ""
          : "mb-4"
      } position-sticky top-0 navbar px-lg-2 navbar-expand-lg bg-white`}
    >
      <div className="container-fluid  align-items-center position-relative px-3 px-md-4 px-xl-5">
        <div className="d-flex align-items-center gap-3">
          <span
            className="navbar-toggler-icon d-block d-lg-none"
            onClick={() => openNavBar(!navBar)}
          ></span>
          <Link className="navbar-brand" to="/">
            <img src={Logo} alt="" />{" "}
          </Link>
        </div>

        <div className="d-flex justify-content-start align-items-center gap-3">
          <div className="d-lg-none">
            <div className="d-flex gap-2 align-items-center">
              {/* <Link to="/dashboard?tab=wishlist">
                <div className="d-lg-none position-relative me-2">
                  <img src={heart2} className="header-cart pointer" alt="" />
                  <span className="wishlist-counter d-flex justify-content-center align-items-center">
                    {data.length}
                  </span>
                </div>
              </Link> */}
              {login && (
                <Link to="/cart">
                  <div className="d-lg-none position-relative me-2">
                    <img src={cart} className="header-cart pointer" alt="" />
                    <span className="item-counter d-flex justify-content-center align-items-center">
                      {cartData.length}
                    </span>
                  </div>
                </Link>
              )}

              <div>
                {!login ? (
                  ""
                ) : (
                  <div className="position-relative">
                    <div
                      ref={buttonRef}
                      onClick={() => {
                        setResDropDown(!resDropDown);
                      }}
                      className="d-flex align-items-center gap-2 pointer "
                    >
                      <img
                        src={
                          userData.image
                            ? `${process.env.REACT_APP_API_URL}${userData.image}`
                            : Avatar
                        }
                        alt=""
                        className="rounded-circle object-fit-cover profile-image"
                      />
                      {/* <p className="p-0 m-0 fw-medium">{userData?.name}</p> */}
                      <img src={Vector} alt="" />
                    </div>
                    {resDropDown && (
                      <div
                        ref={dropDownRef}
                        className="bg-white shadow position-absolute dropdown"
                      >
                        <Link
                          to="/dashboard"
                          className="text-decoration-none text-dark select-option d-flex align-items-center gap-3 py-2 px-2"
                          onClick={() => setDropDown(false)} // Close dropdown after clicking
                        >
                          <span className="fa-solid fa-user"></span>
                          <p className="p-0 mb-0">Profile</p>
                        </Link>
                        <button
                          onClick={() => {
                            toast.success("User logout successfully");
                            disptach(logoutUser());
                            setResDropDown(false); // Close dropdown after logout
                          }}
                          className="d-flex align-items-center gap-3 py-2 px-2 w-100 border-0 bg-white text-nowrap select-option"
                        >
                          <span className="fa-solid fa-right-from-bracket"></span>
                          <p className="p-0 m-0">Log Out</p>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={"collapse navbar-collapse " + (navBar ? "show" : "")}>
          <ul className="navbar-nav mt-2 me-lg-0 me-auto mb-lg-0 w-100 box-shadow-res">
            <li className="nav-item nav-link-res text-nowrap">
              <NavLink
                to="/"
                style={{ textDecoration: "none" }}
                className={({ isActive }) =>
                  isActive && location.pathname.includes("/")
                    ? "active-class  p-0 nav-link mb-2"
                    : "nav-link mb-2 p-0"
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item nav-link-res text-nowrap">
              <Link
                style={{ textDecoration: "none" }}
                className={
                  location.pathname.includes("/career")
                    ? "active-class  p-0 nav-link mb-2"
                    : "nav-link mb-2 p-0"
                }
                to={"/career"}
              >
                Career
              </Link>
            </li>

            <li className="nav-item nav-link-res text-nowrap">
              <Link
                to={"/faq"}
                style={{ textDecoration: "none" }}
                className={
                  location.pathname.includes("/faq")
                    ? "active-class  p-0 nav-link mb-2"
                    : "nav-link mb-2 p-0"
                }
              >
                FAQ's
              </Link>
            </li>
            <li className="nav-item nav-link-res text-nowrap">
              <Link
                style={{ textDecoration: "none" }}
                className={
                  location.pathname.includes("/blog")
                    ? "active-class  p-0 nav-link mb-2"
                    : "nav-link mb-2 p-0"
                }
                to="/blog"
              >
                Blog
              </Link>
            </li>

            <li className="nav-item nav-link-res text-nowrap">
              <Link
                style={{ textDecoration: "none" }}
                className={
                  location.pathname.includes("/contact")
                    ? "active-class  p-0 nav-link mb-2"
                    : "nav-link mb-2 p-0"
                }
                to={"/contact"}
              >
                Contact Us
              </Link>
            </li>
            <li className="nav-item nav-link-res text-nowrap">
              <Link
                style={{ textDecoration: "none" }}
                className={
                  location.pathname.includes("/about")
                    ? "active-class  p-0 nav-link mb-2"
                    : "nav-link mb-2 p-0"
                }
                to={"/about-us"}
              >
                About Us
              </Link>
            </li>
            {!login && (
              <li className="d-block d-lg-none pt-3 d-flex justify-content-center">
                <div className="d-flex gap-3">
                  <Link
                    to="/auth/register"
                    className="btn auth-btn text-nowrap py-2 px-3 rounded-0"
                  >
                    Sign up
                  </Link>
                  <Link
                    to="/auth/login"
                    className="btn auth-btn text-nowrap py-2 px-3 rounded-0 sign-in-btn"
                  >
                    Sign In
                  </Link>
                </div>
              </li>
            )}
          </ul>

          <form
            className="d-flex align-items-start align-items-lg-center flex-column flex-lg-row"
            role="search"
          >
            {/* <Link to="/dashboard?tab=wishlist">
              <div className="d-none d-lg-block position-relative me-3">
                <img
                  title="Wishlist"
                  src={heart2}
                  className="header-cart pointer"
                  alt=""
                />
                <span className="wishlist-counter d-flex justify-content-center align-items-center">
                  {data.length}
                </span>
              </div>
            </Link> */}
            {login && (
              <Link to="/cart">
                <div className="d-none d-lg-block position-relative me-3">
                  <img src={cart} className="header-cart pointer" alt="" />
                  <span className="item-counter d-flex justify-content-center align-items-center">
                    {cartData.length}
                  </span>
                </div>
              </Link>
            )}

            <div className="d-none d-lg-block">
              {!login ? (
                <div className="d-flex gap-3">
                  <Link
                    to="/auth/register"
                    className="btn auth-btn text-nowrap py-2 px-3 rounded-0"
                  >
                    Sign up
                  </Link>
                  <Link
                    to="/auth/login"
                    className="btn auth-btn text-nowrap py-2 px-3 rounded-0 sign-in-btn"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <div className="position-relative">
                  <div
                    ref={buttonRef}
                    onClick={() => {
                      setDropDown(!dropDown);
                    }}
                    className="d-flex align-items-center gap-2 pointer "
                  >
                    <img
                      src={
                        userData.image
                          ? `${process.env.REACT_APP_API_URL}${userData.image}`
                          : Avatar
                      }
                      alt=""
                      className="rounded-circle object-fit-cover profile-image"
                    />
                    <p className="p-0 m-0 fw-medium text-nowrap">
                      {userData?.name}
                    </p>
                    <img src={Vector} alt="" />
                  </div>
                  {dropDown && (
                    <div
                      ref={dropDownRef}
                      className="bg-white shadow position-absolute dropdown"
                    >
                      <Link
                        to="/dashboard"
                        className="text-decoration-none text-dark select-option d-flex align-items-center gap-3 py-2 px-2"
                      >
                        <span className="fa-solid fa-user"></span>
                        <p className="p-0 mb-0">Profile</p>
                      </Link>
                      <button
                        onClick={() => {
                          toast.success("User logout successfully");
                          disptach(logoutUser());
                        }}
                        className="d-flex align-items-center gap-3 py-2 px-2 w-100 border-0 bg-white text-nowrap select-option"
                      >
                        <span className="fa-solid fa-right-from-bracket"></span>
                        <p className="p-0 m-0">Log Out</p>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;
