



import { current } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";

// import "./../../assets/css/pagination.css"

const BlogPagination = ({ totalPages, onPageChange }) => {
  const [ currentPage, setCurrentPage ] = useState(1);
  console.log(`Total pages: ${totalPages}`);
  useEffect(() => {
    console.log("Total Pages:", totalPages);
  }, [totalPages, currentPage]);


  const handlePrevClick = () => {
    if (currentPage > 1 ) {
      handlePageChange(currentPage - 1);
      
    }
  };

  const handlePageChange = (page) => {
    console.log("Clicked Page:", page);
    console.log("before clicked: ", currentPage);
    const res = onPageChange(page);
    console.log("onPageChange ", res);
    setCurrentPage(page);
    console.log("after clicked: ", currentPage);

  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage;
        buttons.push(
          <button 
            key={i} 
            style={isActive ? { backgroundColor: "#a749ff",color:"white", transition: "background-color 0.9s ease" } : {}}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      
    }
    return buttons;
  };
  
  

  return (
    <div className="pro-pagination-style text-center mt-20">
      <ul>
        <li>
          <button className="prev active  " onClick={handlePrevClick}>
            <i className="fa fa-angle-double-left" />
          </button>
        </li>
        {totalPages > 0 && (
          <li className="active">
            {renderPaginationButtons()}
          </li>
        )}
        <li>
          <button className="next" onClick={handleNextClick}>
            <i className="fa fa-angle-double-right" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default BlogPagination;

