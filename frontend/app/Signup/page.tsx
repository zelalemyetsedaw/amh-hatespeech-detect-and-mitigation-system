'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    validateInput(name as keyof FormData, value);
  };

  const validateInput = (name: keyof FormData, value: string) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is invalid';
        }
        break;
      case 'username':
        if (!value) {
          error = 'Username is required';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters long';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const hasErrors = Object.values(formErrors).some((error) => error);
    if (hasErrors || !isChecked) {
      alert('Please fix the errors in the form and agree to the privacy policy');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5012/api/User', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      // Redirect to home page or do something else
      router.push('/Home');
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="h-screen flex bg-custom3 justify-center flex-col">
      <div className="flex p-10 justify-center">
        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow">
          <div>
            <div className="px-10">
              <div className="text-3xl font-extrabold">Sign up</div>
            </div>
            <div className="pt-2">
              <LabelledInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                placeholder="example@example.com"
                onChange={handleChange}
                error={formErrors.email}
              />
              <LabelledInput
                label="Username"
                name="username"
                value={formData.username}
                placeholder="username"
                onChange={handleChange}
                error={formErrors.username}
              />
              <LabelledInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                placeholder="password"
                onChange={handleChange}
                error={formErrors.password}
              />
              <LabelledInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                placeholder="confirm password"
                onChange={handleChange}
                error={formErrors.confirmPassword}
              />
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="privacyPolicy"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="privacyPolicy" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="/privacypolicy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !isChecked}
                className={`mt-8 w-full text-white bg-custom1 hover:bg-gray-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
                  isSubmitting || !isChecked ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Signing up...' : 'Sign up'}
              </button>
              <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/Login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Sign in here
                </Link>
              </div>
              <div className="text-center text-sm font-light text-blue-500 dark:text-gray-400">
                <Link href="/Moderatorapplication" className="font-medium text-custom1 hover:underline dark:text-primary-500">
                  Apply For Moderator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        className={`bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        placeholder={placeholder}
        required
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
