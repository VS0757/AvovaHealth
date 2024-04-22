import dayjs from "dayjs";
import Table, { TableValue } from "@/_components/table/table";
import { getReports } from "@/_components/dashboard/range_graph";
import ManualReportTable from "@/app/app/_components/report/manualtable";
import {
  BloodTestToolTip,
  MedPreNotes,
  ReportRange,
  getRangeSort,
} from "@/app/app/_components/report/reportrange";
import util from "util";
import Card from "@/_components/card";
import { Suspense } from "react";
import FeatherIcon from "feather-icons-react";
import reportData from "./data.json";

export default async function Profile() {
  const dynamic = "force-dynamic";

  const date = dayjs();

  try {
    const reports = reportData;
    console.log(util.inspect(reports, false, null, true));
    if (!reports || reports.length === 0) {
      return (
        <div className="flex min-h-fit flex-col justify-between px-9 py-4">
          <p>No blood data found</p>
        </div>
      );
    }
    const lastReport = reports[reports.length - 1];

    let rows: TableValue[] = [];

    const data = lastReport.data.test;

    data.map(async (d: any) => {
      const val: TableValue = {
        key: d.bloodtestname,
        components: [
          {
            key: "Item",
            node: (
              <div>
                {" "}
                <BloodTestToolTip testName={d.bloodtestname} />
                <MedPreNotes testName={d.bloodtestname} />
              </div>
            ),
            sortValue: d.bloodtestname,
          },
          {
            key: "Value",
            node: (
              <p>
                {d.value} {d.unit}
              </p>
            ),
            sortValue: d.value,
          },
          {
            key: "Range",
            node: (
              <ReportRange
                bloodtestname={d.bloodtestname}
                value={d.value}
                date={lastReport.data.effectiveDateTime}
              />
            ),
            sortValue: Math.abs(
              (d.range.split("-")[1] - d.range.split("-")[0]) / 2 - d.value,
            ),
          },
        ],
      };
      rows.push(val);
    });

    return (
      <div className="flex max-h-screen flex-row bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-100">
        <div className="max-h-screen overflow-auto w-full">
          <div className="mx-auto flex min-h-screen max-w-screen-xl flex-1 flex-col px-16">
            <header className="mb-16 flex h-36 flex-row items-center justify-between border-b dark:border-stone-800">
              <div className="flex flex-col">
                <h1 className="text-xl">Om Jha</h1>
                <p className="opacity-70">{date.format("MMMM D, YYYY")}</p>
              </div>
            </header>
            <section className="flex flex-col gap-4 max-w-screen-md mx-auto">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <h1 className="text-xl">Report</h1>
                  <h1 className="text-lg opacity-50">[Om Jha]</h1>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs opacity-50">Date</p>
                  <p>{date.format("MMMM D, YYYY")}</p>
                </div>
              </div>
              <div className="border rounded-lg px-36 h-72 text-center flex flex-col justify-center items-center bg-avova-gradient">
                <div className="flex flex-row gap-2 text-xs opacity-50 items-center py-4">
                  <FeatherIcon icon="zap" className="h-4" />
                  Recommendations
                </div>
                <div className="text-xl text-black opacity-70 mix-blend-color-burn">
                  <Suspense>
                    High red blood cell count could indicate dehydration or
                    other conditions. Ensure adequate hydration or consult a
                    healthcare professional.
                  </Suspense>
                </div>
              </div>
              <Card>
                <Table columns={["Item", "Value", "Range"]} rows={rows} />
              </Card>
            </section>
            <footer className="mt-16 flex h-16 flex-col items-end justify-end gap-2 border-t py-4 text-xs opacity-40 dark:border-stone-800">
              <p>Copyright © Avova Health 2024</p>
              <a href="/terms">Terms and Conditions</a>
            </footer>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <h1>Error getting data</h1>;
  }
}
