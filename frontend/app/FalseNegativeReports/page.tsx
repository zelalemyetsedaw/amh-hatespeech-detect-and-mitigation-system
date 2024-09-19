'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModeratorHeader from '@/components/ModeratorHeader';

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
  markedAsHate?: boolean; // Add this line
}

const FalseNegativeReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [moderatorName, setModeratorName] = useState<string>('');
  const [moderator, setModerator] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedModerator = JSON.parse(localStorage.getItem('moderator') || '{}');
      setModerator(storedModerator);
      setModeratorName(storedModerator.username);

      const fetchFalsePositiveReports = async () => {
        try {
          const response = await axios.get<Report[]>(`http://localhost:5012/api/Report/moderator/${storedModerator.id}`);

          const reportsWithContent = await Promise.all(
            response.data.map(async (report) => {
              let content = '';
              let hasHate = false;

              if (report.contentType === 'Post') {
                const postResponse = await axios.get(`http://localhost:5012/api/Post/${report.contentId}`);
                content = postResponse.data.content;
                hasHate = postResponse.data.hasHate;
              } else if (report.contentType === 'Comment') {
                const commentResponse = await axios.get(`http://localhost:5012/api/Comment/${report.contentId}`);
                content = commentResponse.data.content;
                hasHate = commentResponse.data.hasHate;
              }

              return { ...report, content, hasHate };
            })
          );

          const falsePositiveReports = reportsWithContent.filter(report => !report.hasHate);
          setReports(falsePositiveReports);
        } catch (error) {
          console.error('Failed to fetch false positive reports:', error);
        }
      };

      fetchFalsePositiveReports();
    }
  }, []);

  const handleButtonClick = async (report: Report, action: 'hate' | 'unhate' | 'check') => {
    try {
      if (action === 'hate') {
        if (report.contentType === 'Post') {
          await axios.put(`http://localhost:5012/api/Post/${report.contentId}/mark-as-hate`);
        } else if (report.contentType === 'Comment') {
          await axios.put(`http://localhost:5012/api/Comment/${report.contentId}/mark-as-hate`);
        }
        setReports((prevReports) =>
          prevReports.map((r) =>
            r.id === report.id ? { ...r, markedAsHate: true } : r
          )
        );
      } else if (action === 'unhate') {
        if (report.contentType === 'Post') {
          await axios.put(`http://localhost:5012/api/Post/${report.contentId}/unmark-as-hate`);
        } else if (report.contentType === 'Comment') {
          await axios.put(`http://localhost:5012/api/Comment/${report.contentId}/unmark-as-hate`);
        }
      } else if (action === 'check') {
        await axios.put(`http://localhost:5012/api/Report/${report.id}/check`);
        setReports((prevReports) =>
          prevReports.map((r) =>
            r.id === report.id ? { ...r, checked: true } : r
          )
        );
      }
    } catch (error) {
      console.error(`Failed to ${action} content:`, error);
    }
  };

  return (
    <div>
      <ModeratorHeader />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Moderator: {moderatorName}</h1>
        <h2 className="text-xl font-bold mb-4">False Negative Reports</h2>
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
                  <td className="px-4 py-2 border text-center">{report.content}</td>
                  <td className="px-4 py-2 border text-center">{report.reason}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleButtonClick(report, 'hate')}
                      className={`px-4 py-2 rounded mx-1 ${report.markedAsHate ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white'}`}
                      disabled={report.markedAsHate || report.checked}
                    >
                      {report.markedAsHate ? 'Marked as Hate' : 'Make it Hate'}
                    </button>
                    <button
                      onClick={() => handleButtonClick(report, 'check')}
                      className={`px-4 py-2 rounded ${
                        report.checked ? 'bg-green-500' : 'bg-blue-500'
                      } text-white mx-1`}
                      disabled={report.checked}
                    >
                      {report.checked ? 'Checked' : 'Check'}
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

export default FalseNegativeReports;
