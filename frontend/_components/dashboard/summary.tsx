import FeatherIcon from "feather-icons-react";
import { getPercentInRange, getReports } from "./range_graph";
import { externalGetUserData } from "@/app/app/_components/settings/userDataActions";
import { getUserId } from "@/_lib/actions";
import Report from "@/app/app/_components/timeline/Report";

export default async function SummaryCard() {
  const uniqueUserId = await getUserId();
  const reports = await getReports(uniqueUserId);
  const reportData = await getPercentInRange();
  const userData = await externalGetUserData();

  if (!reports || reports.length === 0) {
    return (
      <div className="flex min-h-fit flex-col justify-between px-9 py-4">
        <p>No blood data found</p>
      </div>
    );
  }

  const lastReport = reports[reports.length - 1];

  const isIncreasing = reportData.reduce((o: any, v: any, i: any, a: any) => {
    if (!o) return false;
    if (i == 0) return true;
    return v > a[i - 1];
  }, true);

  const gradientColor = isIncreasing
    ? "from-[rgba(5,160,51,0.2)]"
    : "from-[rgba(160,6,51,0.2)]";

  return (
    <div
      className={`flex h-72 flex-col justify-between px-9 py-8 bg-gradient-to-br rounded-md ${gradientColor} via-transparent`}
    >
      <div className="border bg-stone-50 dark:border-stone-800 dark:bg-stone-950 rounded-full text-xs px-2 py-1 max-w-fit bg-opacity-70">
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
  return <Report report={report} userData={userData} />;
}
