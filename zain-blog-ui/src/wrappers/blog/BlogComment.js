import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostId, getToken } from "../../services/localStorageService";
import { useSelector } from "react-redux";
import {
  useGetCommentsMutation,
  useSubmitCommentMutation,
  useSubmitReplyMutation,
} from "../../services/blogApi";
import { useAddNotificationMutation } from "../../services/notifyApi";

const BlogComment = (firstPostId) => {
  const { access_token } = getToken();
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [recipient, setRecipient] = useState();
  const [count, setCount] = useState(0);
  const [expandedComments, setExpandedComments] = useState([]);
  const [currentPostId, setCurrentPostId] = useState();
  const user_info = useSelector((state) => state.user);
  const [submitCommentForm] = useSubmitCommentMutation();
  const [submitReplyForm] = useSubmitReplyMutation();
  const [addNotification] = useAddNotificationMutation();
  const [isReplying, setIsReplying] = useState(false);


  // Comment Form Handler
  const [commentFormData, setCommentFormData] = useState({
    content: "",
    post: "",
    user: user_info.id,
  });
  
  const handleCommentChange = (e) => {
    setCommentFormData({
      ...commentFormData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleCommentForm = (postId, content) => {
    setCommentFormData({
      content: content,
      post: postId,
      user: user_info.id,
    });
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log("current id", currentPostId)
    console.log("id",id);
    const res = await submitCommentForm({ "data": commentFormData, "access_token": access_token, "postId": currentPostId ? currentPostId : id});
    if (res.error) {
      console.log("errors are", res.error);
    }
    if (res.data) {
      console.log("response of comments are",res.data);
      
      fetchComments(); // Fetch comments again after submitting a new comment
      setCommentFormData({  // Reset the form data
        content: "",
        post: currentPostId ? currentPostId : id,
        user: user_info.id,
      });
    }
  };

  // Comment Reply Form handler
  const [editFormData, setEditFormData] = useState({
    content: "",
    commentId: null,
  });

  const toggleEditForm = (commentId, content, comment_user) => {
    setRecipient(comment_user)
    setEditFormData({
      content: content,
      parent_comment: commentId,
      user: user_info.id,
    });
  };
  
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await submitReplyForm({ "data": { ...editFormData }, "access_token": access_token, "postId": currentPostId ? currentPostId : id });
    if (res.error) {
      console.log("errors are", res.error);
    }
    if (res.data) {
      const message = `${user_info.name} Reply to your Comment`;
      const data ={
        "recipient": recipient,
        "message": message,
      }

      console.log("notfication data", data);
      const response = await addNotification({'data': data, 'access_token':access_token});
      if(response.data){
        console.log("add notfication", response.data);
      }else{
        console.log("add notfication", response);
      }
      fetchComments();
      console.log("res.data", res.data)
      // setIsEditing(null);
      setEditFormData({
        content: "",
        commentId: null,
      });
    }
  };


  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const postId = id ? id : await fetchFirstPostId();
      setCurrentPostId(postId);
      const response = await fetch(`http://127.0.0.1:8000/blog/posts/${postId}/comments/`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const commentsDataGet = await response.json();
      setComments(commentsDataGet.comments);
      setCount(commentsDataGet.count);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
      setCount(0);
    }
  }, [id, access_token, setCurrentPostId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-UK", options);
  };

  const fetchFirstPostId = async () => {
    const response = await fetch(`http://127.0.0.1:8000/blog/first-post-id/`);
    const fetchFirstPostData = await response.json();
    return fetchFirstPostData.length > 0 ? fetchFirstPostData[0].id : null;
  };

  const toggleComment = (commentId) => {
    setExpandedComments((prevState) =>
      prevState.includes(commentId)
        ? prevState.filter((id) => id !== commentId)
        : [...prevState, commentId]
    );
  };

  const isCommentExpanded = (commentId) => {
    return expandedComments.includes(commentId);
  };

  // Render Comments and Replies
  const renderComment = (comment, depth = 0) => {
    const maxDepth = 3;

    const toggleReplyForm = (commentId) => {
      setIsReplying((prevId) => (prevId === commentId ? null : commentId));
    };

    return (
      <div key={comment.id}>
        <div className="single-comment-wrapper" style={{ marginLeft: `${depth * 40}px` }}>
          <div className="blog-comment-img">
          
            <img
              src={process.env.PUBLIC_URL + "/assets/img/blog/comment-1.jpg"}
              alt=""
              onClick={() => toggleComment(comment.id)}
            />
            
          </div>
          
          <div className="blog-comment-content">
          <h4>{comment.user_name}</h4>
            <span>{formatDate(comment.date)}</span>
            <p>{comment.content}</p>
            <div className="comment-details">
              <span>
                {comment.likes_count}{" "}
                <i className="fa fa-thumbs-up" aria-hidden="true"></i>
              </span>
              {depth < maxDepth && (
                <span onClick={() => toggleReplyForm(comment.id)}>
                  <u>{isReplying === comment.id ? "Cancel Reply" : "Reply"}</u>
                </span>
              )}
              <span onClick={() => toggleComment(comment.id)}><i className="fa fa-comments-o" aria-hidden="true"> View Replies</i></span>
            </div>
          </div>
        </div>
        {isReplying === comment.id && (
          <div className="reply-form-wrapper" style={{ marginLeft: `${(depth + 1) * 20}px` }}>
            <form className="blog-form" onSubmit={handleEditSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="text-leave">
                    <input 
                      type="text"
                      name="content"
                      placeholder={`Reply ${comment.user_name}`}
                      value={editFormData.content}
                      onChange={handleEditChange}
                    />
                    <button type="submit" onClick={() => toggleEditForm(comment.id, editFormData.content, comment.user)}><i className="fa fa-angle-right"></i></button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
        {isCommentExpanded(comment.id) &&
          comment.replies &&
          comment.replies.map((reply) => renderComment(reply, depth + 1))}
      </div>
    );
  };

  

  return (
    <Fragment>
      <div className="blog-comment-wrapper mt-55">
        <h4 className="blog-dec-title">comments : {count}</h4>
        {comments.map((comment) => renderComment(comment))}
      </div>
      <div className="blog-reply-wrapper mt-50">
        <h4 className="blog-dec-title">Post a Reply</h4>
        <form className="blog-form" onSubmit={handleCommentSubmit}>
          <div className="row ">
            <div className="col-md-12">
              <div className="text-leave">
                <input 
                  type="text" 
                  name="content"
                  placeholder="Write your reply here"
                  value={commentFormData.content}
                  onChange={handleCommentChange}
                />
                <button type="submit" onClick={() => toggleCommentForm(currentPostId ? currentPostId : id, commentFormData.content)}><i className="fa fa-angle-double-right"></i></button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default BlogComment;
