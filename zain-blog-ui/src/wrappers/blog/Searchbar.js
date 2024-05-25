import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetElasticIndexMutation } from "../../services/blogApi";

const Searchbar = ({ onFilterChange}) => {
  const [ search , setSearch ] = useState(null);
  const [ indexData, setIndexData ] = useState(null);
  const [check, setCheck] = useState(0);
  const [ getElasticData ] = useGetElasticIndexMutation({});
  const user_info = useSelector((state) => state.user);
  
  const fetchIndexing = async (search_index) => {
    try {
      const p_url = `post-search/suggest/?title__completion=${search_index}`;
      const response = await getElasticData(p_url);
      const data_list = response.data["title__completion"][0]["options"]
      console.log("lenght", data_list.length);
        if(data_list.length > 0){

          console.log("datalist", data_list)
          setIndexData(data_list)
        }else{
          
          setIndexData({});
        }
        
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
// if url contains param of tag then
console.log("indexData")
console.log(indexData ? indexData : null)

  const handleFilterChange = (filterType, filterId) => {
    onFilterChange(filterType, filterId);
  };

  const selectSuggestionHandler = (suggesstion) => {
    console.log("suggession called", suggesstion)
    setSearchFormData({
      custom: suggesstion,
    });
  };

  const [searchFormData, setSearchFormData] = useState({
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
    if(search || searchFormData){
      const sfilter = `&search=${searchFormData.custom}`
      // const searchFilters = `${searchFormData.custom.length > 0 ? '&search='+ searchFormData.custom : ''}${search && search.startDate.length > 0 && check === 3 ? '&start_date='+ search.startDate : ''}${search && search.endDate.length > 0 && check === 3 ? '&end_date='+ search.endDate : ''}`;
      handleFilterChange("search", sfilter)
      setSearchFormData({
        custom: '',
      });
      setIndexData({});
    }


  }, [search]);

  useEffect(() => {
    fetchIndexing(searchFormData.custom)
  }, [searchFormData.custom, searchFormData]);


  return (
    <div className="sidebar-style">
      {(user_info && user_info.role === "superuser") ? (
        <div className="sidebar-widget">
          <h4 className="pro-sidebar-title">Search </h4>
          <div className="pro-sidebar-search mb-55 mt-25">
            <form className="pro-sidebar-search-form" onSubmit={handleSearchForm}>
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
              <div className="suggestionList">
                {indexData && indexData.length >= 1 && indexData.map((data, index) => (
                  <div 
                    key={index} 
                    className="suggestion"
                    onClick={() => selectSuggestionHandler(data.text)}
                  >
                    <span className="postTitle">{data.text}</span>
                    <span className="postCategory">Category:{data._source['category'].name}</span>
                  </div>
                ))}
              </div>

            </form>
          </div>
        </div>
      ) : null}
      
      
    </div>
  );
};

export default Searchbar;
