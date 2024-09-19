'use client'
import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-custom3 p-6">
      <div className="max-w-4xl bg-white p-10 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          Welcome to our community! We are committed to ensuring a safe and respectful environment for all users. Please read our privacy policy carefully to understand how we handle user-generated content and the consequences of violating our terms.
        </p>
        
        <h2 className="text-2xl font-bold mb-2">User Conduct</h2>
        <p className="mb-4">
          By using our platform, you agree to post and comment in a respectful and non-hateful manner. We do not tolerate any form of hateful content, including but not limited to:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Hate speech or discriminatory remarks based on race, ethnicity, religion, gender, sexual orientation, or disability.</li>
          <li>Threats or harassment towards other users.</li>
          <li>Any form of abusive language or behavior.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-2">Consequences of Violations</h2>
        <p className="mb-4">
          We take violations of our user conduct policy very seriously. If a user is found to have posted or commented hateful content, the following actions may be taken:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Immediate removal of the offensive content.</li>
          <li>Temporary suspension of the user's account.</li>
          <li>Permanent banning of the user's account for repeated or severe violations.</li>
        </ul>
        <p className="mb-4">
          Our moderation team will review reported content and take appropriate actions based on the severity of the violation. We reserve the right to take any measures deemed necessary to maintain the safety and integrity of our platform.
        </p>

        <h2 className="text-2xl font-bold mb-2">Appeals</h2>
        <p className="mb-4">
          Users who believe their content was removed or their account was suspended or banned in error may submit an appeal. Appeals can be sent to our support team at <a href="mailto:support@gmail.com" className="text-blue-600 hover:underline">seniorproject@gmail.com</a>. Our team will review the appeal and respond accordingly.
        </p>

        <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about our privacy policy or user conduct guidelines, please contact us at <a href="mailto:seniorproject@gmail.com" className="text-blue-600 hover:underline">seniorproject@gmail.com</a>.
        </p>

        <div className="text-center mt-6">
          <Link href="/Signup">
            <span className="text-blue-600 hover:underline">Back to Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
