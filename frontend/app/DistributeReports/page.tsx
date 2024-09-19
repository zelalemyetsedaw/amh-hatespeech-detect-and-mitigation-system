"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "@/components/AdminHeader";
import Link from "next/link";

interface Moderator {
  id: string;
  username: string;
}

interface Report {
  Id: string;
  moderatedBy: string;
}

const DistributeReports: React.FC = () => {
  const [uncheckedReports, setUncheckedReports] = useState<number>(0);
  const [approvedModerators, setApprovedModerators] = useState<Moderator[]>([]);
  const [distribution, setDistribution] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isDistributeButtonDisabled, setIsDistributeButtonDisabled] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const moderatorsResponse = await axios.get<Moderator[]>(
        "http://localhost:5012/api/Moderator/approved"
      );
      setApprovedModerators(moderatorsResponse.data);
      console.log(moderatorsResponse);
      const distributionMap: Record<string, number> = {};
      for (const moderator of moderatorsResponse.data) {
        const moderatorReportsResponse = await axios.get<Report[]>(
          `http://localhost:5012/api/Report/moderator/${moderator.id}`
        );
        distributionMap[moderator.id] = moderatorReportsResponse.data.length;
      }

      setDistribution(distributionMap);
      try {
        const reportsResponse = await axios.get<Report[]>(
          "http://localhost:5012/api/Report/unassigned"
        );

        setUncheckedReports(reportsResponse.data.length);
      } catch (error: any) {
        setError(
          error.response?.data || "Failed to fetch data from the server."
        );
        setIsDistributeButtonDisabled(true);
      }
    };

    fetchData();
  }, []);

  const handleDistribute = async () => {
    setIsDistributeButtonDisabled(true);
    try {
      await axios.post("http://localhost:5012/api/Moderator/distribute");

      const reportsResponse = await axios.get<Report[]>(
        "http://localhost:5012/api/Report/unassigned"
      );
      const distributionResponse = await axios.get<Moderator[]>(
        "http://localhost:5012/api/Moderator/approved"
      );

      const distributionMap: Record<string, number> = {};
      distributionResponse.data.forEach((moderator) => {
        distributionMap[moderator.id] = reportsResponse.data.filter(
          (report) => report.moderatedBy === moderator.id
        ).length;
      });

      setDistribution(distributionMap);
      setIsDistributeButtonDisabled(true);
      setUncheckedReports(0);
    } catch (error: any) {
      setError(error.response?.data || "Failed to distribute reports.");
    }
  };

  const viewReports = async (moderatorId: string) => {
    try {
      const response = await axios.get<Report[]>(
        `http://localhost:5012/api/Report/moderator/${moderatorId}`
      );
      console.log(response.data); // Display the reports in the way you prefer
    } catch (error: any) {
      setError(
        error.response?.data || "Failed to fetch reports for the moderator."
      );
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="container mx-auto p-6 w-4/5">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <p className="mb-2">
            Number of reports not asigned:{" "}
            <span className="font-semibold">{uncheckedReports}</span>
          </p>
          <p className="mb-2">
            Number of approved moderators:{" "}
            <span className="font-semibold">{approvedModerators.length}</span>
          </p>
        </div>
        {/* {`bg-${
            isDistributeButtonDisabled ? "blue-500" : "blue-700"
          } */}
        <button
          onClick={handleDistribute}
          disabled={isDistributeButtonDisabled}
          className= "bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
        >
          Distribute
        </button>
        <h2 className="text-xl font-semibold mb-4">Approved Moderators</h2>
        <ul className="space-y-4">
          {approvedModerators.map((moderator) => (
            <li
              key={moderator.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded shadow"
            >
              <div>
                <p className="font-semibold">{moderator.username}</p>
                <p>Assigned Reports: {distribution[moderator.id] || 0}</p>
              </div>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                <Link href={`/ModeratorDetails/${moderator.id}`}>
                  View Reports
                </Link>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DistributeReports;
