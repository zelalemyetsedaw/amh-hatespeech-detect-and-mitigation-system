"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "@/components/AdminHeader";

interface Content {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

const HateSpeechPage = () => {
  const [posts, setPosts] = useState<Content[]>([]);
  const [comments, setComments] = useState<Content[]>([]);
  const [activeTab, setActiveTab] = useState<"Posts" | "Comments">("Posts");

  useEffect(() => {
    const fetchHateSpeechContent = async () => {
      try {
        const [postsResponse, commentsResponse] = await Promise.all([
          axios.get<Content[]>("http://localhost:5012/api/Post/getwithhate"),
          axios.get<Content[]>("http://localhost:5012/api/Comment/getwithhate")
        ]);

        setPosts(postsResponse.data);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Failed to fetch hate speech content:", error);
      }
    };

    fetchHateSpeechContent();
  }, []);

  const handleUnmarkAsHate = async (contentId: string, contentType: "Post" | "Comment") => {
    try {
      if (contentType === "Post") {
        await axios.put(`http://localhost:5012/api/Post/${contentId}/unmark-as-hate`);
        setPosts(posts.filter(post => post.id !== contentId));
      } else if (contentType === "Comment") {
        await axios.put(`http://localhost:5012/api/Comment/${contentId}/unmark-as-hate`);
        setComments(comments.filter(comment => comment.id !== contentId));
      }
    } catch (error) {
      console.error("Failed to unmark content as hate:", error);
    }
  };

  const renderTable = (content: Content[], contentType: "Post" | "Comment") => (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Number</th>
          <th className="px-4 py-2 border">Content</th>
          <th className="px-4 py-2 border">Action</th>
        </tr>
      </thead>
      <tbody>
        {content.map((item, index) => (
          <tr key={item.id}>
            <td className="px-4 py-2 border text-center">{index + 1}</td>
            <td className="px-4 py-2 border text-center">{item.content}</td>
            <td className="px-4 py-2 border text-center">
              <button
                onClick={() => handleUnmarkAsHate(item.id, contentType)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                UnHate
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <AdminHeader />
      <div className="w-4/5 mt-10 m-auto">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setActiveTab("Posts")}
            className={`px-4 py-2 mx-2 ${activeTab === "Posts" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("Comments")}
            className={`px-4 py-2 mx-2 ${activeTab === "Comments" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Comments
          </button>
        </div>
        <div className="overflow-x-auto">
          {activeTab === "Posts" ? renderTable(posts, "Post") : renderTable(comments, "Comment")}
        </div>
      </div>
    </div>
  );
};

export default HateSpeechPage;
