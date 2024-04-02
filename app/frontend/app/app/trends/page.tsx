import TrendGraph from "../_components/trends/trendGraph";
import {
  getTrendFromTrendData,
  getTrendsData,
} from "../_components/trends/trendsData";

export default async function Trends() {
  const trendsData = await getTrendsData();
  let bloodTests = Object.entries(trendsData.data).map((t: any) => {
    const test: string = t[1].bloodTest;
    return test.substring(0, test.indexOf("$"));
  });
  bloodTests = Array.from(new Set(bloodTests));

  return (
    <main>
      <h1>Trends</h1>
      <div className="mt-16 flex flex-col">
        {bloodTests.map((test: string) => {
          const data = getTrendFromTrendData(trendsData, test);

          return data.length > 1 ? (
            <TrendGraph
              trendData={getTrendFromTrendData(trendsData, test)}
              key={test}
            />
          ) : (
            <div></div>
          );
        })}
      </div>
    </main>
  );
}
