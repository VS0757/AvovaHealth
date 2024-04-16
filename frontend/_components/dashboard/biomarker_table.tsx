import { getUserId } from "@/_lib/actions";
import { getReports } from "./range_graph";
import ManualReportTable from "@/app/app/_components/report/manualtable";
import Table, { TableValue } from "../table/table";
import {
  BloodTestToolTip,
  MedPreNotes,
  ReportRange,
  getRangeSort,
} from "@/app/app/_components/report/reportrange";

export default async function BiomarkerTable() {
  const reports = await getReports(await getUserId());
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
    <div className="flex min-h-fit flex-col justify-between">
      <Table columns={["Item", "Value", "Range"]} rows={rows} />
    </div>
  );
}
