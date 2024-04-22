import dayjs from "dayjs";
import Table, { TableValue } from "@/_components/table/table";
import util from "util";
import Card from "@/_components/card";
import FeatherIcon from "feather-icons-react";
import reportData from "./data.json";
import { getTestRange } from "../app/_components/report/testHelper";
import { useMemo } from "react";
import { GeistMono } from "geist/font/mono";
import { Group } from "@visx/group";
import { Bar, Circle, Line, LinePath, Polygon } from "@vx/shape";
import { Text, TextProps } from "@visx/text";
import { scaleLinear } from "@vx/scale";

export default async function Profile() {
  const date = dayjs();

  try {
    const reports = reportData;
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
            node: <div> {d.bloodtestname}</div>,
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
              <RangeViz
                min={Number(d.range.split("-")[0])}
                max={Number(d.range.split("-")[1])}
                value={d.value}
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
      <div className="flex max-h-screen flex-row bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-100">
        <div className="max-h-screen overflow-auto w-full">
          <div className="mx-auto flex min-h-screen max-w-screen-xl flex-1 flex-col px-16">
            <header className="mb-16 flex h-36 flex-row items-center justify-between border-b dark:border-stone-800">
              <div className="flex flex-col">
                <h1 className="text-xl">Om Jha</h1>
                <p className="opacity-70">{date.format("MMMM D, YYYY")}</p>
              </div>
            </header>
            <section className="flex flex-col gap-4 max-w-screen-md mx-auto">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <h1 className="text-xl">Report</h1>
                  <h1 className="text-lg opacity-50">[Om Jha]</h1>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs opacity-50">Date</p>
                  <p>{date.format("MMMM D, YYYY")}</p>
                </div>
              </div>
              <div className="border rounded-lg px-36 h-72 text-center flex flex-col justify-center items-center bg-avova-gradient">
                <div className="flex flex-row gap-2 text-xs opacity-50 items-center py-4">
                  <FeatherIcon icon="zap" className="h-4" />
                  Recommendations
                </div>
                <div className="text-xl text-black opacity-70 mix-blend-color-burn">
                  High red blood cell count could indicate dehydration or other
                  conditions. Ensure adequate hydration or consult a healthcare
                  professional.
                </div>
              </div>
              <Card>
                <Table columns={["Item", "Value", "Range"]} rows={rows} />
              </Card>
            </section>
            <footer className="mt-16 flex h-16 flex-col items-end justify-end gap-2 border-t py-4 text-xs opacity-40 dark:border-stone-800">
              <p>Copyright © Avova Health 2024</p>
              <a href="/terms">Terms and Conditions</a>
            </footer>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <h1>Error getting data</h1>;
  }
}

async function ReportRange({
  value,
  bloodtestname,
  date,
}: {
  value: number;
  bloodtestname: string;
  date: string;
}) {
  const age = 15;
  const range = getTestRange(bloodtestname, "Male", age, [""]);

  if (range.high === 0 && range.low === 0) {
    return <p>-</p>;
  }
  const lowRange = range.low;
  const highRange = range.high;

  return (
    <div className={`px-2`}>
      <RangeViz min={lowRange} max={highRange} value={value} />
    </div>
  );
}

function RangeViz({
  min,
  max,
  value,
}: {
  min: number;
  max: number;
  value: number;
}) {
  const width = 220;
  const height = 40;

  const margin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const getValue = (p: number) => p;

  let scaleMin: number = min - (max - min) / 2;
  let scaleMax: number = max + (max - min) / 2;

  if (value <= min) {
    scaleMin = value - (max - value) / 2;
  }
  if (value >= max) {
    scaleMax = +value + (value - min) / 2;
  }

  const scaleMinLabel: string = scaleMin.toFixed(2);
  const scaleMaxLabel: string = (+scaleMax).toFixed(2);
  const minLabel: string = (+min).toFixed(2);
  const maxLabel: string = (+max).toFixed(2);

  const valueScale = useMemo(
    () =>
      scaleLinear({
        range: [0, xMax],
        domain: [scaleMin, scaleMax],
        nice: true,
      }),
    [yMax],
  );

  const rangeLength = (valueScale(max) ?? 0) - (valueScale(min) ?? 0);

  return (
    <svg width={width} height={height} className={`${GeistMono.className}`}>
      <Group>
        <Bar
          x={0}
          y={height / 2 - 2}
          width={width}
          height={4}
          fill="rgba(255,0,0,0.2)"
        />
        <Bar
          x={valueScale(min)}
          y={height / 2 - 2}
          width={rangeLength}
          height={4}
          fill="green"
        />
        <Bar x={valueScale(value)} y={height / 2 - 6} width={4} height={12} />
        <Text y={height - 2} opacity={0.5} fontSize={10}>
          {scaleMinLabel}
        </Text>
        <Text
          x={width}
          y={height - 2}
          opacity={0.5}
          fontSize={10}
          textAnchor="end"
        >
          {scaleMaxLabel}
        </Text>
      </Group>
    </svg>
  );
}
