import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { GeistMono } from "geist/font/mono";

async function getReport(uniqueUserId: any, date: any) {
  const res = await fetch(
    "http://localhost:3001/retrieve-fhir-data?id=" +
      uniqueUserId +
      "&date=" +
      date,
  );
  const data = await res.json();
  return data?.data as any[];
}

interface Data {
  dateTimeType: string;
  uniqueUserId: string;
  data: any[];
}

export default async function ReportPage({ params }: any) {
  const { getIdToken } = getKindeServerSession();
  const uniqueUserId = (await getIdToken()).sub;

  const data = await getReport(
    "kp_f85ba560eb6346ccb744778f7c8d769e",
    params.id,
  );
  const report = (data[0] as Data)!;

  const date = report.dateTimeType.split("#")[0];
  const type = report.dateTimeType.split("#")[1].toLowerCase();
  const name = report.dateTimeType.split("#")[2];

  const year = date.split("-")[0];
  const month = date.split("-")[1];
  const day = date.split("-")[2];

  const reportData = report.data;

  return (
    <main>
      <h1>Report View</h1>

      <div className="mt-16 flex flex-col gap-2">
        <div className="">
          <p className="opacity-50">Filename</p>
          <p>{name}</p>
        </div>

        <div className="">
          <p className="opacity-50">Date Uploaded</p>
          <p>
            {month}/{day}, {year}
          </p>
        </div>

        <div className="">
          <p className="opacity-50">Upload Type</p>
          <p className="capitalize">{type}</p>
        </div>

        <div className="mt-8">
          <p className="opacity-50">Data</p>
          <table
            className={`mt-2 min-w-full border-collapse rounded-md border p-2 dark:border-stone-900 ${GeistMono.className}`}
          >
            <tbody>
              {Object.entries(reportData).map(([key, value], index) => (
                <tr
                  key={index}
                  className="rounded-md border dark:border-stone-900"
                >
                  <td className="rounded-md border p-1 dark:border-stone-900">
                    {key.replace(/_/g, " ")}
                  </td>
                  <td className="rounded-md border p-1 opacity-50 dark:border-stone-900">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
