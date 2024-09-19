"use client";
import React from "react";
import { BsLinkedin } from "react-icons/bs";
import { ImHome3, ImSearch } from "react-icons/im";
import { MdNotifications } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.jpg";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear the token or any other stored data related to the session
    localStorage.removeItem("token"); // Adjust the key name if different
    // Redirect to the login page
    router.push("/Login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-custom1">
      <div className="w-4/5 p-2 m-auto header flex items-center gap-4 justify-between">
        <div className="flex gap-4 items-center">
          <div>
            <Image
              src={logo}
              alt="Logo"
              width={64}
              height={64}
              className="bg-custom1"
            />
          </div>
          <div className="flex items-center bg-gray-200 w-100 h-100">
            <h1 className="font-bold text-3xl bg-custom1 text-white p-4  ">
              Senior Project
            </h1>
          </div>
        </div>
        <div>
          <div className="flex gap-8 pl-60 pr-20">
            <Link href="/Home">
              <div
                className={`flex flex-col items-center cursor-pointer ${
                  isActive("/Home") ? "text-blue-500" : "text-gray-200"
                }`}
              >
                <ImHome3 className="w-8 h-8" />
                <p>Home</p>
              </div>
            </Link>
            <Link href="/Profile">
              <div
                className={`flex flex-col items-center cursor-pointer ${
                  isActive("/Profile") ? "text-blue-500" : "text-gray-200"
                }`}
              >
                <IoPerson className="w-8 h-8" />
                <p>Me</p>
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

export default Header;
