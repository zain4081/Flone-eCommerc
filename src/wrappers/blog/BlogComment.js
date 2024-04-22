import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BlogComment = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [expandedComments, setExpandedComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const postId = id ? id : await fetchFirstPostId();
        const response = await fetch(
          `http://127.0.0.1:8000/blog/posts/${postId}/comments/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        console.log("commented data = " + data);
        setComments(data.comments);
        setCount(data.count);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
        setCount(0);
      }
    };

    fetchComments();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-UK", options);
  };

  const fetchFirstPostId = async () => {
    const response = await fetch(`http://127.0.0.1:8000/blog/posts/`);
    const data = await response.json();
    return data.length > 0 ? data[0].id : null;
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

  const renderComment = (comment) => (
    <div key={comment.id} className="single-comment-wrapper mt-35">
      <div className="blog-comment-img">
        <img onClick={() => toggleComment(comment.id)} 
          src={process.env.PUBLIC_URL + "/assets/img/blog/comment-1.jpg"}
          alt=""
        />
      </div>
      <div className="blog-comment-content" > 
        <h4 onClick={() => toggleComment(comment.id)}>{comment.username}</h4>
        <span>{formatDate(comment.date)}</span>
        <span>
          <Link to={process.env.PUBLIC_URL + "/blog-details-standard/" + id}>
            {comment.likes_count} <i className="fa fa-comments-o" />
          </Link>
        </span>
        <p>{comment.content}</p>
        {isCommentExpanded(comment.id) &&
          comment.replies &&
          comment.replies.map((reply) => renderComment(reply))}
      </div>
    </div>
  );

  return (
    <Fragment>
      <div className="blog-comment-wrapper mt-55">
        <h4 className="blog-dec-title">comments : {count}</h4>
        {comments.map((comment) => renderComment(comment))}
      </div>
      <div className="blog-reply-wrapper mt-50">
      <h4 className="blog-dec-title">Post a Reply</h4>
      <form className="blog-form">
        <div className="row">
          <div className="col-md-12">
            <div className="text-leave">
              <input type="text" placeholder="Write your reply here" />
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
