import { getUserId } from "@/_lib/actions";

export interface TrendDataPoint {
  value: number;
  name: string;
  date: Date;
}

export async function getTrendsData() {
  const userId = await getUserId();
  const res = await fetch(
    "http://localhost:3001/retrieve-trend-data?id=" + userId,
  );
  const data = await res.json();

  return data;
}

export function getTrendFromTrendData(trendData: any, test: string) {
  const testData = Object.entries(trendData.data).map((t) => {
    return t[1];
  });
  const matchingTestData = testData.filter((t: any) => {
    return t.bloodTest.substring(0, t.bloodTest.indexOf("$")) === test;
  });

  return matchingTestData;
}

export function formatTrendDataPoint(trendData: any) {
  const test: string = trendData.bloodTest;
  const formattedData: TrendDataPoint = {
    value: +trendData.testValue,
    name: test?.split("$")[0],
    date: new Date(test?.split("$")[1]),
  };
  return formattedData;
}

export function formatTrendData(trendData: any) {
  const formattedData = Object.entries(trendData).map((t) => {
    return formatTrendDataPoint(t[1]);
  });
  return formattedData;
}
