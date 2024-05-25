import { Fragment, useState, useEffect } from "react"; 
import { useLocation } from "react-router-dom"; 
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Searchbar from "../../wrappers/blog/Searchbar";
import BlogPagination from "../../wrappers/blog/BlogPagination";
import BlogPostsNoSidebar from "../../wrappers/blog/BlogPostsNoSidebar";
import { useGetPostsMutation } from "../../services/blogApi";

const BlogElasticSearch = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState(null);
  const { pathname } = useLocation();
  const [ getPosts ] = useGetPostsMutation();

  const fetchData = async (page = 1) => {
    console.log("fetching", page);
    try {

      const p_url = `posts/?p=${page}${search && search.length > 0 ? search : ''}`;
      const response = await getPosts(p_url);
      if (response.data) {
        console.log("response: standard", response.data)
        setPosts(response.data.results);
        setTotalPages(response.data.total_pages);
      }
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handlePageChange = (page) => {
    fetchData(page);
  };
  const handleFilterChange = (filterType, filterId) => {
    if (filterType === "search"){
      // console.log("search",filterId);
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
        <div className="blog-area pt-20 pb-100">
          <div className="container">
            <div className="row flex-row-reverse">
            <div className="col-lg-12">
                {/* blog searchbar */}
                <Searchbar onFilterChange={handleFilterChange} />
              </div>
              <div className="col-lg-12">
                <div className="ml-20">
                  <div className="row">
                    {/* blog posts */}
                    <BlogPostsNoSidebar posts={posts} />
                  </div>

                  {/* blog pagination */}
                  <BlogPagination
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default BlogElasticSearch;
