"use client";
import Link from "next/link";
import { getUserId } from "../settings/userDataActions";
import FeatherIcon from 'feather-icons-react';
import { toast } from "sonner";

export default function Report({ report, onReportDeleted }: { report: any; onReportDeleted: (dateTimeType: string) => void }) {
  const date = report.dateTimeType.split("$")[0];
  const type = report.dateTimeType.split("$")[1];
  const name = report.dateTimeType.split("$")[2];

  const year = date.split("-")[0];
  const month = date.split("-")[1];
  const day = date.split("-")[2];

  const deleteEntry = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevents the click from bubbling up to parent elements
    toast.promise(deleteReport(), {
      loading: "Deleting...",
      success: () => {
        onReportDeleted(report.dateTimeType);
        return "Successfully deleted blood data entry.";
      },
      error: "Error deleting blood data entry.",
    });
  };

  const deleteReport = async () => {
    const uniqueUserId = await getUserId();
    const dateTimeType = report.dateTimeType;
    await fetch(`http://localhost:3001/delete-user-data?id=${uniqueUserId}&dateTimeType=${dateTimeType}`);
    console.log('Report deleted:', dateTimeType);
  };

  return (
    <div
      className={`relative my-4 min-w-48 rounded-md border bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900`}
    >
      <button
        className="absolute bottom-2 right-2 cursor-pointer"
        onClick={deleteEntry}
        style={{ border: 'none', background: 'transparent' }}
        aria-label="Delete entry"
      >
        <FeatherIcon icon="x" className="text-xs" />
      </button>
      <div
        className={`absolute h-2 w-2 -translate-x-9 translate-y-1.5 transform rounded-lg border bg-stone-50 dark:border-stone-900 dark:bg-stone-950`}
      ></div>
      <div className={`flex flex-row justify-between`}>
        <p>
          {month}/{day}
        </p>
        <p>{year}</p>
      </div>
      <div className={`mb-2 mt-4 flex flex-col flex-nowrap`}>
        <p className={`opacity-50`}>Filename</p>
        <p className="max-w-fill">{name}</p>
      </div>
      <Link
        href={`/app/report/${report.dateTimeType}`}
        className={`underline opacity-50`}
      >
        View More
      </Link>
    </div>
  );
}
