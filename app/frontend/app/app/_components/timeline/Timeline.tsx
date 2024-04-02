"use client";
import React, { useState, useEffect } from 'react';
import Report from "./Report";
import { getUserId } from "../settings/userDataActions";

async function getItems(uniqueUserId: String) {
  const res = await fetch(`http://localhost:3001/retrieve-fhir-data?id=${uniqueUserId}`);
  const data = await res.json();
  return data?.data as any[];
}

function Timeline() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const uniqueUserId = await getUserId();
      const data = await getItems(uniqueUserId);
      setReports(data.reverse());
    };

    fetchReports();
  }, []);

  const removeReportFromState = (dateTimeType: string) => {
    setReports(currentReports => currentReports.filter(report => report.dateTimeType !== dateTimeType));
  };

  return (
    <div className="mt-16 border-l pl-[0.925rem] dark:border-l-stone-900">
      {reports.map((report) => (
        <Report key={report.dateTimeType} report={report} onReportDeleted={removeReportFromState} />
      ))}
    </div>
  );
}

export default Timeline;
