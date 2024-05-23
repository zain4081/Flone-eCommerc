import { Fragment, useEffect, useState } from "react";
import { useLocation} from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogPagination from "../../wrappers/blog/BlogPagination";
import BlogPosts from "../../wrappers/blog/BlogPosts";
import { useGetPostsMutation } from "../../services/blogApi";

const BlogStandard = () => {
    const [totalPages, setTotalPages] = useState(0);
  const [posts, setPosts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState(null);
  const { pathname } = useLocation();
  const [ getPosts ] = useGetPostsMutation();
  

  const fetchData = async (page = 1) => {
    try {
      let tags = selectedTags && selectedTags.length > 0 ? '&tags=[' + selectedTags+ ']': "";
      let categories = selectedCategories && selectedCategories.length > 0 ? '&category=[' + selectedCategories+ ']': "";

      const p_url = `posts/?p=${page}${search && search.length > 0 ? search : ''}${tags && tags.length > 0 ? tags : ''}${categories && categories.length > 0 ? categories : ''}`;
      const response = await getPosts(p_url);
      if (response.data) {
        setPosts(response.data.results);
        setTotalPages(response.data.total_pages);
      }
     
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTags, selectedCategories, search]);

  const handlePageChange = (page) => {
    fetchData(page);
  };
  const handleFilterChange = (filterType, filterId) => {
    if (filterType === "tag") {
      setSelectedTags(filterId);
    }
    else if (filterType === "category") {
      setSelectedCategories(filterId);
    } else if (filterType === "search"){
      setSearch(filterId);
    }
  };
  
  return (
    <Fragment>
      <SEO
        titleTemplate="Blog"
        description="Blog of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Blog", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row flex-row-reverse">
              <div className="col-lg-9">
                <div className="ml-20">
                  <div className="row">
                    {/* blog posts */}
                    <BlogPosts posts={posts} />
                  </div>

                  {/* blog pagination */}
                  <BlogPagination
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                {/* blog sidebar */}
                <BlogSidebar onFilterChange={handleFilterChange} />

              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default BlogStandard;
