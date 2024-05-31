import React, { useState, useEffect } from "react";
import { useGetTagsMutation, useGetCategoriesMutation } from "../../services/blogApi";
import { useSelector } from "react-redux";

const CustomFilter = ({ onFilterChange }) => {
  const [getTags] = useGetTagsMutation();
  const [getCategories] = useGetCategoriesMutation();
  const [tags, setTags] = useState(null);
  const [categories, setCategories] = useState(null);
  const [searchFormData, setSearchFormData] = useState({
    startDate: "",
    endDate: "",
    categories: [],
    tags: [],
  });
  const [popoverType, setPopoverType] = useState(null); // State to manage popover visibility
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
  }, [getTags, getCategories]);

  const handleSearchForm = (e) => {
    e.preventDefault();
    const searchFilters = `${searchFormData.tags.length > 0 ? '&tags=['+ searchFormData.tags +']' : ''}${searchFormData.categories.length > 0 ? '&category=['+ searchFormData.categories+ ']' : ''}${searchFormData.startDate.length > 0  ? '&start_date='+ searchFormData.startDate : ''}${searchFormData.endDate.length > 0 ? '&end_date='+ searchFormData.endDate : ''}`;

    onFilterChange(searchFilters);
    console.log("Search form data:", searchFormData);
    setPopoverType(null);
  };

  const togglePopover = (type) => {
    setPopoverType(popoverType === type ? null : type);
  };

  const handleCheckboxChange = (listType, id) => {
    setSearchFormData((prevFormData) => {
      const newList = prevFormData[listType].includes(id)
        ? prevFormData[listType].filter((t) => t !== id)
        : [...prevFormData[listType], id];
      return { ...prevFormData, [listType]: newList };
    });
  };

  return (
    <div className="sidebar-style">
      {((user_info && user_info.role === "superuser") || 1 === 1) && (
        <div className="sidebar-widget">
          <h4 className="pro-sidebar-title">Search </h4>
          <div className="pro-sidebar-search mb-55 mt-25">
            <form className="pro-sidebar-search-form" onSubmit={handleSearchForm}>
            <label htmlFor="startDate" className="search-form-label">From Date</label>
              <input
                type="date"
                name="startDate"
                value={searchFormData.startDate}
                onChange={(e) => setSearchFormData({ ...searchFormData, startDate: e.target.value })}
                placeholder="From Date"
              />
              <label htmlFor="endDate" className="search-form-label">To Date</label>
              <input
                type="date"
                name="endDate"
                value={searchFormData.endDate}
                onChange={(e) => setSearchFormData({ ...searchFormData, endDate: e.target.value })}
                placeholder="to Date"
              />
              <div>
                <button type="button" onClick={() => togglePopover('category')} className="btn btn-secondary">
                  Select Categories
                </button>
                {popoverType === 'category' && (
                  <PopoverList
                    items={categories}
                    selectedItems={searchFormData.categories}
                    onChange={(id) => handleCheckboxChange('categories', id)}
                  />
                )}
              </div>
              <div>
                <button type="button" onClick={() => togglePopover('tag')} className="btn btn-secondary">
                  Select Tags
                </button>
                {popoverType === 'tag' && (
                  <PopoverList
                    items={tags}
                    selectedItems={searchFormData.tags}
                    onChange={(id) => handleCheckboxChange('tags', id)}
                  />
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="sidebar-widget">
        <h4 className="pro-sidebar-title">Recent Projects </h4>
        <div className="sidebar-project-wrap mt-30">{/* Recent projects */}</div>
      </div>
    </div>
  );
};

const PopoverList = ({ items, selectedItems, onChange }) => (
  <div className="popover">
    <div className="popover-content">
      {items && items.map((item) => (
        <div key={item.id}>
          <input
            type="checkbox"
            id={item.id}
            checked={selectedItems.includes(item.id)}
            onChange={() => onChange(item.id)}
          />
          <label htmlFor={item.id}>{item.name}</label>
        </div>
      ))}
    </div>
  </div>
);

export default CustomFilter;
