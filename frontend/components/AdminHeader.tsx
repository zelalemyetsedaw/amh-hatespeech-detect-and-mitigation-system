"use client";
import React from "react";
import { BsLinkedin } from "react-icons/bs";
import { ImHome3, ImSearch } from "react-icons/im";
import { MdNotifications } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logs from "@/public/logo.jpg";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaUserFriends, FaTasks } from "react-icons/fa";

const AdminHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear the token or any other stored data related to the session
    localStorage.removeItem("admintoken"); // Adjust the key name if different
    // Redirect to the login page
    router.push("/Login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-custom1">
      <div className=" w-4/5 p-2 m-auto header flex items-center gap-4 justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 flex items-center">
            <Image src={logs} alt="Logo" width={64} height={64} />
          </div>
          <div className=" bg-gray-200  h-100">
            <h1 className="font-bold text-xl bg-custom1 text-white   ">
              Senior Project
            </h1>
          </div>
        </div>
        <div>
          <div className="flex gap-8 pl-60 pr-20">
            <Link href="/Admin">
              <div
                className={`flex flex-col items-center cursor-pointer ${
                  isActive("/Admin") ? "text-blue-500" : "text-gray-200"
                }`}
              >
                <ImHome3 className="w-8 h-8" />
                <p>DashBoard</p>
              </div>
            </Link>
            <Link href="/Reports">
              <div
                className={`flex flex-col items-center cursor-pointer ${
                  isActive("/Reports") ? "text-blue-500" : "text-gray-200"
                }`}
              >
                <HiOutlineDocumentReport className="w-8 h-8" />
                <p>Reports</p>
              </div>
            </Link>
            <Link href="/ModeratorsList">
              <div
                className={`flex flex-col items-center cursor-pointer ${
                  isActive("/ModeratorsList")
                    ? "text-blue-500"
                    : "text-gray-200"
                }`}
              >
                <FaUserFriends className="w-8 h-8" />
                <p>Moderators</p>
              </div>
            </Link>
            <Link href="/DistributeReports">
              <div
                className={`flex flex-col items-center cursor-pointer ${
                  isActive("/DistributeReports")
                    ? "text-blue-500"
                    : "text-gray-200"
                }`}
              >
                <FaTasks className="w-8 h-8" />
                <p>AssignTask</p>
              </div>
            </Link>
            <div>
              <button
                onClick={handleLogout}
                className="bg-red-500 mt-3 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
