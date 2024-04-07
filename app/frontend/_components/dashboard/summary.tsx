import FeatherIcon from "feather-icons-react";
import { getPercentInRange, getReports } from "./range_graph";
import {
  externalGetUserData,
  getUserId,
} from "@/app/app/_components/settings/userDataActions";
import Report, { ReportProps } from "@/app/app/_components/timeline/Report";

export default async function SummaryCard() {
  const uniqueUserId = await getUserId();
  const reports = await getReports(uniqueUserId);
  const reportData = await getPercentInRange();
  const userData = await externalGetUserData();

  const lastReport = reports[reports.length - 1];

  const isIncreasing = reportData.reduce((o: any, v: any, i: any, a: any) => {
    if (!o) return false;
    if (i == 0) return true;
    return v > a[i - 1];
  }, true);

  return (
    <div className="flex h-72 flex-col justify-between px-9 py-8 bg-gradient-to-br rounded-md from-[rgba(5,160,51,0.2)] via-transparent">
      <div className="border bg-stone-50 dark:border-stone-800 dark:bg-stone-950 rounded-full text-xs px-2 py-1 max-w-fit">
        {isIncreasing ? (
          <div className="flex fex-row">
            Your tests have been getting closer to range.
            <FeatherIcon icon="trending-up" className="h-4" fill="#057833" />
          </div>
        ) : (
          <div className="flex flex-row">
            Your tests have not been getting more in range.
            <FeatherIcon icon="trending-down" className="h-4" />
          </div>
        )}
      </div>
      <div className="rounded-lg text-xs max-w-fill">
        <p>View your last report:</p>
        <div>
          <ReportStub report={lastReport} userData={userData} />
        </div>
      </div>
    </div>
  );
}

function ReportStub({ report, userData }: { report: any; userData: any }) {
  "use client";

  const reportProps: ReportProps = {
    report: report,
    userData: userData,
  };

  return <Report props={reportProps} />;
}
