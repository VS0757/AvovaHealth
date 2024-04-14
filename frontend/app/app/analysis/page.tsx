import TrendGraph from "../_components/trends/trendGraph";
import {
  getTrendFromTrendData,
  getTrendsData,
} from "../_components/trends/trendsData";

export default async function Trends() {
  const trendsData = await getTrendsData();
  if (!trendsData.data) {
    return <main></main>;
  }
  let bloodTests = Object.entries(trendsData.data).map((t: any) => {
    const test: string = t[1].bloodTest;
    return test.substring(0, test.indexOf("$"));
  });
  bloodTests = Array.from(new Set(bloodTests));

  return (
    <main>
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-2 mx-auto">
        {bloodTests.map((test: string) => {
          const data = getTrendFromTrendData(trendsData, test);
          return data.length > 1 ? (
            <TrendGraph
              trendData={getTrendFromTrendData(trendsData, test)}
              key={test}
            />
          ) : null;
        })}
      </div>
    </main>
  );
}
