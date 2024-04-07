"use client";

import { TrendDataPoint, formatTrendData } from "./trendsData";
import { scaleTime, scaleLinear } from "@vx/scale";
import { bisector, extent, max } from "d3-array";
import { AreaClosed, Bar, Line } from "@vx/shape";
import { Group } from "@visx/group";
import { useCallback, useMemo, useRef } from "react";
import { localPoint } from "@vx/event";
import {
  Tooltip,
  TooltipWithBounds,
  useTooltip,
  defaultStyles,
} from "@vx/tooltip";
import { LinearGradient } from "@vx/gradient";
import { GridRows, GridColumns } from "@vx/grid";
import { getTestRange, getTestUnit } from "../report/testHelper";
import { externalGetUserData } from "../settings/userDataActions";
import { AxisLeft, Axis, AxisBottom, TickLabelProps } from "@visx/axis";

export default function TrendGraph({ trendData }: any) {
  // const userData = await externalGetUserData();
  const data = formatTrendData(trendData);

  const unit: string = getTestUnit(data[0].name);
  const range: { low: number; high: number } = getTestRange(
    data[0].name,
    "male", // TODO: replace with actual user data
    15, // TODO: not sure if we can make assumptions of range since the age of the person is constantly changing across the data points,
    [],
  );

  const width = 300;
  const height = 200;

  const margin = {
    top: 10,
    bottom: 20,
    left: 20,
    right: 10,
  };

  const formatDate = (d: Date) =>
    d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const getDate = (p: TrendDataPoint) => p.date;
  const getValue = (p: TrendDataPoint) => p.value;

  const dateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xMax],
        domain: extent(data, getDate) as [Date, Date],
      }),
    [xMax],
  );

  const valueScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        domain: [0, max(data, getValue) || 0],
        nice: true,
      }),
    [yMax],
  );

  let rangeHeight = valueScale(range.high) ?? 0;
  rangeHeight = rangeHeight - (valueScale(range.low) ?? 0);
  rangeHeight = -rangeHeight;

  const bisectDate = bisector<TrendDataPoint, Date>((d) => d.date).left;

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<TrendDataPoint>({
    // initial tooltip state
    tooltipOpen: true,
    tooltipLeft: width / 3,
    tooltipTop: height / 3,
    tooltipData: data[0],
  });

  // tooltip handler
  const handleTooltip = useCallback(
    (
      event:
        | React.TouchEvent<SVGRectElement>
        | React.MouseEvent<SVGRectElement>,
    ) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: valueScale(getValue(d)),
      });
      console.log(x);
    },
    [showTooltip, valueScale, dateScale],
  );

  const tooltipStyles = {
    ...defaultStyles,
    border: "1px solid white",
    color: "black",
  };

  return (
    <div className="border dark:border-stone-800 mt-2 flex flex-row max-w-xl justify-between rounded-md p-4 bg-stone-50 dark:bg-stone-950">
      <div className="flex flex-col justify-between">
        <h1>{data[0].name}</h1>
        <div>
          <p className="mb-1 mt-4 opacity-40">Latest Test</p>
          <p>{formatDate(data[data.length - 1].date)}</p>
          <div className="flex flex-row items-end gap-1">
            <h2 className="mt-1 text-xl">{data[data.length - 1].value}</h2>
            <p className="-translate-y-[2px]">{unit}</p>
          </div>
        </div>
        <div className="min-h-[56px]">
          {tooltipData && (
            <div className="flex flex-col opacity-40">
              <p>{formatDate(tooltipData?.date)}</p>
              <div className="flex flex-row items-end gap-1">
                <h2 className=" text-xl">{tooltipData?.value}</h2>
                <p className="-translate-y-[2px]">{unit}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="max-h-fit max-w-fit">
        <svg width={width} height={height} className="">
          <Group top={margin.top} left={margin.left}>
            <GridRows
              scale={valueScale}
              width={xMax}
              strokeDasharray="2,2"
              stroke="black"
              strokeOpacity={0.1}
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
              to="green"
              toOpacity={0}
              fromOpacity={0.4}
            />
            <AreaClosed<TrendDataPoint>
              data={data}
              yScale={valueScale}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => valueScale(getValue(d)) ?? 0}
              fill={"url(#area-gradient)"}
            />
            <Bar
              x={0}
              y={0}
              width={width}
              height={height}
              fill="transparent"
              rx={14}
              onTouchStart={handleTooltip}
              onTouchMove={handleTooltip}
              onMouseMove={handleTooltip}
              onMouseLeave={() => hideTooltip()}
            />
            <Bar
              x={0}
              y={valueScale(range.high)}
              width={width}
              height={rangeHeight}
              fill="transparent"
              fillOpacity={0.06}
              strokeOpacity={0.2}
              pointerEvents="none"
            />
            <Axis
              orientation="bottom"
              // @ts-ignore
              scale={dateScale}
              hideTicks={true}
              top={yMax}
              hideAxisLine={false}
              stroke="rgba(0,0,0,0.2)"
            />
            <Axis
              orientation="left"
              // @ts-ignore
              scale={valueScale}
              hideTicks={true}
              stroke="rgba(0,0,0,0.2"
              left={-4}
              numTicks={4}
              tickLabelProps={{
                fill: "black",
                fillOpacity: 0.5,
              }}
              hideAxisLine={true}
            />
          </Group>
        </svg>
      </div>
    </div>
  );
}
