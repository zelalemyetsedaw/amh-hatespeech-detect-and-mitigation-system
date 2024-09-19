'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ModeratorHeader from '@/components/ModeratorHeader';
import AdminHeader from '@/components/AdminHeader';

interface Moderator {
  id: string;
  email: string;
  password: string;
  username: string;
  essay: string;
  numberOfTask: number;
  createdAt: string;
  isApproved: boolean;
}

const ModeratorsList = () => {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchModerators = async () => {
      try {
        const response = await axios.get<Moderator[]>('http://localhost:5012/api/Moderator');
        setModerators(response.data);
      } catch (err) {
        setError('Failed to fetch moderators.');
      }
    };

    fetchModerators();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5012/api/Moderator/${id}/approve`, null, {
        params: {
          isApproved: true,
        },
      });
      setModerators(moderators.map(moderator => moderator.id === id ? { ...moderator, isApproved: true } : moderator));
    } catch (err) {
      setError('Failed to approve moderator.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5012/api/Moderator/${id}`);
      setModerators(moderators.filter(moderator => moderator.id !== id));
    } catch (err) {
      setError('Failed to remove moderator.');
    }
  };

  return (
    <> <AdminHeader />
    <div className="min-h-screen flex flex-col items-center bg-custom3 p-4">
       
      <h1 className="text-2xl font-bold mb-6">Moderators List</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md">
        {moderators.map((moderator) => (
          <div key={moderator.id} className="border-b border-gray-200 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{moderator.username}</h2>
                <p className="text-gray-600">{moderator.email}</p>
              </div>
              <div>
                <button
                  className="bg-green-500 text-white py-1 px-3 rounded mr-2"
                  onClick={() => handleAccept(moderator.id)}
                  disabled={moderator.isApproved}
                >
                  {moderator.isApproved ? 'Approved' : 'Accept'}
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded"
                  onClick={() => handleReject(moderator.id)}
                >
                  Reject
                </button>
              </div>
            </div>
            <div className="mt-2">
              <details>
                <summary className="cursor-pointer text-blue-500">View Essay</summary>
                <p className="mt-2 text-gray-700">{moderator.essay}</p>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div></>
  );
};

export default ModeratorsList;
