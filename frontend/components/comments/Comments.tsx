
'use client'
import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {
  getCommentsByPostId as getCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "../api";

interface CommentObject {
  id: string;
  username: string;
  content: string;
  createdAt: string;
  HasHate: boolean;
  parentId: string | null;
  userId: string;
}

interface CommentsProps {
  commentsUrl: string; // This is not used, you can remove it
  currentUserId: string;
  postid: string;
}

const Comments: React.FC<CommentsProps> = ({ commentsUrl, currentUserId, postid }) => {
  const [backendComments, setBackendComments] = useState<CommentObject[]>([]);
  const [activeComment, setActiveComment] = useState<CommentObject | null>(null);
  const [createwarningMessage, setCreateWarningMessage] = useState<string | null>(null);
  const [updatewarningMessage, setUpdateWarningMessage] = useState<string | null>(null);


  const rootComments = backendComments?.filter(
    
    (backendComment) =>
      backendComment?.parentId === null
  );
  console.log(rootComments);
  const getReplies = (commentId: string) =>
    backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

  const addComment = (text: string, parentId: string | null) => {
    createCommentApi(text, parentId, postid,currentUserId).then((response) => {
      if (typeof response === 'string') {
        setCreateWarningMessage(response);
        setTimeout(() => setCreateWarningMessage(null), 5000); 
      } else {
        setBackendComments([response, ...backendComments]);
        setActiveComment(null);
        setCreateWarningMessage(null);
      }
    });
  };

  const updateComment = (text: string, commentId: string,parentId:string|null) => {
    console.log(text,commentId,parentId,currentUserId,postid)
    updateCommentApi(text, commentId,postid,currentUserId,parentId).then((response) => {
      if (response !== '') {
        setUpdateWarningMessage(response);
        setTimeout(() => setUpdateWarningMessage(null), 5000); 
      } else {
        const updatedBackendComments = backendComments.map((backendComment) => {
          if (backendComment.id === commentId) {
            return { ...backendComment, content: text };
          }
          return backendComment;
        });
        setBackendComments(updatedBackendComments);
        setActiveComment(null);
        setUpdateWarningMessage(null);
      }
    });
  };

  const deleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      deleteCommentApi(commentId).then(() => {
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment.id !== commentId
        );
        setBackendComments(updatedBackendComments);
      });
    }
  };

  useEffect(() => {
    getCommentsApi(postid).then((data) => {
      setBackendComments(data);
      console.log(data);
    });

    console.log(backendComments);
  }, [postid]);

  return (
    <div className="comments ">
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">Write comment</div>
      {createwarningMessage && <div className="warning-message text-red-700">{createwarningMessage}</div>}
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            currentUserId={currentUserId}
            createwarningMessage={createwarningMessage}
            updatewarningMessage={updatewarningMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;



















// import React, { useState, useEffect } from "react";
// import CommentForm from "./CommentForm";
// import Comment from "./Comment";
// import {
//   getCommentsByPostId as getCommentsApi,
//   createComment as createCommentApi,
//   updateComment as updateCommentApi,
//   deleteComment as deleteCommentApi,
// } from "../api";

// interface CommentObject {
//   id: string;
//   username: string;
//   body: string;
//   createdAt: string;
//   parentId: string | null;
//   userId: string;
// }

// interface CommentsProps {
//   commentsUrl: string;
//   currentUserId: string;
//   postid: string;
// }

// const Comments: React.FC<CommentsProps> = ({ commentsUrl, currentUserId, postid }) => {
//   const [backendComments, setBackendComments] = useState<CommentObject[]>([]);
//   const [activeComment, setActiveComment] = useState<CommentObject | null>(null);

//   const rootComments = backendComments.filter(
//     (backendComment) => backendComment.parentId === null
//   );

//   const getReplies = (commentId: string) =>
//     backendComments
//       .filter((backendComment) => backendComment.parentId === commentId)
//       .sort(
//         (a, b) =>
//           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//       );

//   const addComment = (text: string, parentId: string | null) => {
//     createCommentApi(text, parentId).then((comment) => {
//       setBackendComments([comment, ...backendComments]);
//       setActiveComment(null);
//     });
//   };

//   const updateComment = (text: string, commentId: string) => {
//     updateCommentApi(text).then(() => {
//       const updatedBackendComments = backendComments.map((backendComment) => {
//         if (backendComment.id === commentId) {
//           return { ...backendComment, body: text };
//         }
//         return backendComment;
//       });
//       setBackendComments(updatedBackendComments);
//       setActiveComment(null);
//     });
//   };

//   const deleteComment = (commentId: string) => {
//     if (window.confirm("Are you sure you want to remove comment?")) {
//       deleteCommentApi().then(() => {
//         const updatedBackendComments = backendComments.filter(
//           (backendComment) => backendComment.id !== commentId
//         );
//         setBackendComments(updatedBackendComments);
//       });
//     }
//   };

//   useEffect(() => {
//     getCommentsApi().then((data) => {
//       setBackendComments(data);
//     });
//   }, []);

//   return (
//     <div className="comments ">
//       <h3 className="comments-title">Comments</h3>
//       <div className="comment-form-title">Write comment</div>
//       <CommentForm submitLabel="Write" handleSubmit={addComment} />
//       <div className="comments-container">
//         {rootComments.map((rootComment) => (
//           <Comment
//             key={rootComment.id}
//             comment={rootComment}
//             replies={getReplies(rootComment.id)}
//             activeComment={activeComment}
//             setActiveComment={setActiveComment}
//             addComment={addComment}
//             deleteComment={deleteComment}
//             updateComment={updateComment}
//             currentUserId={currentUserId}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Comments;
