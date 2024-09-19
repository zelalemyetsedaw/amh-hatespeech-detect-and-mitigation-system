'use client'
import AdminHeader from "@/components/AdminHeader";
import Header from "@/components/Header";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalHateSpoken, setTotalHateSpoken] = useState(0);
  const [totalHateSpokenLastMonth, setTotalHateSpokenLastMonth] = useState(0);
  const [totalHateSpokenLastWeek, setTotalHateSpokenLastWeek] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUsersBanned, setTotalUsersBanned] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [totalReportsLastWeek, setTotalReportsLastWeek] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await axios.get("http://localhost:5012/api/Statistics/totalusers");
        console.log(postsResponse.data)
        const hateSpokenResponse = await axios.get("http://localhost:5012/api/Statistics/totalhatespoken");
        const hateSpokenLastMonthResponse = await axios.get("http://localhost:5012/api/Statistics/totalhatespokenlastmonth");
        const hateSpokenLastWeekResponse = await axios.get("http://localhost:5012/api/Statistics/totalhatespokenlastweek");
        const usersResponse = await axios.get("http://localhost:5012/api/Statistics/totalusers");
        const usersBannedResponse = await axios.get("http://localhost:5012/api/Statistics/totalusersbanned");
        const reportsResponse = await axios.get("http://localhost:5012/api/Statistics/totalreports");
        const reportsLastWeekResponse = await axios.get("http://localhost:5012/api/Statistics/totalreportslastweek");

        setTotalPosts(postsResponse.data);
        console.log(postsResponse.data)
        setTotalHateSpoken(hateSpokenResponse.data);
        setTotalHateSpokenLastMonth(hateSpokenLastMonthResponse.data);
        setTotalHateSpokenLastWeek(hateSpokenLastWeekResponse.data);
        setTotalUsers(usersResponse.data);
        setTotalUsersBanned(usersBannedResponse.data);
        setTotalReports(reportsResponse.data);
        setTotalReportsLastWeek(reportsLastWeekResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-custom3 h-screen">
      <AdminHeader />
      <div className="w-3/4 mt-10 m-auto flex flex-wrap ">
        <div className="w-52 h-40 m-4 mt-10 bg-custom4 flex flex-col items-center shadow-lg rounded-3xl">
          <p className="text-3xl font-extrabold pt-10 text-center">{totalPosts}</p>
          <p className="font-bold pt-5">Total Posts</p>
        </div>

        <div className="w-52 h-40 m-4 mt-10 bg-custom4 flex flex-col items-center shadow-lg rounded-3xl">
          <p className="text-3xl font-extrabold pt-10 text-center">{totalHateSpoken}</p>
          <p className="font-bold pt-5">Total Hate spoken</p>
        </div>

        <div className="w-52 h-40 m-4 mt-10 bg-custom4 flex flex-col items-center shadow-lg rounded-3xl">
          <p className="text-3xl font-extrabold pt-10 text-center">{totalHateSpokenLastMonth}</p>
          <p className="font-bold pt-5 p-4">Total Hate spoken Last Month</p>
        </div>

        <div className="w-52 h-40 m-4 mt-10 bg-custom4 flex flex-col items-center shadow-lg rounded-3xl">
          <p className="text-3xl font-extrabold pt-10 text-center">{totalHateSpokenLastWeek}</p>
          <p className="font-bold pt-5 p-4">Total Hate spoken Last Week</p>
        </div>

        <div className="w-52 h-40 m-4 mt-10 bg-custom4 flex flex-col items-center shadow-lg rounded-3xl">
          <p className="text-3xl font-extrabold pt-10 text-center">{totalUsers}</p>
          <p className="font-bold pt-5">Total Users</p>
        </div>

        <div className="w-52 h-40 m-4 mt-10 bg-custom4 flex flex-col items-center shadow-lg rounded-3xl">
          <p className="text-3xl font-extrabold pt-10 text-center">{totalUsersBanned}</p>
          <p className="font-bold pt-5">Total Users Banned</p>
        </div>

        <div className="w-52 h-40 m-4 mt-10 bg-custom4 flex flex-col items-center shadow-lg rounded-3xl">
          <p className="text-3xl font-extrabold pt-10 text-center">{totalReports}</p>
          <p className="font-bold pt-5">Total Reports</p>
        </div>

        <div className="w-52 h-40 m-4 mt-10 bg-custom4 flex flex-col items-center shadow-lg rounded-3xl">
          <p className="text-3xl font-extrabold pt-10 text-center">{totalReportsLastWeek}</p>
          <p className="font-bold pt-5">Total Reports Last Week</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
