import React, { useState } from "react";
import CommentForm from "./CommentForm";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";

interface CommentProps {
  comment: CommentObject;
  replies: CommentObject[];
  setActiveComment: React.Dispatch<React.SetStateAction<CommentState | null>>;
  activeComment: CommentState | null;
  updateComment: (text: string, id: string, parentId: string | null) => void;
  deleteComment: (id: string) => void;
  addComment: (text: string, parentId: string | null) => void;
  parentId?: string | null;
  currentUserId: string | null;
  HasHate: boolean;
  createwarningMessage: string | null;
  updatewarningMessage: string | null;
}

interface CommentObject {
  id: string;
  username: string;
  content: string;
  createdAt: string;
  userId: string;
  HasHate: boolean;
  parentId: string | null;
}

interface CommentState {
  id: string;
  type: "editing" | "replying";
}

const Comment: React.FC<CommentProps> = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId = null,
  currentUserId,
  createwarningMessage,
  updatewarningMessage,
}) => {
  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";
  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";
  const fiveMinutes = 300000;
  const timePassed =
    new Date().getTime() - new Date(comment.createdAt).getTime() > fiveMinutes;

  const canDelete =
    currentUserId === comment.userId && replies.length === 0 && !timePassed;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.userId && !timePassed;
  const replyId = parentId ? parentId : comment.id;
  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const handleMenuToggle = (postId: string) => {
    setMenuVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };
  const [reportReason, setReportReason] = useState<string>("");
  const handleReport = async (posts: CommentObject) => {
    try {
      const report = {
        ContentId: posts.id,
        UserId: posts.userId,
        ContentType: "Comment",
        Reason: reportReason,
        CreatedAt: new Date(),
      };
      console.log(report);
      await axios.post("http://localhost:5012/api/Report", report);
      setMenuVisible((prev) => ({ ...prev, [posts.id]: false }));
      setReportReason("");
      console.log("success");
    } catch (error) {
      console.error("Failed to report post:", error);
    }
  };
  return (
    <div key={comment.id} className="comment relative">
      <div className="absolute top-0 right-10">
        <BsThreeDots
          className="w-6 h-6 m-4 mr-6 text-[#FDB910] cursor-pointer"
          onClick={() => handleMenuToggle(comment.id)}
        />
        {menuVisible[comment.id] && (
          <div className="absolute top-10 right-10 bg-white border rounded-lg shadow-lg z-10">
            <div className="px-4 py-2">
              <textarea
                placeholder="Reason for reporting"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="border rounded-lg h-10 w-52"
              />
              <button
                onClick={() => handleReport(comment)}
                className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg mt-2 w-full"
              >
                Report
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="comment-image-container">
        <img src="/user-icon.png" alt="User icon" />
      </div>
      <div className="comment-right-part">
        <div className="comment-content flex flex-col">
          <div className="comment-author">{comment.userId}</div>
          <div>{createdAt}</div>
        </div>
        {!isEditing && <div className="comment-text">{comment.content}</div>}
        {isEditing && (
          <>
            {updatewarningMessage && (
              <div className="warning-message text-red-700">
                {updatewarningMessage}
              </div>
            )}
            <CommentForm
              submitLabel="Update"
              hasCancelButton
              initialText={comment.content}
              handleSubmit={(text: any) =>
                updateComment(text, comment.id, comment.parentId)
              }
              handleCancel={() => {
                setActiveComment(null);
              }}
            />
          </>
        )}
        <div className="comment-actions">
          {canReply && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "replying" })
              }
            >
              Reply
            </div>
          )}
          {canEdit && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "editing" })
              }
            >
              Edit
            </div>
          )}
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => deleteComment(comment.id)}
            >
              Delete
            </div>
          )}
        </div>
        {isReplying && (
          <>
            {createwarningMessage && (
              <div className="warning-message text-red-700">
                {createwarningMessage}
              </div>
            )}
            <CommentForm
              submitLabel="Reply"
              handleSubmit={(text: any) => addComment(text, replyId)}
            />
          </>
        )}
        {replies.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply.id}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                addComment={addComment}
                parentId={comment.id}
                replies={[]}
                currentUserId={currentUserId}
                HasHate={reply.HasHate}
                createwarningMessage={createwarningMessage}
                updatewarningMessage={updatewarningMessage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
