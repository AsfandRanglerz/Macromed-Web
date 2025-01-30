import React from "react";
import Logo2 from "../../assets/logo2.png";
import facebookLogo from "../../assets/fb.png";
import twitterLogo from "../../assets/twitter.png";
import linkedInLogo from "../../assets/linkedin.png";
import instaLogo from "../../assets/insta.png";
import messageIcon from "../../assets/message-icon.png";
import locationIcon from "../../assets/location-icon.png";
import phoneIcon from "../../assets/phone-icon.png";
import angleUp from "../../assets/angle_up.png";
import "./footer.css";
import { Link } from "react-router-dom";
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer position-relative py-3">
      <span onClick={() => window.scrollTo(0, 0)} className="footer-btn">
        <span className="text-center">
          <img src={angleUp} alt="" />
        </span>
      </span>
      <div className="container-fluid px-3 px-md-4 px-xl-5">
        <div className="footer-container">
          <div className="footer-content-container">
            <img src={Logo2} className="footer-logo" alt="" />
            <div className="footer-social">
              <Link to="/">
                <img src={facebookLogo} className="footer-social-icon" alt="" />
              </Link>
              <Link to="/">
                <img src={instaLogo} className="footer-social-icon" alt="" />
              </Link>
              <Link to="/">
                <img src={twitterLogo} className="footer-social-icon" alt="" />
              </Link>
              <Link to="/">
                <img src={linkedInLogo} className="footer-social-icon" alt="" />
              </Link>
            </div>
          </div>
          <div className=" footer-content-container">
            <p className="text-white footer-heading">INFORMATION</p>
            <div className="d-flex flex-column gap-2">
              <Link
                to="/"
                className="text-white text-decoration-none p-0 footer-link"
              >
                Home
              </Link>

              <Link
                to="/contact"
                className="text-white text-decoration-none footer-link"
              >
                Contact us
              </Link>
              <Link
                to="/about-us"
                className="text-white text-decoration-none footer-link"
              >
                About us
              </Link>
            </div>
          </div>
          <div className="footer-content-container">
            <p className="text-white footer-heading">Categories</p>
            <div className="d-flex flex-column gap-2">
              <Link
                to="/term-&-condition"
                className="text-white text-decoration-none footer-link"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/privacy-policy"
                className="text-white text-decoration-none footer-link"
              >
                Privacy Policy
              </Link>
              <Link
                to="/faq"
                className="text-white text-decoration-none footer-link"
              >
                FAQ's
              </Link>
            </div>
          </div>
          <div className="footer-content-container">
            <p className="text-white footer-heading">CONTACT</p>
            <div className="d-flex flex-column gap-2">
              <p className="text-white p-0 m-0 footer-link d-flex">
                {" "}
                <div>
                  <img src={locationIcon} alt="" />
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=FF+130,+Defence+Shopping+Mall,+DHA+Main+Boulevard,+Lahore+Cantt,+Lahore-Pakistan"
                  target="_blank"
                  className="ms-2 text-white text-decoration-none"
                >
                  FF 130, Defence Shopping Mall , DHA Main Boulevard ,<br />{" "}
                  Lahore Cantt,. Lahore-Pakistan
                </a>
              </p>
              <p className="text-white p-0 m-0 footer-link d-flex">
                {" "}
                <div>
                  <img src={phoneIcon} alt="" />
                </div>
                <a
                  // href="https://wa.me/923107608641"
                  // target="_blank"
                  className="ms-2 text-wrap text-white text-decoration-none"
                >
                  +92 (310) 760 8641
                </a>
              </p>
              <p className="text-white p-0 m-0 footer-link d-flex">
                {" "}
                <div>
                  <img src={messageIcon} alt="" />
                </div>
                <Link
                  to="mailto:info@macromed.com.pk"
                  target="_blank"
                  className="ms-2 text-white text-decoration-none"
                >
                  info@macromed.com.pk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-border d-flex mt-3">
        <div className="col-6 left-border"></div>
        <div className="col-6 right-border"></div>
      </div>
      <div className="text-center mt-3">
        <p className="mb-0 text-white">
          <span className="h5">©</span>{" "}
          <span className="small">
            {currentYear} Macromed PVT.LTD. All Rights Reserved.
          </span>
        </p>
      </div>
    </div>
  );
}
