'use client';
import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ModeratorApplication = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [essay, setEssay] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const router = useRouter();

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return 'Email is invalid';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return '';
  };

  const validateUsername = (username: string): string => {
    if (!username) return 'Username is required';
    return '';
  };

  const validateEssay = (essay: string): string => {
    if (!essay) return 'Essay is required';
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const usernameError = validateUsername(username);
    const essayError = validateEssay(essay);

    if (emailError || passwordError || usernameError || essayError) {
      setError(
        `${emailError ? emailError + ' ' : ''}${passwordError ? passwordError + ' ' : ''}${
          usernameError ? usernameError + ' ' : ''
        }${essayError ? essayError + ' ' : ''}`
      );
      return;
    }

    try {
      const response = await axios.post('http://localhost:5012/api/moderator', {
        email,
        password,
        username,
        essay,
      });
      setSuccess('Moderator application submitted successfully! Please wait for admin approval.');
      setShowPopup(true); // Show the popup
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    router.push('/ModeratorLogin'); // Redirect to login page after closing the popup
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Moderator Signup</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Essay
              <span className="block text-xs font-light text-gray-500">
                Please include your CV and any necessary links in your essay.
              </span>
            </label>
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Apply
          </button>
          <div className="text-sm font-light text-gray-500 dark:text-gray-400 mt-4">
            If you have an account?{' '}
            <Link href="/ModeratorLogin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
              Login
            </Link>
          </div>
        </form>
        {showPopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Application Submitted</h2>
              <p className="mb-4">Your application has been submitted successfully. Please wait for admin approval.</p>
              <button
                onClick={closePopup}
                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorApplication;
