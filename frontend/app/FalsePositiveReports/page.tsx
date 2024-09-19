"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "@/components/AdminHeader";
import ModeratorHeader from "@/components/ModeratorHeader";

interface Report {
  id: string;
  contentId: string;
  userId: string;
  contentType: string;
  reason: string;
  createdAt: string;
  content?: string;
  checked: boolean;
  moderatedBy: string;
}

const FalsePositiveReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [moderatorName, setModeratorName] = useState<string>("");
  const [markedAsHate, setMarkedAsHate] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [moderator, setModerator] = useState<{
    id: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedModerator = localStorage.getItem("moderator");
      if (storedModerator) {
        const parsedModerator = JSON.parse(storedModerator);
        setModerator(parsedModerator);
        setModeratorName(parsedModerator.username);

        const fetchFalseNegativeReports = async () => {
          try {
            const response = await axios.get<Report[]>(
              `http://localhost:5012/api/Report/moderator/${parsedModerator.id}`
            );

            const reportsWithContent = await Promise.all(
              response.data.map(async (report) => {
                let content = "";
                let hasHate = false;

                if (report.contentType === "Post") {
                  const postResponse = await axios.get(
                    `http://localhost:5012/api/Post/${report.contentId}`
                  );
                  content = postResponse.data.content;
                  hasHate = postResponse.data.hasHate;
                } else if (report.contentType === "Comment") {
                  const commentResponse = await axios.get(
                    `http://localhost:5012/api/Comment/${report.contentId}`
                  );
                  content = commentResponse.data.content;
                  hasHate = commentResponse.data.hasHate;
                }

                return { ...report, content, hasHate };
              })
            );

            const falseNegativeReports = reportsWithContent.filter(
              (report) => report.hasHate
            );
            setReports(falseNegativeReports);
          } catch (error) {
            console.error("Failed to fetch false negative reports:", error);
          }
        };

        fetchFalseNegativeReports();
      }
    }
  }, []);

  const handleButtonClick = async (
    report: Report,
    action: "hate" | "unhate" | "check"
  ) => {
    try {
      if (action === "hate") {
        if (report.contentType === "Post") {
          await axios.put(
            `http://localhost:5012/api/Post/${report.contentId}/mark-as-hate`
          );
        } else if (report.contentType === "Comment") {
          await axios.put(
            `http://localhost:5012/api/Comment/${report.contentId}/mark-as-hate`
          );
        }
        setMarkedAsHate((prev) => ({ ...prev, [report.id]: true }));
      } else if (action === "unhate") {
        if (report.contentType === "Post") {
          await axios.put(
            `http://localhost:5012/api/Post/${report.contentId}/unmark-as-hate`
          );
        } else if (report.contentType === "Comment") {
          await axios.put(
            `http://localhost:5012/api/Comment/${report.contentId}/unmark-as-hate`
          );
        }
        setMarkedAsHate((prev) => ({ ...prev, [report.id]: true }));
      } else if (action === "check") {
        await axios.put(`http://localhost:5012/api/Report/${report.id}/check`);
      }

      setReports((prevReports) =>
        prevReports.map((r) =>
          r.id === report.id
            ? { ...r, checked: action === "check" || r.checked }
            : r
        )
      );
    } catch (error) {
      console.error(`Failed to ${action} content:`, error);
    }
  };

  return (
    <div>
      <ModeratorHeader />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Moderator: {moderatorName}</h1>
        <h2 className="text-xl font-bold mb-4">False Positive Reports</h2>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Number</th>
                <th className="px-4 py-2 border">Report Content</th>
                <th className="px-4 py-2 border">Reason</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report.id}>
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border text-center">
                    {report.content}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {report.reason}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleButtonClick(report, "unhate")}
                      className={`bg-yellow-500 text-white px-4 py-2 rounded mx-1 ${
                        markedAsHate[report.id]
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500"
                      }`}
                      disabled={markedAsHate[report.id] || report.checked}
                    >
                      {markedAsHate[report.id]
                        ? "Marked as unhate"
                        : "Make it Unhate"}
                    </button>
                    <button
                      onClick={() => handleButtonClick(report, "check")}
                      className={`px-4 py-2 rounded mx-1 ${
                        report.checked ? "bg-green-500" : "bg-blue-500"
                      } text-white`}
                      disabled={report.checked}
                    >
                      {report.checked ? "Checked" : "Check"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FalsePositiveReports;
