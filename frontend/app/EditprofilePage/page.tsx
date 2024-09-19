// EditProfilePage.tsx
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfilePage = () => {
  const [user, setUser] = useState<any>({});
  const [updatedUser, setUpdatedUser] = useState<any>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get('http://localhost:5012/api/User/'); // Assuming this endpoint returns the current user's data
      setUser(response.data);
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5012/api/User/${user.id}`, updatedUser); // Assuming this is the endpoint to update user data
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to update user profile', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      {isSuccess && <p className="text-green-500 mb-4">Profile updated successfully</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email || user.email}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={updatedUser.username || user.username}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
