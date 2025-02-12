import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApplyToJob from "../../components/ApplytoJob";

function Career() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobType, setJobType] = useState("All Times");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const openModal = (jobId) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/careerGet`)
      .then((res) => {
        setData(res.data.data || []);
        setFilteredData(res.data.data || []);
      })
      .catch((err) => {
        if (err?.message === "Network Error") {
          toast.error("Check your internet connection");
        } else {
          console.error("Error fetching jobs:", err);
        }
      });
  }, []);

  useEffect(() => {
    let filtered = data.filter((job) => {
      return (
        (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (jobType === "All Times" || job.employment_type === jobType)
      );
    });
    setFilteredData(filtered);
  }, [searchQuery, jobType, data]);


  return (
    <div className="mb-3 mt-3">
      <div className="main_container">
        <div className="join_team_sec">
          <h1>Join Our Team</h1>
          <p>Shape the Future of Healthcare with MacroMed</p>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search jobs by title, keyword, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="dropdown"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option>All Time</option>
            <option>Full-time</option>
            <option>Part-time</option>
          </select>
        </div>

        {filteredData.length > 0 ? (
          filteredData.map((job) => (
            <div className="job-card" key={job.id}>
              <div className="job-title">{job.title}</div>
              <div className="job-info">
                <span>📍 {job.location}</span>
                <span>💼 {job.employment_type}</span>
                <span>📅 Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                <span>⏰ Closes: {job.status === "Open" ? "Still Open" : "Closed"}</span>
              </div>
              <div className="job-description" dangerouslySetInnerHTML={{ __html: job.description }} />
              <div className="job-requirements">
                <ul>
                  <li>{job.requirements}</li>
                </ul>
              </div>
              <button
                className="apply-button"
                style={{ width: "150px" }}
                onClick={() => openModal(job.id)}
              >
                Apply
              </button>
            </div>
          ))
        ) : (
          <div className="job-title" style={{ textAlign: "center", margin: 20 }}>
            No Jobs Available
          </div>
        )}
      </div>

      <div className="about-card">
        <div className="about-title">About Us</div>
        <div className="about-text">
          MacroMed is a leading healthcare company committed to innovation and excellence in medical technology...
        </div>
      </div>

      <div className="values-card">
        <div className="values-title">Our Values</div>
        <ul className="values-list">
          <li>Innovation</li>
          <li>Excellence</li>
          <li>Integrity</li>
        </ul>
      </div>

      <div className="team-card">
        <div className="team-title">Team Photos</div>
        <div className="team-photos">
          <div className="photo"><img src="https://tse1.mm.bing.net/th?id=OIP.tL1dKiGcEl_zmAltMAiCDQHaHa&pid=Api&P=0&h=100" alt="" /></div>
          <div className="photo"><img src="https://tse1.mm.bing.net/th?id=OIP.tL1dKiGcEl_zmAltMAiCDQHaHa&pid=Api&P=0&h=100" alt="" /></div>
          <div className="photo"><img src="https://tse1.mm.bing.net/th?id=OIP.tL1dKiGcEl_zmAltMAiCDQHaHa&pid=Api&P=0&h=100" alt="" /></div>
        </div>
      </div>

      <div className="subscribe-card">
        <div className="subscribe-title">Stay Updated</div>
        <div className="subscribe-subtext">Get notified about new job opportunities</div>
        <div className="subscribe-form">
          <input
            type="email"
            className="subscribe-input"
            placeholder="Enter your email"
          />
          <button className="subscribe-button" style={{ width: "10%" }}>Subscribe</button>
        </div>
      </div>

      <div className="faq-card">
        <div className="faq-title">Frequently Asked Questions</div>
        <div className="faq-item">
          <div className="faq-question">What is the application process?</div>
          <div className="faq-answer">Our application process typically includes...</div>
        </div>
        <div className="faq-item">
          <div className="faq-question">How long does the hiring process take?</div>
          <div className="faq-answer">The hiring process usually takes 2-3 weeks...</div>
        </div>
      </div>


      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ApplyToJob onClose={() => setIsModalOpen(false)} jobId={selectedJobId} />
          </div>
        </div>
      )}

    </div>
  );
}

export default Career;
