import { GeistMono } from "geist/font/mono";
import Link from "next/link";

export default function Report({ report }: any) {
  const date = report.dateTimeType.split("$")[0];
  const type = report.dateTimeType.split("$")[1];
  const name = report.dateTimeType.split("$")[2];

  const year = date.split("-")[0];
  const month = date.split("-")[1];
  const day = date.split("-")[2];

  return (
    <div
      className={`my-4 min-w-48 rounded-md border bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900`}
    >
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
