import ManualReportTable from "./manualtable";

export default function ReportTable({
  isFhir,
  reportData,
}: {
  isFhir: boolean;
  reportData: any;
}) {
  return <ManualReportTable reportData={reportData} />;
}
