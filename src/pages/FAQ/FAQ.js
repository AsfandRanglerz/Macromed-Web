import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import "./faq.css";
import axios from "axios";
import { toast } from "react-toastify";

function FAQ() {
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/faqs`)
      .then((res) => {
        setData(res?.data?.faqs);
        setOriginalData(res?.data?.faqs); // Store the original data
      })
      .catch((err) => {
        if (err?.message == "Network Error") {
          toast.error("Check your internet connection");
        }
      });
  }, []);

  const changer = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (value === "") {
      setData(originalData); // Reset to original data if input is empty
    } else {
      setData((prev) => {
        return originalData.filter((item) => {
          return (
            item.questions.toLowerCase().includes(value) ||
            item.answers.toLowerCase().includes(value)
          );
        });
      });
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="ms-1 highlight">
          {` ${part}`} {/* Added space on the left */}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="mb-3">
      <div className="info-page-header">
        <div className="py-2 py-lg-5">
          <h1 className="text-center">FAQ's</h1>
        </div>
      </div>
      <div className="p-3 p-lg-5">
        {/* <div className="row w-100 mb-4 justify-content-end">
          <div className="col-md-6 col-lg-4 d-flex align-items-center search-keywords position-relative">
            <label className="small font-500 mb-0 me-3 text-nowrap">
              SEARCH BY:
            </label>
            <input
              onChange={changer}
              name="search"
              type="text"
              placeholder="Search by the keywords"
            />
            <button className="sarchkeywords-btn">
              <span className="fa-solid fa-magnifying-glass"></span>
            </button>
          </div>
        </div> */}
        <div className="bg-white shadow p-2 p-lg-5">
          {data?.length !== 0 ? (
            <Accordion defaultActiveKey="0">
              {data?.map((e, index) => {
                return (
                  <Accordion.Item key={index} eventKey={String(index)}>
                    <Accordion.Header>
                      {highlightText(e?.questions, searchTerm)}
                    </Accordion.Header>
                    <Accordion.Body>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: highlightText(e?.answers, searchTerm),
                        }}
                      ></div>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          ) : (
            <div className="text-center">No data found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
