import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BlogPost = (root) => {
  const { id } = useParams();
  const check = id;
  const [post, setPost] = useState(null);
  const [prevID, setPrevPostId] = useState(null);
  const [nextID, setNextPostId] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const post_id = id ? id : post[0].id
        const url = `http://127.0.0.1:8000/blog/posts_wp/${post_id}/`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const postData = await response.json();
        setPost(postData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally, you can handle the error here
      }
    };

    fetchBlogPost();
  }, [id]);

  // next previous post id
  useEffect(() => {
    const fetchAdjacentPosts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/blog/posts_wp/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const postData = await response.json();
        // postData = postData.results
        console.log("blogpost   = ", postData)

  
        if (!check) {
          // If id is null, set current post to the first post in the postData array
          if (postData.length > 0) {
            setPost(postData[0]);
            
            
            // Set nextPostId to the ID of the second post if it exists
            setNextPostId(postData.length > 1 ? postData[1].id : null);
            // Set prevPostId to null as there's no previous post
            setPrevPostId(postData.length > 1 ? postData[0].id : null);
          } else {
            // If postData is empty, set everything to null
            setPost(null);
            
            setNextPostId(null);
            setPrevPostId(null);
          }
        } else {
          const currentIndex = postData.findIndex(post => post.id === parseInt(id));
          
          if (currentIndex !== -1) {
            if (currentIndex < postData.length - 1) {
              setNextPostId(postData[currentIndex + 1].id);
            } else {
              // Set nextPostId to the ID of the last post if current post is the last post
              setNextPostId(postData[postData.length - 1].id);
            }
            
            if (currentIndex > 0) {
              setPrevPostId(postData[currentIndex - 1].id);
            } else {
              // Set prevPostId to null if current post is the first post
              setPrevPostId(postData[currentIndex].id);
            }
  
            // Set the current post
            setPost(postData[currentIndex]);
          } else {
            // Reset nextPostId and prevPostId if currentIndex is -1
            setNextPostId(null);
            setPrevPostId(null);
            setPost(null);
          }
        }
      } catch (error) {
        console.error("Error fetching adjacent posts:", error);
        // Optionally, you can handle the error here
      }
    };
  
    fetchAdjacentPosts();
    console.log(post)
  }, [id]);

  


   const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-UK', options);
  };
  if(!post){
    console.log("error !post")
  }else{
  return (
    <Fragment>
      <div className="blog-details-top">
        <div className="blog-details-img">
          <img
            alt=""
            src={post.image}
          />
        </div>
        <div className="blog-details-content">
          <div className="blog-meta-2">
            <ul>
              <li>{formatDate(post.date)}</li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                  {post.likes_count} <i className="fa fa-comments-o" />
                </Link>
              </li>
            </ul>
          </div>
          <h3>{post.title} i</h3>
          <p dangerouslySetInnerHTML={{ __html:(post.content) }}/>
        </div>
      </div>
      <div className="tag-share">
        <div className="dec-tag">
          <ul>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                lifestyle ,
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                interior ,
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                outdoor
              </Link>
            </li>
          </ul>
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
      <div className="next-previous-post">
        {/* <Link to={process.env.PUBLIC_URL + "/blog-details-standard/"+prevID}><i className="fa fa-angle-left" /> prev post</Link>
        <Link to={process.env.PUBLIC_URL + "/blog-details-standard/"+nextID}>next post <i className="fa fa-angle-right" /></Link> */}

        {prevID != post.id ? <Link to={process.env.PUBLIC_URL + "/blog-details-standard/"+prevID}><i className="fa fa-angle-left" /> prev post</Link> : <i className="fa" />}
        {nextID != post.id ? <Link to={process.env.PUBLIC_URL + "/blog-details-standard/"+nextID}>next post <i className="fa fa-angle-right" /></Link>: <i className="fa" />}
      </div>
    </Fragment>
  );}

};

export default BlogPost;
