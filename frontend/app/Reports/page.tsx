"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "@/components/AdminHeader";

interface Report {
  id: string;
  contentId: string;
  userId: string;
  contentType: string;
  reason: string;
  createdAt: string;
  content?: string; // Add content to the Report interface
  checked: boolean; // Add checked to the Report interface
}

const ReportsTable = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get<Report[]>(
          "http://localhost:5012/api/Report"
        );
        const reportsData = response.data;

        // Fetch the content for each report
        const reportsWithContent = await Promise.all(
          reportsData.map(async (report) => {
            let content = "";
            if (report.contentType === "Post") {
              const postResponse = await axios.get(
                `http://localhost:5012/api/Post/${report.contentId}`
              );
              content = postResponse.data.content;
            } else if (report.contentType === "Comment") {
              const commentResponse = await axios.get(
                `http://localhost:5012/api/Comment/${report.contentId}`
              );
              content = commentResponse.data.content;
            }
            return { ...report, content };
          })
        );

        setReports(reportsWithContent);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    };

    fetchReports();
  }, []);

  const handleButtonClick = async (report: Report) => {
    try {
      if (report.contentType === "Post") {
        await axios.put(`http://localhost:5012/api/Post/${report.contentId}/mark-as-hate`);
      } else if (report.contentType === "Comment") {
        await axios.put(`http://localhost:5012/api/Comment/${report.contentId}/mark-as-hate`);
      }

      // Update the report's checked attribute
      await axios.put(`http://localhost:5012/api/Report/${report.id}/check`);

      // Update the local state
      setReports(reports.map(r => r.id === report.id ? { ...r, checked: true } : r));
    } catch (error) {
      console.error("Failed to mark content as hate:", error);
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="overflow-x-auto w-4/5 mt-10 m-auto">
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
                <td className="px-4 py-2 border text-center">{report.content}</td>
                <td className="px-4 py-2 border text-center">{report.reason}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleButtonClick(report)}
                    className={`px-4 py-2 rounded ${
                      report.checked ? "bg-green-500" : "bg-blue-500"
                    } text-white`}
                    disabled={report.checked}
                  >
                    {report.checked ? "Marked as Hate" : "Make it Hate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;
