import FhirReportTable from "./fhirtable";
import ManualReportTable from "./manualtable";

interface ReportTableParams {
  isFhir: boolean;
  reportData: any;
}

export default function ReportTable({ isFhir, reportData }: ReportTableParams) {
  if (isFhir) {
    return <FhirReportTable reportData={reportData} />;
  } else {
    return <ManualReportTable reportData={reportData} />;
  }
}
