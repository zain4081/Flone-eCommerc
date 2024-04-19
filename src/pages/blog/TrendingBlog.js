import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogPosts from "../../wrappers/blog/BlogPosts";

const TrendingBlog = () => {
  const [posts, setPosts] = useState([]);
  const { pathname } = useLocation();
  console.log("trending")
  const fetchData = async () => {
    try {
      const url = `http://127.0.0.1:8000/blog/posts/trending/`;
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setPosts(data);
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
              <div className="col-lg-9">
                <div className="ml-20">
                  <div className="row">
                    {/* blog posts */}
                    <BlogPosts posts={posts} />
                  </div>

                </div>
              </div>
              <div className="col-lg-3">
                {/* blog sidebar */}
                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default TrendingBlog;
