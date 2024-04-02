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

export default function TrendGraph({ trendData }: any) {
  const data = formatTrendData(trendData);

  const unit: string = getTestUnit(data[0].name);
  const range: { low: number; high: number } = getTestRange(
    data[0].name,
    "male",
    15,
  );

  const width = 300;
  const height = 200;

  const margin = {
    top: 0,
    bottom: 0,
    left: -1,
    right: 0,
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
    <div className="bgb-normal mt-2 flex flex-row justify-between rounded-md p-4">
      <div className="flex flex-col justify-start">
        <h1>{data[0].name}</h1>
        <div>
          <p className="mb-1 mt-4 opacity-40">Latest Test</p>
          <p>{formatDate(data[data.length - 1].date)}</p>
          <div className="flex flex-row items-end gap-1">
            <h2 className="mt-1 text-xl">{data[data.length - 1].value}</h2>
            <p className="-translate-y-[2px]">{unit}</p>
          </div>
        </div>
        {tooltipData && (
          <div className="mt-8 flex flex-col opacity-40">
            <p>{formatDate(tooltipData?.date)}</p>
            <div className="flex flex-row items-end gap-1">
              <h2 className="mt-1 text-xl">{tooltipData?.value}</h2>
              <p className="-translate-y-[2px]">{unit}</p>
            </div>
          </div>
        )}
      </div>
      <div className="max-h-fit max-w-fit">
        <svg
          width={width}
          height={height}
          className="rounded-md border border-stone-800 bg-stone-900"
        >
          <Group top={margin.top} left={margin.left}>
            <GridRows
              scale={valueScale}
              width={xMax}
              strokeDasharray="2,2"
              stroke="white"
              strokeOpacity={0.05}
              pointerEvents="none"
            />
            <GridColumns
              scale={dateScale}
              height={yMax}
              strokeDasharray="2,2"
              stroke="white"
              strokeOpacity={0.05}
              pointerEvents="none"
            />
            <LinearGradient
              id="area-gradient"
              from="white"
              to="transparent"
              toOpacity={0}
              fromOpacity={0.5}
            />
            <AreaClosed<TrendDataPoint>
              data={data}
              yScale={valueScale}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => valueScale(getValue(d)) ?? 0}
              fill={"url(#area-gradient)"}
              stroke="white"
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
              fill="green"
              fillOpacity={0.06}
              stroke="green"
              strokeOpacity={0.2}
              pointerEvents="none"
            />
          </Group>
        </svg>
      </div>
    </div>
  );
}
