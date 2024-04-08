"use client";
import Link from "next/link";
import { getUserId } from "../settings/userDataActions";
import { toast } from "sonner";
import { getAge, getTestRange } from "../report/testHelper";
import Button from "@/_components/button";
import { redirect, useRouter } from "next/navigation";

type ReportProps = {
  report: any;
  userData: any;
  onReportDeleted?: (dateTimeType: string) => void;
};

const Report: React.FC<ReportProps> = ({
  report,
  userData,
  onReportDeleted,
}) => {
  const router = useRouter();

  const date = report.dateTimeType.split("$")[0];
  const type = report.dateTimeType.split("$")[1];
  const name = report.dateTimeType.split("$")[2];
  const { sex, birthday, preconditions } = userData;
  let percentInRange = 0;
  let totalCount = 0;
  let count = report.data.test.reduce((acc: any, test: any) => {
    const testRange = getTestRange(
      test.bloodtestname,
      sex,
      getAge(birthday, date),
      preconditions,
    );
    if (testRange.low !== 0 || testRange.high !== 0) {
      totalCount++;
      return (
        acc +
        (testRange.low <= test.value && test.value <= testRange.high ? 1 : 0)
      );
    }
    return acc;
  }, 0);

  percentInRange = Math.round(100 * (count / totalCount));

  const testFacility = report.data.facility;

  const year = date.split("-")[0];
  const month = date.split("-")[1];
  const day = date.split("-")[2];

  const deleteEntry = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.stopPropagation(); // Prevents the click from bubbling up to parent elements
    toast.promise(deleteReport(), {
      loading: "Deleting...",
      success: () => {
        onReportDeleted && onReportDeleted(report.dateTimeType);
        return "Successfully deleted blood data entry.";
      },
      error: "Error deleting blood data entry.",
    });
  };

  const deleteReport = async () => {
    const uniqueUserId = await getUserId();
    const dateTimeType = report.dateTimeType;
    await fetch(
      `http://localhost:3001/delete-user-data?id=${uniqueUserId}&dateTimeType=${dateTimeType}`,
    );
  };

  return (
    <div className="relative min-w-48 rounded-lg border bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900 flex flex-row justify-between h-40">
      <div className="flex flex-col justify-between">
        <p>
          {month}/{day} {year}
        </p>
        <div className="flex flex-col">
          <p className="opacity-50 text-xs">Test Facility</p>
          <p className="max-w-fill">
            {testFacility !== "None" ? testFacility : "-"}
          </p>
        </div>
        <a
          href={`/app/report/${report.dateTimeType}`}
          className="underline text-xs opacity-50"
        >
          View More
        </a>
      </div>
      <div className="flex flex-col justify-between items-end">
        <div className="rounded-full">
          <Button
            label="Delete"
            icon="x"
            hoverColor="from-avova/25"
            onClick={() => {
              deleteEntry();
            }}
          />
        </div>
        <div className="flex flex-col items-end">
          <p className="opacity-50 text-xs">Tests in Range</p>
          <p
            className={`max-w-fill text-xl ${
              percentInRange > 90
                ? "text-green-500"
                : percentInRange >= 5 && percentInRange <= 90
                  ? "text-yellow-500"
                  : "text-red-500"
            }`}
          >
            {percentInRange}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Report;
