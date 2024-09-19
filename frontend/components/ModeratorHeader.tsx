"use client";
import React from "react";
import { BsLinkedin } from "react-icons/bs";
import { ImHome3, ImSearch } from "react-icons/im";
import { MdNotifications } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import logs from "../public/logo.jpg";
import Image from "next/image";
import { FaRegFlag } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

const ModeratorHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear the token or any other stored data related to the session
    localStorage.removeItem("moderatortoken"); // Adjust the key name if different
    // Redirect to the login page
    router.push("/ModeratorLogin");
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
            <h1 className="font-bold text-2xl bg-custom1 text-white p-4  ">
              Senior Project
            </h1>
          </div>
        </div>
        <div>
          <div className="flex gap-8 pl-60 pr-20">
            <Link href="/FalsePositiveReports">
              <div
                className={`flex flex-col text-center justify-start items-center cursor-pointer ${
                  isActive("/FalsePositiveReports")
                    ? "text-blue-500"
                    : "text-gray-200"
                }`}
              >
                <FaRegFlag className="w-8 h-8" />
                <p>False Positive Reports</p>
              </div>
            </Link>
            <Link href="/FalseNegativeReports">
              <div
                className={`flex text-center flex-col justify-start items-center cursor-pointer ${
                  isActive("/FalseNegativeReports")
                    ? "text-blue-500"
                    : "text-gray-200"
                }`}
              >
                <MdErrorOutline className="w-8 h-8" />
                <p>False Negative Reports</p>
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

export default ModeratorHeader;
