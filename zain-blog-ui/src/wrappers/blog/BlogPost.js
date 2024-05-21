import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import { useGetVoteMutation, useSubmitVoteMutation, useUpdateVoteMutation } from "../../services/blogApi";

const BlogPost = () => {
  const { id } = useParams();
  const check = id;
  const [post, setPost] = useState(null);
  const [tags, setTags] = useState(null);
  const [prevID, setPrevPostId] = useState(null);
  const [nextID, setNextPostId] = useState(null);
  const { access_token } = getToken();
  const user_info = useSelector((state) => state.user);

  // vote
  const [vote, setVote] = useState(null);
  const [ submitVote] = useSubmitVoteMutation();
  const [ getVote ] = useGetVoteMutation();
  const [ updateVote ] = useUpdateVoteMutation();

  useEffect(() => {
    fetchPostVote();
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    console.log("fetchBlogPost")
    try {
      const post_id = id ? id : post[0].id
      const url = `http://127.0.0.1:8000/blog/posts/details/${post_id}/`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const postData = await response.json();
      setPost(postData);
      const mergedTags = postData.tag.reduce((acc, tagId, index) => {
        acc[tagId] = postData.tags_name[index];
        return acc;
      }, {});
      setTags(mergedTags)

    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally, you can handle the error here
    }
  };
  const fetchPostVote = async () => {
    console.log("fetchPostVote")
    try {
      const response = await getVote({"postId": id ? id : post[0].id, "access_token": access_token});
      console.log("vote data", response);
      if(response.data){
        
        setVote(response.data)

      }
      if(response.error){
        console.log("response.error", response.error);
        setVote(null);
      }
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  

  // next previous post id
  useEffect(() => {
    const fetchAdjacentPosts = async () => {
      console.log("fetchAdjacentPosts")
      try {
        const response = await fetch("http://127.0.0.1:8000/blog/posts/details");
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
            setVote(null);
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
  }, [id]);

  const handleVote = async (btn_status, user, post) => {
    if(vote){
      const data = {
        "id": vote.id,
        "status": btn_status,
        "user": user,
        "post": post,
        "comment": vote.comment,
      }
      try {
        const response = await updateVote({ "data": data, "postId": post});
        if (response) {

          fetchBlogPost();
          setVote(response.data)
          
        }else{
          console.log("response.error", response.error)
        }
      } catch (error) {
        console.error("Error updating vote:", error);
      }
    }else{
    const data = {
      "status": btn_status,
      "user": user,
      "post": post,
      "comment": null,
    }
    try {
      const response = await submitVote({ "data": data, "postId": post});
      if (response.data) {
        fetchBlogPost();
        setVote(response.data);
        
      }else{
        console.log("response.error", response.error)
        setVote(null);
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  };



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
                <Link >
                  {post.likes_count} 
                  <div className="votes-section">
                    {(vote && vote.status === "not_hit") || !vote ? (
                      <span className="not_hit" onClick={() => handleVote("like", user_info.id, post.id)}>
                        <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                        </span>
                    ) :null }
                    {vote && vote.status === "like"? (
                      <span className="like" onClick={() => handleVote("not_hit", user_info.id, post.id)}>
                      <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                    </span>
                    ) : null}
                    
                  </div>
                  {post.comments_count}
                  <i className="fa fa-comments-o" />
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
          
          {Object.entries(tags).map(([tagId, tagName], index, array) => (
            <li key={tagId}>
              <Link to={process.env.PUBLIC_URL + "/blog-standard/" + tagId}>
                {tagName}{index === array.length - 1 ? '' : ', '}
              </Link>
            </li>
          ))}
          
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

        {prevID !== post.id ? <Link to={process.env.PUBLIC_URL + "/blog-details-standard/"+prevID}><i className="fa fa-angle-left" /> prev post</Link> : <i className="fa" />}
        {nextID !== post.id ? <Link to={process.env.PUBLIC_URL + "/blog-details-standard/"+nextID}>next post <i className="fa fa-angle-right" /></Link>: <i className="fa" />}
      </div>
    </Fragment>
  );}

};



export default BlogPost;
