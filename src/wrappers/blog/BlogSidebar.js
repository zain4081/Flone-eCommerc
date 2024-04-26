import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetCategoriesMutation,
  useGetTagsMutation,
} from "../../services/blogApi";

const BlogSidebar = ({ onFilterChange }) => {
  const [getTags] = useGetTagsMutation();
  const [getCategories] = useGetCategoriesMutation();
  const [tags, setTags] = useState(null);
  const [categories, setCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
  });

  const handleFilterChange = (filterType, filterId) => {
    onFilterChange(filterType, filterId);
  };

  const handleCategories = (filterId) => {
    if (selectedCategories.includes(filterId)) {
      setSelectedCategories(selectedCategories.filter((t) => t !== filterId));
    } else {
      setSelectedCategories([...selectedCategories, filterId]);
    }
  };

  useEffect(() => {
    handleFilterChange("category", selectedCategories);
  }, [selectedCategories]);

  return (
    <div className="sidebar-style">
      <div className="sidebar-widget">
        <h4 className="pro-sidebar-title">Search </h4>
        <div className="pro-sidebar-search mb-55 mt-25">
          <form className="pro-sidebar-search-form" action="#">
            <input type="text" placeholder="Search here..." />
            <button>
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
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
                <li key={tag.id}>
                  <Link onClick={() => handleFilterChange("tag", tag.id)}>
                    {tag.name} {tag.posts_count}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
