import { getUserId } from "@/_lib/actions";
import { getTestRange, getAge } from "@/app/app/_components/report/testHelper";
import { externalGetUserData } from "@/app/app/_components/settings/userDataActions";
import { useMemo } from "react";
import { bisector, extent, max } from "d3-array";
import { scaleTime, scaleLinear } from "@vx/scale";
import dayjs from "dayjs";
import { Group } from "@visx/group";
import { AreaClosed, LinePath } from "@vx/shape";
import { LinearGradient } from "@vx/gradient";
import { GridRows, GridColumns } from "@vx/grid";
import { AxisBottom } from "@visx/axis";

type rangeDataPoint = {
  date: string;
  range: number;
  dateTimeType: string;
};

export async function getReports(uniqueUserId: string) {
  const res = await fetch(
    `http://localhost:3001/retrieve-blood-data?id=${uniqueUserId}`,
  );
  const data = await res.json();
  return data.data;
}

export async function getPercentInRange() {
  const uniqueUserId = await getUserId();
  const reports = await getReports(uniqueUserId);
  const { sex, birthday, preconditions } = await externalGetUserData();

  if (!reports || reports.length === 0) {
    return [];
  }

  const reportData = reports.map((r: any) => {
    const date = r["data"]["effectiveDateTime"];
    let totalCount = 0;
    let count = 0;
    count = r.data.test.reduce((acc: any, test: any) => {
      const testRange = getTestRange(
        test.bloodtestname,
        sex,
        getAge(birthday, date),
        preconditions,
      );
      if (testRange.low !== 0 || testRange.high !== 0) {
        totalCount++;
        return (
          acc +
          (testRange.low <= test.value && test.value <= testRange.high
            ? 1
            : 0)
        );
      }
      return acc;
    }, 0);

    let percentInRange = Math.round(100 * (count / totalCount));

    const point: rangeDataPoint = {
      date: date,
      dateTimeType: r.dateTimeType,
      range: percentInRange,
    };
    return point;
  });

  return reportData;
}

export default async function RangeGraphCard() {
  const reportData = await getPercentInRange();

  if (!reportData || reportData.length === 0) {
    return (
      <div className="flex min-h-fit flex-col justify-between px-9 py-4">
        <p>No blood data found</p>
      </div>
    )
  }

  return (
    <div className="h-72 max-w-xl px-9 py-8 flex flex-row justify-between">
      <div className="flex flex-col justify-between">
        <p>Test Overview</p>
        {(await reportData) && (
          <div className="flex flex-col justify-end">
            <h1 className="text-2xl">
              {reportData[reportData.length - 1].range} %
            </h1>
            <p className="text-xs">Of Tests in Range</p>
            <p className="text-xs">
              as of {reportData[reportData.length - 1].date}
            </p>
          </div>
        )}
      </div>
      <div className="rounded-md max-w-fit">
        {(await reportData) && <RangeGraph data={reportData} />}
      </div>
    </div>
  );
}

function RangeGraph({ data }: { data: rangeDataPoint[] }) {
  "use client";

  const width = 320;
  const height = 220;

  const margin = {
    top: 10,
    bottom: 24,
    left: 10,
    right: 10,
  };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const getDate = (p: rangeDataPoint): Date => {
    return dayjs(p.date).toDate();
  };
  const getValue = (p: rangeDataPoint) => {
    return p.range;
  };

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(data, getDate) as [Date, Date],
      }),
    [xMax],
  );

  const valueScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [0, 100],
        nice: true,
      }),
    [yMax],
  );

  return (
    <svg width={width} height={height} className="">
      <Group top={margin.top} left={margin.left}>
        <GridRows
          scale={valueScale}
          width={xMax}
          strokeDasharray="2,2"
          stroke="black"
          strokeOpacity={0.05}
          pointerEvents="none"
        />
        <GridColumns
          scale={dateScale}
          height={yMax}
          strokeDasharray="2,2"
          stroke="black"
          strokeOpacity={0.05}
          pointerEvents="none"
        />
        <LinearGradient
          id="area-gradient"
          from="green"
          to="rgba(255,255,255,0)"
          toOpacity={0}
          fromOpacity={0.4}
        />
        <AreaClosed<rangeDataPoint>
          data={data}
          yScale={valueScale}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => valueScale(getValue(d)) ?? 0}
          fill={"url(#area-gradient)"}
        />
        <LinePath<rangeDataPoint>
          data={data}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => valueScale(getValue(d)) ?? 0}
          stroke="#057833"
        />
        <AxisBottom
          scale={dateScale as any}
          top={yMax}
          hideTicks={true}
          hideAxisLine={true}
          tickLabelProps={{
            fillOpacity: 0.4,
          }}
        />
      </Group>
    </svg>
  );
}
