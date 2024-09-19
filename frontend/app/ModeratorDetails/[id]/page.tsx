'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import AdminHeader from '@/components/AdminHeader';

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

const ModeratorDetails: React.FC = () => {
  const router = useParams();
  const id = router.id;
  const [reports, setReports] = useState<Report[]>([]);
  const [moderatorName, setModeratorName] = useState<string>('');
  const [clickedButtons, setClickedButtons] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!id) return;

    const fetchModeratorReports = async () => {
      try {
        const [reportsResponse, moderatorResponse] = await Promise.all([
          axios.get<Report[]>(`http://localhost:5012/api/Report/moderator/${id}`),
          axios.get<{ Username: string }>(`http://localhost:5012/api/Moderator/${id}`)
        ]);

        const reportsData = reportsResponse.data;

        const reportsWithContent = await Promise.all(
          reportsData.map(async (report) => {
            let content = '';
            if (report.contentType === 'Post') {
              const postResponse = await axios.get(`http://localhost:5012/api/Post/${report.contentId}`);
              content = postResponse.data.content;
            } else if (report.contentType === 'Comment') {
              const commentResponse = await axios.get(`http://localhost:5012/api/Comment/${report.contentId}`);
              content = commentResponse.data.content;
            }
            return { ...report, content };
          })
        );

        setReports(reportsWithContent);
        setModeratorName(moderatorResponse.data.Username);
      } catch (error) {
        console.error('Failed to fetch reports or moderator:', error);
      }
    };

    fetchModeratorReports();
  }, [id]);

  const handleButtonClick = async (report: Report, action: 'hate' | 'unhate' | 'check') => {
    try {
      if (action === 'hate') {
        if (report.contentType === 'Post') {
          await axios.put(`http://localhost:5012/api/Post/${report.contentId}/mark-as-hate`);
        } else if (report.contentType === 'Comment') {
          await axios.put(`http://localhost:5012/api/Comment/${report.contentId}/mark-as-hate`);
        }
      } else if (action === 'unhate') {
        if (report.contentType === 'Post') {
          await axios.put(`http://localhost:5012/api/Post/${report.contentId}/unmark-as-hate`);
        } else if (report.contentType === 'Comment') {
          await axios.put(`http://localhost:5012/api/Comment/${report.contentId}/unmark-as-hate`);
        }
      } else if (action === 'check') {
        await axios.put(`http://localhost:5012/api/Report/${report.id}/check`);
      }

      // Update the local state
      setReports((prevReports) =>
        prevReports.map((r) =>
          r.id === report.id ? { ...r, checked: action === 'check' || r.checked } : r
        )
      );
      setClickedButtons((prev) => ({ ...prev, [report.id]: action }));
    } catch (error) {
      console.error(`Failed to ${action} content:`, error);
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Moderator: {moderatorName}</h1>
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
                    {/* <button
                      onClick={() => handleButtonClick(report, 'hate')}
                      className={`text-white px-4 py-2 rounded mx-1 ${
                        clickedButtons[report.id] === 'hate' ? 'bg-red-700' : 'bg-red-500'
                      }`}
                    >
                      Make it Hate
                    </button>
                    <button
                      onClick={() => handleButtonClick(report, 'unhate')}
                      className={`text-white px-4 py-2 rounded mx-1 ${
                        clickedButtons[report.id] === 'unhate' ? 'bg-yellow-700' : 'bg-yellow-500'
                      }`}
                    >
                      Make it Unhate
                    </button> */}
                    <button
                      onClick={() => handleButtonClick(report, 'check')}
                      className={`text-white px-4 py-2 rounded mx-1 ${
                        clickedButtons[report.id] === 'check' || report.checked ? 'bg-green-700' : 'bg-blue-500'
                      }`}
                      // disabled={report.checked}
                      disabled = {true}
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

export default ModeratorDetails;
