"use client";
import Link from "next/link";
import { getUserId } from "../settings/userDataActions";
import FeatherIcon from "feather-icons-react";
import { toast } from "sonner";
import { healthcareProviders } from "../integrations/IntegrateEpic";
import { getAge, getTestRange } from "../report/testHelper";

export type ReportProps = {
  report: any;
  userData: any;
  onReportDeleted?: (dateTimeType: string) => void;
};

export default function Report({ props }: { props: ReportProps }) {
  const date = props.report.dateTimeType.split("$")[0];
  const type = props.report.dateTimeType.split("$")[1];
  const name = props.report.dateTimeType.split("$")[2];
  const { sex, birthday, preconditions } = props.userData;
  let percentInRange = 0;
  if (type === "FHIR") {
    const testRange = getTestRange(
      props.report.data.code.text,
      sex,
      getAge(birthday, date),
      preconditions,
    );
    percentInRange =
      testRange.low <= props.report.data.valueQuantity.value &&
      props.report.data.valueQuantity.value <= testRange.high
        ? 100
        : 0;
  } else {
    let totalCount = 0;
    let count = props.report.data.test.reduce((acc: any, test: any) => {
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
  }

  const testFacility =
    type === "MANUAL"
      ? props.report.data.facility
      : healthcareProviders[
          props.report.data.url
            ? props.report.data.url.split("Observation")[0]
            : ""
        ];

  const year = date.split("-")[0];
  const month = date.split("-")[1];
  const day = date.split("-")[2];

  const deleteEntry = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevents the click from bubbling up to parent elements
    toast.promise(deleteReport(), {
      loading: "Deleting...",
      success: () => {
        props.onReportDeleted &&
          props.onReportDeleted(props.report.dateTimeType);
        return "Successfully deleted blood data entry.";
      },
      error: "Error deleting blood data entry.",
    });
  };

  const deleteReport = async () => {
    const uniqueUserId = await getUserId();
    const dateTimeType = props.report.dateTimeType;
    await fetch(
      `http://localhost:3001/delete-user-data?id=${uniqueUserId}&dateTimeType=${dateTimeType}`,
    );
  };

  return (
    <div
      className={`relative my-1 min-w-48 rounded-md border bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900`}
    >
      <button
        className="absolute bottom-2 right-2 cursor-pointer"
        onClick={deleteEntry}
        style={{ border: "none", background: "transparent" }}
        aria-label="Delete entry"
      >
        <FeatherIcon icon="x" className="h-4" />
      </button>
      {props.onReportDeleted && (
        <div
          className={`absolute h-2 w-2 -translate-x-9 translate-y-1.5 transform rounded-lg border bg-stone-50 dark:border-stone-900 dark:bg-stone-950`}
        ></div>
      )}
      <div className={`flex flex-row justify-between`}>
        <p>
          {month}/{day}
        </p>
        <p>{year}</p>
      </div>
      <div className={`mb-2 mt-4 flex flex-row justify-between`}>
        <div className={`flex flex-col`}>
          <p className={`opacity-50`}>Test Facility</p>
          <p className="max-w-fill">{testFacility}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="opacity-50">Tests in Range</p>
          <p
            className={`max-w-fill ${
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
      <Link
        href={`/app/report/${props.report.dateTimeType}`}
        className={`underline opacity-50`}
      >
        View More
      </Link>
    </div>
  );
}
