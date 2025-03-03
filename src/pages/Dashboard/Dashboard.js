import React, { useContext, useEffect, useRef, useState } from "react";
import "./dashboard.css";
import Logo from "../../assets/logo.png";
import Avatar from "../../assets/avatar.png";
import dashboard from "../../assets/dashboard.png";
import dashboardBlack from "../../assets/dashboardBlack.png";
import profile from "../../assets/profile.png";
import profileWhite from "../../assets/profileWhite.png";
import wishlist from "../../assets/wishlist.png";
import wishlistWhite from "../../assets/wishlistWhite.png";
import notification from "../../assets/Notification.png";
import notificationWhite from "../../assets/notificationWhite.png";
import order from "../../assets/order.png";
import orderWhite from "../../assets/orderWhite.png";
import request from "../../assets/request.png";
import requestWhite from "../../assets/requestWhite.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./Profile";
import Wishlist from "./Wishlist";
import Orders from "./Orders";
import Notification from "./Notification";
import queryString from "query-string";
import DashBoardContent from "./DashBoardContent";
import { toast } from "react-toastify";
import { logoutUser } from "../../Redux/userSlice";
import { WishlistProvider } from "../../Context/WishlistContext";
import { NotificationContext } from "../../Context/NotificationContext";
import RequestQuotes from "./RequestQuotes";

function Dashboard() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("dashboard");
  const [tabHover, setTabHover] = useState("");
  const [heading, setHeading] = useState("Dashboard");
  const [showSideBaar, setShowSideBaar] = useState(false);
  const buttonRef = useRef(null);
  const [dropDown, setDropDown] = useState(false);
  const dropDownRef = useRef(null);

  const disptach = useDispatch();

  const { seen, setSeen, readAllNotifications } =
    useContext(NotificationContext);

  const windowHeight = window.innerHeight;

  const sideBaarRef = useRef(null);

  const tabIcons = {
    dashboard: { default: dashboardBlack, active: dashboard },
    profile: { default: profile, active: profileWhite },
    wishlist: { default: wishlist, active: wishlistWhite },
    notifications: { default: notification, active: notificationWhite },
    orders: { default: order, active: orderWhite },
    qoutes: { default: request, active: requestWhite },
  };

  const handleHover = (value) => setTabHover(value);
  const handleHoverLeave = () => setTabHover("");

  // Function to render the active tab's content
  const renderActiveTab = () => {
    switch (tab) {
      case "profile":
        return <Profile />;
      case "wishlist":
        return <Wishlist />;
      case "notifications":
        return <Notification />;
      case "orders":
        return <Orders />;
      case "qoutes":
        return <RequestQuotes />;
      default:
        return <DashBoardContent />;
    }
  };

  const handleTabChange = (selectedTab) => {
    const currentParams = queryString.parse(location.search);
    const updatedParams = { ...currentParams, tab: selectedTab };
    const newSearch = queryString.stringify(updatedParams);

    setTab(selectedTab);
    navigate(`${location.pathname}?${newSearch}`, { replace: true });
  };

  // Update heading based on the active tab
  useEffect(() => {
    const headings = {
      profile: "My Profile",
      wishlist: "Wishlist",
      notifications: "Notifications",
      orders: "Orders",
      qoutes: "Request for Qoutes",
      dashboard: "Dashboard",
    };
    setHeading(headings[tab] || "Dashboard");
  }, [tab]);

  // Function to open the tab based on the 'tab' param in the URL
  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.tab) {
      setTab(params.tab);
    }
  }, [location.search]);

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

  const renderTabs = () => {
    return [
      "dashboard",
      "profile",
      "wishlist",
      "notifications",
      "orders",
      // "qoutes",
    ].map((item) => (
      <div
        key={item}
        onMouseEnter={() => handleHover(item)}
        onMouseLeave={handleHoverLeave}
        onClick={() => {
          handleTabChange(item);
          setShowSideBaar(false);
        }}
        className={`d-flex align-items-center gap-3 px-3 py-2 mb-2 tab pointer tabs-size ${
          tab === item || tabHover === item ? "bgTheme" : ""
        }`}
      >
        <img
          className="img-size"
          src={
            tab === item || tabHover === item
              ? tabIcons[item].active
              : tabIcons[item].default
          }
          alt={item}
        />
        <p
          className={`p-0 m-0 fw-medium ${
            tab === item || tabHover === item ? "text-white" : ""
          }`}
        >
          {item == "qoutes"
            ? "Request for Quotes"
            : item.charAt(0).toUpperCase() + item.slice(1)}
        </p>
      </div>
    ));
  };

  useEffect(() => {
    if (user.login == false) {
      navigate("/");
      toast.error("Dashboard is not accessible without login");
    }
  }, []);
  useEffect(() => {
    if (user.login == false) {
      navigate("/");
      toast.error("Dashboard is not accessible without login");
    }
  }, [logoutUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown and button
      if (
        sideBaarRef?.current &&
        !sideBaarRef?.current?.contains(event.target) &&
        !sideBaarRef?.current?.contains(event.target)
      ) {
        setShowSideBaar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="row w-100 m-0 dashboard">
      <div className="d-none d-lg-block col-lg-3 bg-white px-2 px-xl-4 pt-2 pt-xl-4 d-flex flex-column align-items-center">
        <Link
          className="navbar-brand d-flex justify-content-center mt-4"
          to="/"
        >
          <img src={Logo} alt="" className="img-fluid " />
        </Link>
        <div>
          <div className="mt-3 mt-xl-5 d-flex flex-column flex-xl-row align-items-center gap-xl-3 w-100">
            <div className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center dashboard-profile-image">
              <img
                src={
                  user?.userData?.image
                    ? `${process.env.REACT_APP_API_URL}` + user.userData.image
                    : Avatar
                }
                alt=""
                className="w-100 h-100 object-fit-cover img-fluid rounded-circle overflow-hidden "
              />
            </div>
            <div>
              <h5 className="p-0 m-0 text-center text-xl-start">
                {user?.userData?.name}
              </h5>
              <p className="p-0 m-0 text-center text-xl-start text-wrap text-grey2 small mail">
                {user?.userData?.email}
              </p>
            </div>
          </div>
          <div className="mt-5">{renderTabs()}</div>
        </div>
      </div>
      {showSideBaar && (
        <div
          style={{ height: "100vh" }}
          className="d-block d-lg-none m-0 col-12 col-lg-3 px-2 px-xl-4 position-absolute d-flex side-baar"
        >
          <div className="row h-100 w-100">
            <div
              ref={sideBaarRef}
              className="col-8 col-md-6 h-100 bg-white overflow-x-hidden overflow-y-auto pt-2"
            >
              <Link
                className="navbar-brand d-flex justify-content-center mt-3"
                to="/"
              >
                <img src={Logo} alt="" className="web-logo" />
              </Link>
              <div className="mt-4 mt-xl-5 d-flex align-items-center gap-2 ms-2 flex-row w-100">
                <img
                  src={
                    user.userData.image
                      ? `${process.env.REACT_APP_API_URL}` + user.userData.image
                      : Avatar
                  }
                  alt=""
                  className="rounded-circle overflow-hidden dashboard-profile-image"
                />
                <div>
                  <h5 className="p-0 m-0 small">{user?.userData?.name}</h5>
                  <p className="p-0 m-0 text-wrap text-grey2 small mail">
                    {user?.userData?.email}
                  </p>
                </div>
              </div>

              <div className="mt-4">{renderTabs()}</div>
            </div>
          </div>
        </div>
      )}

      <div className="col-12 col-lg-9 p-0 m-0">
        <div
          style={{ height: windowHeight }}
          className="w-100 m-0 px-3 px-lg-5 pt-3 pt-lg-4 pb-4 overflow-y-auto dashboard-data"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2 align-items-center">
              <span
                onClick={() => setShowSideBaar(!showSideBaar)}
                className="fa-solid fa-bars d-block d-lg-none text-dark pointer"
              ></span>
              <h5 className="p-0 m-0">{heading}</h5>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Link
                onClick={readAllNotifications}
                to="/dashboard?tab=notifications"
                className="bg-white rounded-circle position-relative d-flex align-items-center justify-content-center notifcation-circle"
              >
                <img src={notification} alt="" />
                <span
                  onClick={() => {
                    setSeen(0);
                  }}
                  className="position-absolute top-0 end-0 text-white rounded-circle text-center notification-counter"
                >
                  {seen}
                </span>
              </Link>
              <div className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center position-relative dashboard-profile-image">
                <img
                  ref={buttonRef}
                  onClick={() => {
                    setDropDown(!dropDown);
                  }}
                  src={
                    user?.userData?.image
                      ? `${process.env.REACT_APP_API_URL}` + user.userData.image
                      : Avatar
                  }
                  alt=""
                  className="w-100 h-100 object-fit-cover rounded-circle overflow-hidden pointer"
                />
              </div>
              {dropDown && (
                <div
                  ref={dropDownRef}
                  style={{ zIndex: "9999", top: "5.2rem", right: "5%" }}
                  className="bg-white shadow position-absolute dropdown"
                >
                  <Link
                    onClick={() => {
                      setDropDown(false);
                    }}
                    to="/"
                    className="text-decoration-none text-dark select-option d-flex align-items-center gap-3 py-2 px-2"
                  >
                    <span className="fa-solid fa-house"></span>
                    <p className="p-0 mb-0">Home</p>
                  </Link>
                  <button
                    onClick={() => {
                      disptach(logoutUser());
                      toast.success("User logout successfully");
                      setDropDown(false);
                      navigate("/");
                    }}
                    className="d-flex align-items-center gap-3 py-2 px-2 w-100 border-0 bg-white text-nowrap select-option"
                  >
                    <span className="fa-solid fa-right-from-bracket"></span>
                    <p className="p-0 m-0">Log Out</p>
                  </button>
                </div>
              )}
            </div>
          </div>
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
