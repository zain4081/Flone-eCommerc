import React, { Fragment} from "react";
import { Link } from "react-router-dom";


const BlogPosts = (posts) => {
  const fetchposts= posts.posts;
  console.log("blogposts data: ", fetchposts);
  
 
  // date formate
   const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-UK', options);
  };
  return (
    
    <Fragment>
    {fetchposts.length >= 1 && fetchposts.map((post, index) => (
      <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
      <div className="blog-wrap-2 mb-30">
        <div className="blog-img-2">
          <Link to={process.env.PUBLIC_URL + "/blog-details-standard/"+post.id}>
            <img
              src={process.env.REACT_APP_PUBLIC_URL+post.image_url.resized}
              alt={post.title}
            />
          </Link>
        </div>
        <div className="blog-content-2">
          <div className="blog-meta-2">
            <ul>
              <li><li>{formatDate(post.date)}</li></li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                  {post.likes_count} <i className="fa fa-comments-o" />
                </Link>
              </li>
            </ul>
          </div>
          <h4>
            <Link to={process.env.PUBLIC_URL + "/blog-details-standard/"+post.id}>
            {post.title}
            </Link>
          </h4>
          <p dangerouslySetInnerHTML={{ __html:(post.content).slice(0, 25) }}/>
          <div className="blog-share-comment">
            <div className="blog-btn-2">
              <Link to={process.env.PUBLIC_URL + "/blog-details-standard/"+post.id}>
                read more
              </Link>
            </div>
            <div className="blog-share">
              <span>share :</span>
              <div className="share-social">
                <ul>
                  <li>
                    <a className="facebook" href="//facebook.com">
                      <i className="fa fa-facebook" />
                    </a>
                  </li>
                  <li>
                    <a className="twitter" href="//twitter.com">
                      <i className="fa fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a className="instagram" href="//instagram.com">
                      <i className="fa fa-instagram" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ))} 
    </Fragment>
  );
};

export default BlogPosts;