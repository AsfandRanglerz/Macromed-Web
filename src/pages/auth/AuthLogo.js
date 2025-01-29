import React from "react";
import cms from "../../assets/auth.png";
export default function AuthLogo() {
  return (
    <div className="col-5 left d-none d-sm-block">
      <div className="px-2 px-md-4 px-lg-5 h-100 d-flex justify-content-center align-items-center auth-logo">
        <img src={cms} className="w-100" alt="" />
      </div>
    </div>
  );
}
