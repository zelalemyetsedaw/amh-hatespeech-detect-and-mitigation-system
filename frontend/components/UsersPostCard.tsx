"use client";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { FaRegCommentAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import axios from "axios";
import Comments from "./comments/Comments";

interface Post {
  id: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: string;
  hasHate: boolean;
  username?: string;
}

interface User {
  id: string;
  email: string;
  username: string;
}

const UsersPostCard = ({ useridd }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log(parsedUser);

      console.log(storedUser);

      const fetchPosts = async () => {
        const response = await axios.get<Post[]>(
          `http://localhost:5012/api/Post/post/${parsedUser.id}`
        );
        const postsWithUsername = await Promise.all(
          response.data.map(async (post) => {
            const userResponse = await axios.get(
              `http://localhost:5012/api/user/${post.userId}`
            );
            const username = userResponse.data.username;
            return { ...post, username };
          })
        );
        setPosts(postsWithUsername);
      };
      fetchPosts();
    }
  }, []);

  const handleCommentClick = (postId: string) => {
    setSelectedPostId(postId === selectedPostId ? null : postId);
  };

  const handleUpdateClick = (postId: string) => {
    setEditingPostId(postId);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setNewContent(post.content);
    }
  };

  const handleUpdate = async (postId: string) => {
    try {
      const updatedPost = {
        ...posts.find((p) => p.id === postId),
        content: newContent,
      };
      await axios.put(`http://localhost:5012/api/Post/${postId}`, updatedPost);
      const updatedPosts = posts.map((p) =>
        p.id === postId ? { ...p, content: newContent } : p
      );
      setPosts(updatedPosts);
      setEditingPostId(null);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const handleDelete = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || !user || user.id !== post.userId) {
      // User can only delete their own posts
      return;
    }
    try {
      await axios.delete(`http://localhost:5012/api/Post/${postId}`);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

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
  const handleReport = async (posts: Post) => {
    if (!user) return;

    try {
      const report = {
        ContentId: posts.id,
        UserId: posts.userId,
        ContentType: "Post",
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
    <>
      {posts.map((post) => (
        <div key={post.id} className="border-4 bg-white">
          <div className="relative flex items-end justify-end">
            <BsThreeDots
              className="w-6 h-6 m-4 mr-6 text-[#FDB910] cursor-pointer"
              onClick={() => handleMenuToggle(post.id)}
            />
            {menuVisible[post.id] && (
              <div className="absolute top-12 right-6 bg-white border rounded-lg shadow-lg z-10">
                <div className="px-4 py-2">
                  <textarea
                    placeholder="Reason for reporting"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="border rounded-lg w-full"
                  />
                  <button
                    onClick={() => handleReport(post)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 w-full"
                  >
                    Report
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 p-2 pl-10">
            <IoPerson className="w-10 h-10 rounded-lg bg-[#FDB910]" />
            <div>
              <p className="text-sm"> {post.username} </p>
              <p className="text-sm"> {post.createdAt} </p>
              {post.hasHate && (
                <p className="text-red-600 font-bold">This post contains hate speech</p>
              )}
            </div>
          </div>

          <div className="p-4 pl-10">
            {editingPostId === post.id ? (
              <div className="flex gap-2 items-center">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="border-2 rounded-lg w-full"
                />
                <button
                  onClick={() => handleUpdate(post.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Update
                </button>
              </div>
            ) : (
              <p>{post.content}</p>
            )}
          </div>

          <div className="flex justify-between px-10">
            <div>{post.likes} likes</div>
            <div>10 comments</div>
          </div>

          <div className="flex gap-10 p-4 pl-10">
            <div className="flex gap-1 items-center cursor-pointer">
              <BiLike className="w-8 h-8" />
              <p>Like</p>
            </div>
            <div
              onClick={() => handleCommentClick(post.id)}
              className="flex gap-1 items-center cursor-pointer"
            >
              <FaRegCommentAlt className="w-6 h-6" />
              <p> comment </p>
            </div>
            {user && user.id === post.userId && (
              <>
                <div
                  onClick={() => handleUpdateClick(post.id)}
                  className="flex gap-1 items-center cursor-pointer"
                >
                  <FaRegCommentAlt className="w-6 h-6" />
                  <p> Update </p>
                </div>
                <div
                  onClick={() => handleDelete(post.id)}
                  className="flex gap-1 items-center cursor-pointer"
                >
                  <FaRegCommentAlt className="w-6 h-6" />
                  <p> Delete </p>
                </div>
              </>
            )}
          </div>
          {selectedPostId === post.id && (
            <Comments
              commentsUrl="http://localhost:5012/api/Comment"
              currentUserId={user.id}
              postid={post.id}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default UsersPostCard;
