import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ApplyToJob({ onClose, jobId }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    cv: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
      setFormData({ ...formData, cv: file });
    } else {
      toast.error("Please upload a valid PDF file under 5MB.");
      e.target.value = ""; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("applicant_name", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("cover_letter", formData.coverLetter);
    formDataToSend.append("career_id", jobId);
    formDataToSend.append("resume", formData.cv);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/JobsApplications`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status) {
        toast.success("Application submitted successfully!");
        setTimeout(onClose, 0); 
      } else {
        toast.error("Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="main">
      <ToastContainer /> 
      <div className="form-container">
        <div className="form-header">
          <h2>Apply </h2>
          <button className="close-button" onClick={onClose}>✖</button>
        </div>
        {/* <p>Please fill out all required fields</p> */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name *</label>
          <input type="text" id="fullName" name="fullName" required onChange={handleChange} />

          <label htmlFor="email">Email *</label>
          <input type="email" id="email" name="email" required onChange={handleChange} />

          <label htmlFor="phone">Phone Number *</label>
          <input type="tel" id="phone" name="phone" required onChange={handleChange} />

          <label htmlFor="coverLetter">Cover Letter *</label>
          <textarea id="coverLetter" name="coverLetter" required rows="3" onChange={handleChange}></textarea>

          <label htmlFor="cv">Upload CV (PDF only, max 5MB) *</label>
          <input type="file" id="cv" name="cv" accept="application/pdf" required onChange={handleFileChange} />

          <button type="submit" style={{ marginTop: "10px" }} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyToJob;
