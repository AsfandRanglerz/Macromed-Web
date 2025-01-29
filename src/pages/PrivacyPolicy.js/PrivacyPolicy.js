import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function PrivacyPolicy() {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/privacy-policy`)
      .then((res) => {
        setData(res?.data?.privacyPolicy[0].description);
      })
      .catch((err) => {
        if (err?.message == "Network Error") {
          toast.error("Check your internet connection");
        }
      });
  }, []);
  return (
    <div className="mb-3">
      <div className="info-page-header">
        <div className="py-2 py-lg-5">
          <h1 className="text-center">Privacy Policy</h1>
        </div>
      </div>

      <div className="p-3 p-lg-5">
        <div
          className="bg-white shadow py-3 px-3 py-lg-4"
          dangerouslySetInnerHTML={{ __html: data }}
        ></div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
