import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import { useSelector } from "react-redux";
import {
  useGetCommentsMutation,
  useSubmitCommentMutation,
  useSubmitReplyMutation,
} from "../../services/blogApi";

const BlogComment = () => {
  const { access_token } = getToken();
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [expandedComments, setExpandedComments] = useState([]);
  const [currentPostId, setCurrentPostId] = useState();
  const user_info = useSelector((state) => state.user);
  const [submitCommentForm] = useSubmitCommentMutation();
  const [submitReplyForm] = useSubmitReplyMutation();
  const [getComments] = useGetCommentsMutation();
  const [isReplying, setIsReplying] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const postId = id ? id : await fetchFirstPostId();
      setCurrentPostId(postId);
      const response = await fetch(`http://127.0.0.1:8000/blog/posts/${postId ? postId : '1'}/comments/`, {
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
    const response = await fetch(`http://127.0.0.1:8000/blog/posts/`);
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

  // Submit comment reply
  const [replyFormData, setReplyFormData] = useState({
    content: "",
    parent_comment: "",
    user: user_info.id,
  });
  const handleReplyChange = (e) => {
    setReplyFormData({
      ...replyFormData,
      [e.target.name]: e.target.value,
    });
  };
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const res = await submitReplyForm({ "data": replyFormData, "access_token": access_token, "postId": currentPostId ? currentPostId : id });
    if (res.error) {
      console.log("errors are", res.error);
    }
    if (res.data) {
      fetchComments(); // Fetch comments again after submitting a new comment
      setReplyFormData({  // Reset the form data
        content: "",
        parent_comment: "",
        user: user_info.id,
      });
      
    }
  };

  const renderComment = (comment, depth = 0) => {
    const maxDepth = 3;

    const toggleReplyForm = (commentId) => {
      setIsReplying((prevId) => (prevId === commentId ? null : commentId));
      setReplyFormData({ ...replyFormData, parent_comment: commentId });
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
            <form className="blog-form" onSubmit={handleReplySubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="text-leave">
                    <input 
                      type="text"
                      name="content"
                      placeholder={`Reply ${comment.user_name}`}
                      value={replyFormData.content}
                      onChange={handleReplyChange}
                    />
                    <button type="submit"><i className="fa fa-angle-right"></i></button>
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

  // Submit comment
  const [commentFormData, setCommentFormData] = useState({
    content: "",
    post: currentPostId ? currentPostId : id,
    user: user_info.id,
  });
  const handleCommentChange = (e) => {
    setCommentFormData({
      ...commentFormData,
      [e.target.name]: e.target.value,
    });
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const res = await submitCommentForm({ "data": commentFormData, "access_token": access_token });
    if (res.error) {
      console.log("errors are", res.error);
    }
    if (res.data) {
      fetchComments(); // Fetch comments again after submitting a new comment
      setCommentFormData({  // Reset the form data
        content: "",
        post: currentPostId ? currentPostId : id,
        user: user_info.id,
      });
    }
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
                <button type="submit"><i className="fa fa-angle-double-right"></i></button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default BlogComment;
