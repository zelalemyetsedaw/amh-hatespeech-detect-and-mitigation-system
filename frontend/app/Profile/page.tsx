'use client'
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import UsersPostCard from "@/components/UsersPostCard";
import UserCommentsCard from "@/components/UserCommentsCard";
import React, { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
    email: string;
    username: string;
    id: string;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [activeTab, setActiveTab] = useState("posts");
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setNewUsername(parsedUser.username);
            setNewEmail(parsedUser.email);
        }
    }, []);

    const handleUpdate = async () => {
        if (!user) return;

        try {
            const updatedUser = {
                ...user,
                username: newUsername,
                email: newEmail,
                password: newPassword,
            };

            await axios.put(`http://localhost:5012/api/user/${user.id}`, updatedUser);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setShowModal(false);
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    const handleDelete = async () => {
        if (!user) return;

        try {
            await axios.delete(`http://localhost:5012/api/user/${user.id}`);
            localStorage.removeItem('user');
            router.push('/Login');
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    return (
        <div>
            <Header />

            <div className="w-3/4 mt-10 m-auto">
                <div className="bg-custom2 h-64">
                    <div className="rounded-full absolute mt-52 ml-20 flex items-center justify-center bg-gray-200 w-32 h-32">
                        {user ? user.username[0].toUpperCase() : ""}
                    </div>
                </div>
                
                <div className="bg-gray-150 pt-32 pr-20 pl-10">
                    <p className="pb-5"> <span className="font-bold text-xl">User: </span> {user?.username} </p>
                    <p> Active social media user, engaging with friends, family, and communities. Enthusiast of sharing updates, interests, and opinions. Passionate about connecting and consuming diverse content.</p>
                </div>

                <div className="pl-10 p-10 flex gap-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => setShowModal(true)}
                    >
                        Update
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>

                <div className="pl-10 p-10">
                    <div className="flex gap-4 mb-4">
                        <button
                            className={`px-4 py-2 rounded-lg ${activeTab === "posts" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("posts")}
                        >
                            My Posts
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${activeTab === "comments" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("comments")}
                        >
                            My Comments
                        </button>
                    </div>

                    {activeTab === "posts" && <UsersPostCard useridd={user?.id} />}
                    {activeTab === "comments" && <UserCommentsCard userId={user?.id} />}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Update User</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <div className="flex gap-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
