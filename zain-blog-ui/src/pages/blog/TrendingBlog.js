import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogPostsNoSidebar from "../../wrappers/blog/BlogPostsNoSidebar";
import { useGetTredingPostsMutation } from "../../services/blogApi";
import { getToken } from "../../services/localStorageService";

const TrendingBlog = () => {
  const [posts, setPosts] = useState([]);
  const { pathname } = useLocation();
  const [ getPosts ] = useGetTredingPostsMutation();
  const {access_token } = getToken();
  const navigate = useNavigate();
  
  const fetchData = async () => {
    try {
      const p_url = `posts/trending`;
      const response = await getPosts({'url': p_url, 'access_token': access_token});
      console.log("response trending", response)
      if (response.data) {
        setPosts(response.data);
      }
      if (!response.ok) {
        if(response.error.status === 403){
          navigate('/subscribe');
        }
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

   console.log("trending ", posts);
  
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
              <div className="col-lg-12">
                <div className="ml-20">
                  <div className="row">
                    {/* blog posts */}
                    <BlogPostsNoSidebar posts={posts} />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default TrendingBlog;
