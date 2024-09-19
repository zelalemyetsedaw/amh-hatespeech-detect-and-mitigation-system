import axios from "axios";

const API_URL = "http://localhost:5012"; // Update with your backend API URL

export const getCommentsByPostId = async (postId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/comment/bypost/${postId}`);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

export const createComment = async (text: string, parentId: string | null, postId: string, userId: string) => {
  try {
    console.log({ content: text, parentId, postId,userId })
    const response = await axios.post(`${API_URL}/api/comment`, { content: text, parentId, postId,userId });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    return null;
  }
};

export const updateComment = async (text: string, commentId: string,postId:string,userId:string,parentId:string|null) => {
  try {
    const response = await axios.put(`${API_URL}/api/comment/${commentId}`, { content: text,postId,userId,parentId });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    return null;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    await axios.delete(`${API_URL}/api/comment/${commentId}`);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
};





























// export const getComments = async () => {
//     return [
//       {
//         id: "1",
//         body: "First comment",
//         username: "Jack",
//         userId: "1",
//         parentId: null,
//         createdAt: "2021-08-16T23:00:33.010+02:00",
//       },
//       {
//         id: "2",
//         body: "Second comment",
//         username: "John",
//         userId: "2",
//         parentId: null,
//         createdAt: "2021-08-16T23:00:33.010+02:00",
//       },
//       {
//         id: "3",
//         body: "First comment first child",
//         username: "John",
//         userId: "2",
//         parentId: "1",
//         createdAt: "2021-08-16T23:00:33.010+02:00",
//       },
//       {
//         id: "4",
//         body: "Second comment second child",
//         username: "John",
//         userId: "2",
//         parentId: "2",
//         createdAt: "2021-08-16T23:00:33.010+02:00",
//       },
//     ];
//   };
  
//   export const createComment = async (text:any, parentId = null) => {
//     return {
//       id: Math.random().toString(36).substr(2, 9),
//       body: text,
//       parentId,
//       userId: "1",
//       username: "John",
//       createdAt: new Date().toISOString(),
//     };
//   };
  
//   export const updateComment = async (text:any) => {
//     return { text };
//   };
  
//   export const deleteComment = async () => {
//     return {};
//   };