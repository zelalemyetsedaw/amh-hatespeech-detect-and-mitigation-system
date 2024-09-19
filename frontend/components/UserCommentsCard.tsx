import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoPerson } from "react-icons/io5";
import axios from "axios";
interface User {
    id: string;
    email: string;
    username: string;
  }
  
interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  hasHate: boolean;
  username?: string;
}

interface UserCommentsCardProps {
  userId: string;
}

const UserCommentsCard: React.FC<UserCommentsCardProps> = ({ userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [reportReason, setReportReason] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get<Comment[]>(
          `http://localhost:5012/api/comment/byuser/${userId}`
        );
        const commentsWithUsername = await Promise.all(
          response.data.map(async (comment) => {
            const userResponse = await axios.get(
              `http://localhost:5012/api/user/${comment.userId}`
            );
            const username = userResponse.data.username;
            return { ...comment, username };
          })
        );
        setComments(commentsWithUsername);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    if (userId) {
      fetchComments();
    }
  }, [userId]);

  const handleMenuToggle = (commentId: string) => {
    setMenuVisible((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReport = async (comment: Comment) => {
    if (!user) return;

    try {
      const report = {
        ContentId: comment.id,
        UserId: comment.userId,
        ContentType: "Comment",
        Reason: reportReason,
        CreatedAt: new Date(),
      };
      console.log(report);
      await axios.post("http://localhost:5012/api/Report", report);
      setMenuVisible((prev) => ({ ...prev, [comment.id]: false }));
      setReportReason("");
      console.log("Report successful");
    } catch (error) {
      console.error("Failed to report comment:", error);
    }
  };

  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="border-4 bg-white p-4 mb-4 rounded-lg relative">
          <div className="relative flex items-end justify-end">
            <BsThreeDots
              className="w-6 h-6 text-[#FDB910] cursor-pointer"
              onClick={() => handleMenuToggle(comment.id)}
            />
            {menuVisible[comment.id] && (
              <div className="absolute top-12 right-6 bg-white border rounded-lg shadow-lg z-10">
                <div className="px-4 py-2">
                  <textarea
                    placeholder="Reason for reporting"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="border rounded-lg w-full"
                  />
                  <button
                    onClick={() => handleReport(comment)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 w-full"
                  >
                    Report
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 p-2">
            <IoPerson className="w-10 h-10 rounded-lg bg-[#FDB910]" />
            <div>
              <p className="text-sm">{comment.username}</p>
              <p className="text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
              {comment.hasHate && (
                <p className="text-red-600 font-bold">This comment contains hate speech</p>
              )}
            </div>
          </div>
          <div className="p-4">
            <p>{comment.content}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserCommentsCard;
