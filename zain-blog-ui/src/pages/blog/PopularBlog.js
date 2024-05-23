import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogPostsNoSidebar from "../../wrappers/blog/BlogPostsNoSidebar";
import { useGetPostsMutation } from "../../services/blogApi";

const TrendingBlog = () => {
  const [posts, setPosts] = useState([]);
  const { pathname } = useLocation();
  const [ getPosts ] = useGetPostsMutation();

  const fetchData = async () => {
    try {
      const p_url = `posts/popular`;
      const response = await getPosts(p_url);
      if (response.data) {
        setPosts(response.data);
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
  }, []);

   console.log("popluar ", posts);
  
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
