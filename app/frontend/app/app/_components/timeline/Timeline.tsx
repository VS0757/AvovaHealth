import Report from "./Report";
import { getUserId } from "../settings/userDataActions";

async function getItems(uniqueUserId: String) {
  const res = await fetch(
    "http://localhost:3001/retrieve-fhir-data?id=" + uniqueUserId,
  );
  const data = await res.json();
  return data?.data as any[];
}

export default async function Timeline() {
  const uniqueUserId = await getUserId();
  const data = await getItems(uniqueUserId);

  // Reverse the order of the data array
  const reversedData = data?.reverse();

  return (
    <div className="mt-16 border-l pl-[0.925rem] dark:border-l-stone-900">
      {reversedData?.map((report) => {
        return <Report key={report.dateTimeType} report={report} />;
      })}
    </div>
  );
}

