'use client'
import React, { useEffect, useState } from 'react';
import { FiUser, FiLogOut, FiCamera } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
interface User {
  email: string;
  username: string;
  BannedUntil?: string;
  HateCount?: number;
}

const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bannedMessage, setBannedMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log(storedUser)
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.bannedUntil && new Date(parsedUser.bannedUntil) > new Date()) {
        setBannedMessage('You are currently banned.');
      }

      else if (parsedUser.hateCount && parsedUser.hateCount > 2) {
        setWarningMessage('You have received warnings.');
      }
    }
  }, []);




  
  const router = useRouter();
  const handleLogout = () => {
    // Clear the token or any other stored data related to the session
    localStorage.removeItem('token'); // Adjust the key name if different
    // Redirect to the login page
    router.push('/login');
  };

  return (
    <div className='w-1/4'>
      <div className='sidebar mt-10 bg-white border-4 rounded-lg shadow-md'>
        <div className='bg-custom1 h-20 border-b-4 flex items-center justify-center'>
          <div className='rounded-full mt-20 bg-gray-200 w-14 h-14 flex items-center justify-center'>
            {user ? user.username[0].toUpperCase() : ''}
          </div>
        </div>
        <div className='p-6 pt-10'>
          <div className='flex items-center mb-4'>
            <FiUser className='mr-2 text-gray-600' />
            <p className='font-semibold text-lg'>Welcome {user ? user.username : 'Guest'}</p>
          </div>
          {user && (
            <>
              <p className='text-sm text-gray-500 mb-2'>Email: {user.email}</p>
              {bannedMessage && <p className="text-red-500 mb-2">{bannedMessage}</p>}
              {warningMessage && <p className="text-yellow-500 mb-2">{warningMessage}</p>}
            </>
          )}
          <button className='flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4'>
            <FiCamera className='mr-2' />
            <span>Add Photo</span>
          </button>
          <button
            onClick={handleLogout}
            className='flex items-center text-sm text-gray-600 hover:text-gray-800'
          >
            <FiLogOut className='mr-2' />
            <span>Logout</span>
          </button>
        </div>
        <div className='p-6 border-t-2'>
          <p className='text-sm text-gray-600'>Active social media user, engaging with friends, family, and communities. Enthusiast of sharing updates, interests, and opinions. Passionate about connecting and consuming diverse content.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
