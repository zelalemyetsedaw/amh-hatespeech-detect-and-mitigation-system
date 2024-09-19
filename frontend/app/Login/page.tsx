'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface FormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5012/api/User/authenticate', null, {
        params: {
          email: formData.email,
          password: formData.password,
        },
      });
      const { token, user1 } = response.data;
      
      if (user1.isAdmin) {
        localStorage.setItem('admintoken', token);
      localStorage.setItem('adminuser', JSON.stringify(user1));
        router.push('/Admin');
      } else {
        localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user1));
        router.push('/Home');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setModalMessage('Login failed. Please check your email and password and try again.');
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-200 justify-center flex-col">
      <div className="flex justify-center">
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <div>
            <div className="px-10">
              <div className="text-3xl font-extrabold">Sign in</div>
            </div>
            <div className="pt-2">
              <LabelledInput
                label="Email"
                name="email"
                value={formData.email}
                placeholder="paras@gmail.com"
                onChange={handleChange}
                error={errors.email}
              />
              <LabelledInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                placeholder="123456"
                onChange={handleChange}
                error={errors.password}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
              <div className="text-sm font-light text-gray-500">
                Don't have an account?{' '}
                <Link href="/Signup" className="font-medium text-primary-600 hover:underline">
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Error</h2>
            <p>{modalMessage}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface LabelledInputProps {
  label: string;
  placeholder: string;
  type?: string;
  name: keyof FormData;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

function LabelledInput({ label, placeholder, type, name, value, onChange, error }: LabelledInputProps) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
      <input
        type={type || 'text'}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
