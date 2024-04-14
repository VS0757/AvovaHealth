"use client";
import React, { useState, useEffect } from "react";
import Report from "./Report";
import { getUserData } from "../settings/userDataActions";
import { getUserId } from "@/_lib/actions";

async function getItems(uniqueUserId: String) {
  const res = await fetch(
    `http://localhost:3001/retrieve-blood-data?id=${uniqueUserId}`,
  );
  const data = await res.json();
  return data?.data as any[];
}

function Timeline() {
  const [reports, setReports] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    const fetchReports = async () => {
      const uniqueUserId = await getUserId();
      const userData = await getUserData(uniqueUserId);
      setUserData(userData);
      const data = await getItems(uniqueUserId);
      if (!data) return;
      setReports(data.reverse());
    };

    fetchReports();
  }, []);

  const removeReportFromState = (dateTimeType: string) => {
    setReports((currentReports) =>
      currentReports.filter((report) => report.dateTimeType !== dateTimeType),
    );
  };

  return (
    <div className="gap-4 grid lg:grid-cols-2 grid-cols-1 mx-auto">
      {reports.map((report) => {
        return (
          <Report
            key={report.dateTimeType}
            report={report}
            userData={userData}
            onReportDeleted={removeReportFromState}
          />
        );
      })}
    </div>
  );
}

export default Timeline;
