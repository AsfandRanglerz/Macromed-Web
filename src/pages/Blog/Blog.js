import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const BASE_IMAGE_URL= process.env.REACT_APP_IMAGE_API_URL;

function Blog() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [expandedBlogs, setExpandedBlogs] = useState({}); // State to track expanded blogs

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/blogsGet`)
      .then((res) => {
        console.log("data", res.data.data);
        setData(res.data.data || []);
        setFilteredData(res.data.data || []);
      })
      .catch((err) => {
        if (err?.message === "Network Error") {
          toast.error("Check your internet connection");
        } else {
          console.error("Error fetching blogs:", err);
        }
      });
  }, []);

  const toggleReadMore = (index) => {
    setExpandedBlogs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateText = (text, charLimit) => {
    if (text.length > charLimit) {
      return text.substring(0, charLimit) + "...";
    }
    return text;
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category === "All Categories") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(blog => blog.category === category));
    }
  };

  return (
    <div className="m-3">
      <div className="blog-container">
        <div className="blog-title">MacroMed Blog</div>
        <div className="search-filter">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
          <select className="category-dropdown" value={selectedCategory} onChange={handleCategoryChange}>
            <option>All Categories</option>
            <option>Medical Technologies</option>
            <option>Health Care</option>
          </select>
        </div>

        {filteredData.length > 0 ? (
          filteredData.map((blog, index) => (
            <div className="blog-card" key={index}>
              <div className="blog-image">
                <img src={ blog.image ? `${BASE_IMAGE_URL}${blog.image}`: `https://st2.depositphotos.com/1006899/8646/i/450/depositphotos_86463824-stock-photo-blog-hanging-on-strings.jpg`} alt="Blog" />
              </div>
              <div className="blog-content">
                <span className="blog-category">{blog.category ? blog.category : 'null'}</span>
                <span className="blog-meta">8 min read</span>
                <div className="blog-sub-title">{blog.title}</div>
                <div className="blog-description">
                  {expandedBlogs[index] ? blog.description : truncateText(blog.description, 400)}
                </div>
                <div className="blog-author">
                  <div className="author-avatar">
                    <img src="https://tse4.mm.bing.net/th?id=OIP._8Kty4btP3aJuyTfZTaR0wHaHk&pid=Api&P=0&h=30" alt="Author" />
                  </div>
                  <div className="profile_details">
                    <p>{blog.author}</p>
                    <p>
                      <FontAwesomeIcon icon={faCalendar} id="calendar_icon" />
                      <span className="blog-meta">
                        {blog.updated_at ? blog.updated_at.split("T")[0] : "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="social-icons">
                <div className="read-more" onClick={() => toggleReadMore(index)}>
                  {expandedBlogs[index] ? "Show Less" : "Show More"}
                </div>
                <div className="icons_list">
                  <a href="#"><FontAwesomeIcon icon={faFacebookF} /> Share</a>
                  <a href="#"><FontAwesomeIcon icon={faTwitter} /> Tweet</a>
                  <a href="#"><FontAwesomeIcon icon={faLinkedin} /> Share</a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs available in this category.</p>
        )}
      </div>
    </div>
  );
}

export default Blog;
