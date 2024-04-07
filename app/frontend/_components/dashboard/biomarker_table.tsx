import { getUserId } from "@/_lib/actions";
import { getReports } from "./range_graph";
import ManualReportTable from "@/app/app/_components/report/manualtable";
import FhirReportTable from "@/app/app/_components/report/fhirtable";

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

  return (
    <div className="flex min-h-fit flex-col justify-between">
      {lastReport.data.test ? (
        <ManualReportTable reportData={lastReport.data} />
      ) : (
        <FhirReportTable reportData={lastReport.data} />
      )}
    </div>
  );
}
