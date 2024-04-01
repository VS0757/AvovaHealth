import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Report from "./Report";

async function getItems(uniqueUserId: String) {
  const res = await fetch(
    "http://localhost:3001/retrieve-fhir-data?id=" + uniqueUserId,
  );
  const data = await res.json();
  return data?.data as any[];
}

export default async function Timeline() {
  const { getIdToken } = getKindeServerSession();
  const userName = (await getIdToken()).name;
  const uniqueUserId = (await getIdToken()).sub;

  // Assuming getItems returns an array of items
  // const data = await getItems(uniqueUserId);
  const data = await getItems("kp_f85ba560eb6346ccb744778f7c8d769e");

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

