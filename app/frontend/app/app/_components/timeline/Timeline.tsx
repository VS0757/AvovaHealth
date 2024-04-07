"use client";
import React, { useState, useEffect } from "react";
import Report, { ReportProps } from "./Report";
import { getUserId, getUserData } from "../settings/userDataActions";

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
    <div className="border-l pl-[0.925rem] dark:border-l-stone-900">
      {reports.map((report) => {
        const reportProps: ReportProps = {
          report: report,
          userData: userData,
          onReportDeleted: removeReportFromState,
        };
        return <Report key={report.dateTimeType} props={reportProps} />;
      })}
    </div>
  );
}

export default Timeline;
