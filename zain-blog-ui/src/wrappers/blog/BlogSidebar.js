import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetCategoriesMutation,
  useGetTagsMutation,
} from "../../services/blogApi";
import { useSelector } from "react-redux";

const BlogSidebar = ({ onFilterChange}) => {
  const { tag } = useParams();
  const [getTags] = useGetTagsMutation();
  const [getCategories] = useGetCategoriesMutation();
  const [tags, setTags] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [ search , setSearch ] = useState(null);
  const [check, setCheck] = useState(0);
  const user_info = useSelector((state) => state.user);
  
  

  useEffect(() => {
    const fetchTagsCategories = async () => {
      try {
        const tagResponse = await getTags();
        const categoryResponse = await getCategories();
        if (tagResponse.data) {
          setTags(tagResponse.data);
        }
        if (categoryResponse.data) {
          setCategories(categoryResponse.data);
        }
      } catch (error) {
        console.log("Error fetching tags and categories:", error);
      }
    };
  
    fetchTagsCategories();
  
  },[]);
// if url contains param of tag then
  useEffect(() => {
    if (tag) {
      handleTags(tag);
      
    }
  }, []);

  const handleFilterChange = (filterType, filterId) => {
    onFilterChange(filterType, filterId);
  };

  const handleCategories = (filterId) => {
    if (selectedCategories.includes(filterId)) {
      setSelectedCategories(selectedCategories.filter((t) => t !== filterId));
    } else {
      setSelectedCategories([...selectedCategories, filterId]);
    }
    setCheck(1);
  };

  const handleTags = (filterId) => {
    if (selectedTags.includes(filterId)) {
      setSelectedTags(selectedTags.filter((t) => t !== filterId));
    } else {
      setSelectedTags([...selectedTags, filterId]);
    }
    setCheck(2);
  };

  const [searchFormData, setSearchFormData] = useState({
    startDate: "",
    endDate: "",
    custom: "",
  });
  
  const handleSearchChange = (e) => {
    setSearchFormData({
      ...searchFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchForm = (e) => {
    e.preventDefault();
    setSearch(searchFormData)
    setCheck(3)
  };

  useEffect(() => {
    if(check && check === 1){
      handleFilterChange("category", selectedCategories);
    }
    if(check && check === 2){
      handleFilterChange("tag", selectedTags);
    }
    if(search || searchFormData){
      const searchFilters = `${searchFormData.custom.length > 0 ? '&search='+ searchFormData.custom : ''}${search && search.startDate.length > 0 && check === 3 ? '&start_date='+ search.startDate : ''}${search && search.endDate.length > 0 && check === 3 ? '&end_date='+ search.endDate : ''}`;
      handleFilterChange("search", searchFilters)
    }
    
  }, [selectedCategories, selectedTags, search, searchFormData.custom]);

  return (
    <div className="sidebar-style">
      {(user_info && user_info.role === "superuser") ? (
        <div className="sidebar-widget">
          <h4 className="pro-sidebar-title">Search </h4>
          <div className="pro-sidebar-search mb-55 mt-25">
            <form className="pro-sidebar-search-form" onSubmit={handleSearchForm}>
              <label className="search-form-label" for="startDate">From Date</label>
              <input 
                type="date" 
                name="startDate" 
                value={searchFormData.startDate}
                onChange={handleSearchChange}
                placeholder="From Date" 
              />
              <label className="search-form-label" for="endDate">To Date</label>
              <input 
                type="date" 
                name="endDate" 
                value={searchFormData.endDate}
                onChange={handleSearchChange}
                placeholder="to Date" 
              />
              <input 
                type="text" 
                name="custom" 
                value={searchFormData.custom}
                onChange={handleSearchChange}
                placeholder="Custom Search" 
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>
        </div>
      ) : null}
      
      <div className="sidebar-widget">
        <h4 className="pro-sidebar-title">Recent Projects </h4>
        <div className="sidebar-project-wrap mt-30">
          {/* Recent projects */}
        </div>
      </div>
      <div className="sidebar-widget mt-35">
        <h4 className="pro-sidebar-title">Categories</h4>
        <div className="sidebar-widget-list sidebar-widget-list--blog mt-20">
          <ul>
          {categories &&
            categories.map((category) => (
              // Check if category.posts_count is greater than 0
              category.posts_count > 0 && (
                <li key={category.id}>
                  <div className="sidebar-widget-list-left">
                    <input
                      type="checkbox"
                      value={category.id}
                      onChange={() => handleCategories(category.id)}
                    />
                    <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                      {category.name} <span>{category.posts_count}</span>
                    </Link>
                    <span className="checkmark" />
                  </div>
                </li>
              )
            ))}
          </ul>
        </div>
      </div>
      <div className="sidebar-widget mt-50">
        <h4 className="pro-sidebar-title">Tag </h4>
        <div className="sidebar-widget-tag mt-25">
          <ul>
          {tags &&
              tags.map((tag) => (
                // Check if tag.posts_count is greater than 0
                tag.posts_count > 0 && (
                  <li key={tag.id}>
                    <Link
                      onClick={() => handleTags(tag.id)}
                      className={selectedTags.includes(tag.id) ? "active" : ""}
                    >
                      {tag.name}
                    </Link>
                  </li>
                )
              ))}
              {typeof selectedTags}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
