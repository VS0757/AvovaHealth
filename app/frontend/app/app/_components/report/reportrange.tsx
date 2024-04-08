import {
  externalGetUserData,
  getGender,
  getPreconditions,
  getMedications,
} from "../settings/userDataActions";
import { getTestRange, getAge } from "./testHelper";
import { Group } from "@visx/group";
import { Bar, Circle, Line, LinePath, Polygon } from "@vx/shape";
import { useMemo } from "react";
import { bisector, extent, max } from "d3-array";
import { scaleTime, scaleLinear } from "@vx/scale";
import { AxisBottom } from "@vx/axis";
import { Text, TextProps } from "@visx/text";
import { GeistMono } from "geist/font/mono";
import FeatherIcon from "feather-icons-react";

function BloodTestToolTip({
  rangeKey,
  testName,
}: {
  rangeKey: any;
  testName: string;
}) {
  const definition = rangeKey?.Definition || "No definition available";
  return (
    <div className="relative flex flex-col items-start group">
      <span className="underline">{testName}</span>
      <div className="absolute bottom-0 flex-col items-start hidden mb-6 group-hover:flex w-96">
        <span className="relative z-10 p-2 text-xs leading-relaxed text-white whitespace-no-wrap bg-black shadow-lg rounded-md">
          {definition}
        </span>
        <div className="ml-4 w-3 h-3 -mt-2 rotate-45 bg-black"></div>
      </div>
    </div>
  );
}

async function MedPreNotes({ rangeKey }: { rangeKey: any }) {
  const userData = await externalGetUserData();
  const increasesMedications: string[] = [];
  const decreasesMedications: string[] = [];
  const increasesPreconditions: string[] = [];
  const decreasesPreconditions: string[] = [];

  Object.keys(rangeKey?.MedPreGeneral ?? {}).forEach((key) => {
    const effect = rangeKey.MedPreGeneral[key];
    if (userData.medications && userData.medications.includes(key)) {
      if (effect === "Increase") {
        increasesMedications.push(key);
      } else if (effect === "Decrease") {
        decreasesMedications.push(key);
      }
    }
    if (userData.preconditions && userData.preconditions.includes(key)) {
      if (effect === "Increase") {
        increasesPreconditions.push(key);
      } else if (effect === "Decrease") {
        decreasesPreconditions.push(key);
      }
    }
  });

  const formatList = ({ conditions }: { conditions: string[] }) => {
    if (conditions.length > 1) {
      return `${conditions.slice(0, -1).join(", ")} and ${conditions[conditions.length - 1]}`;
    }
    return conditions[0];
  };

  if (
    increasesMedications.length === 0 &&
    decreasesMedications.length === 0 &&
    increasesPreconditions.length === 0 &&
    decreasesPreconditions.length === 0
  ) {
    return null;
  }

  return (
    <div className="opacity-50 py-2 flex flex-row gap-1 w-96">
      <FeatherIcon icon="alert-circle" className="h-4" />
      <div>
        {increasesMedications.length > 0 && (
          <p>
            Since you are taking{" "}
            {formatList({ conditions: increasesMedications })}, your test
            results may be higher than normal. Please consult with your
            healthcare provider for more information.
          </p>
        )}
        {decreasesMedications.length > 0 && (
          <p>
            Since you are taking{" "}
            {formatList({ conditions: decreasesMedications })}, your test
            results may be lower than normal. Please consult with your
            healthcare provider for more information.
          </p>
        )}
        {increasesPreconditions.length > 0 && (
          <p>
            Since you have {formatList({ conditions: increasesPreconditions })},
            your test results may be higher than normal. Please consult with
            your healthcare provider for more information.
          </p>
        )}
        {decreasesPreconditions.length > 0 && (
          <p>
            Since you have {formatList({ conditions: decreasesPreconditions })},
            your test results may be lower than normal. Please consult with your
            healthcare provider for more information.
          </p>
        )}
      </div>
    </div>
  );
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
  const userData = await externalGetUserData();
  const age = getAge(userData.birthday, date);
  const range = getTestRange(
    bloodtestname,
    await getGender(),
    age,
    await getPreconditions(),
  );

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
          fill="black"
          fillOpacity={0.1}
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
        <Text
          x={valueScale(min)}
          y={12}
          opacity={0.5}
          fontSize={10}
          textAnchor="middle"
        >
          {minLabel}
        </Text>
        <Text
          x={valueScale(max)}
          y={12}
          opacity={0.5}
          fontSize={10}
          textAnchor="middle"
        >
          {maxLabel}
        </Text>
      </Group>
    </svg>
  );
}

export { ReportRange, MedPreNotes, BloodTestToolTip };
