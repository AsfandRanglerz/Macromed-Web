import React from "react";
import Person from "../../assets/person.png";
import Camera from "../../assets/camera.png";

function ImageUploader({ changer, preview, showImage }) {
  return (
    <div className="w-auto p-0 position-relative">
      <div className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center image-container-dash">
        <img
          src={
            preview
              ? preview // Show the preview if a new image is selected
              : showImage === "" // If `showImage` is empty, use the fallback
              ? Person
              : `${process.env.REACT_APP_API_URL}${showImage}` // Otherwise, display the stored image from backend
          }
          alt="User profile"
          className="h-100 img-fluid object-fit-cover"
        />

        <div className="position-absolute rounded-circle d-flex align-items-center justify-content-center camera-icon">
          <input
            name="image"
            type="file"
            accept="image/*"
            className="d-none"
            id="file-upload"
            onChange={changer}
          />
          <label htmlFor="file-upload" className="m-0">
            <img src={Camera} alt="Camera icon" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;
