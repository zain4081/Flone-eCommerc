// ** React Imports
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// ** Styles
import "@styles/base/pages/page-blog.scss";
const baseURL = `${import.meta.env.VITE_API_URL}`;
// import axiosInstance from "../interceptor/axios";
const SecondPage = () => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);
    axios.post(`${baseURL}/commerce/product-upload/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "43457",
      },
    })
      .then((response) => {
        console.log("response",response);
        toast.success(`${response.data.message}`, {
          position: "top-center",
          draggable: true,
        });
      })
      .catch((error) => {
        console.log("error",error);
        toast.error(`${error.response.data.error}`, {
          position: "top-center",
          draggable: true,
        });
      });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".csv, .xlsx",
  });
  return (
    <>
      <ToastContainer />
      <div {...getRootProps()} style={dropZoneStyle}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your File</p>
        ) : (
          <p>
            Drag & Drop your File.<br /><b>(Note:</b> Only xlsx and csv files are supported)
          </p>
        )}
      </div>
    </>
  );
};
const dropZoneStyle = {
  border: "2px dashed #E91E63",  // Pink dashed border
  borderRadius: "10px",         // Rounded corners
  padding: "30px",              // Increased padding
  width: "100%",                // Full width
  height: "300px",              // Increased height
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#E91E63",             // Pink text color
  fontSize: "1.2rem",           // Larger font size
  fontWeight: "bold",           // Bold text
  cursor: "pointer",
  background: "#FCE4EC",        // Light pink background
};
export default SecondPage;
