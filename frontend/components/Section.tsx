'use client'
import React, { useEffect, useState } from 'react'
import { IoPerson } from "react-icons/io5";
import PostCard from './PostCard';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  username: string;
}

const Section = () => {
  const [postContent, setPostContent] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handlePost = async () => {
    if (!postContent.trim()) {
      alert('Please enter a post content');
      return;
    }

    setIsPosting(true);
    setErrorMessage('');

    try {
      
      const response = await axios.post('http://localhost:5012/api/Post', {
        content: postContent,
        likes: 0,
        userId: user?.id
      });
      console.log(response.data)

      if (response.data === 'The content contains hate speech and cannot be posted.') {
        setErrorMessage('The content contains hate speech and cannot be posted.');
        setTimeout(() => setErrorMessage(''), 5000); 
      }
      else if (typeof response.data !== 'object' ) {
        setErrorMessage('banned');
        console.log(typeof(response.data))
        setTimeout(() => setErrorMessage(''), 5000);
      }
      
      else {
         
        console.log('Post created:', response.data);
        setPostContent('');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      setErrorMessage('Failed to create post. Please try again later.');
    }

    setIsPosting(false);
  };

  return (
    <div className="section w-2/3 ml-4 pt-10 mb-20">
      <div className="post border-2 bg-white flex items-center p-5">
        <IoPerson className="w-8 h-8 m-4 rounded-full" />
        <div>
          <input
            type="text"
            placeholder="Start a post"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            required
            className="w-64 h-14 bg-gray-200 rounded-full pl-4"
          />
        </div>
        <button onClick={handlePost} className="bg-custom1 px-4 rounded-lg p-2 ml-5">
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      </div>
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <div className="border-b-2 bg-white m-4"></div>
      <PostCard />
    </div>
  );
}

export default Section;
