"use client";
import FeatherIcon from "feather-icons-react";
import Card from "@/_components/card";

export type ReportPageProps = {
  name: string;
  date: string;
  recs: React.ReactNode;
  summary: string;
  type: string;
  percentInRange: number;
};

export default function ReportPageComponent({
  params,
  props,
}: {
  params: any;
  props: ReportPageProps;
}) {
  return (
    <div className="flex flex-col gap-8 max-w-screen-md mx-auto">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl">Report</h1>
          <h1 className="text-lg opacity-50">[{props.name}]</h1>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xs opacity-50">Date</p>
          <p>{props.date}</p>
        </div>
      </div>
      <div className="border rounded-lg px-36 h-72 text-center flex flex-col justify-center items-center bg-avova-gradient">
        <div className="flex flex-row gap-2 text-xs opacity-50 items-center py-4">
          <FeatherIcon icon="zap" className="h-4" />
          Recommendations
        </div>
        <div className="text-xl text-black opacity-70 mix-blend-color-burn">
          {props.recs}
        </div>
      </div>
      <Card>
        <div className="px-9 py-8 text-xs flex flex-col justify-between lg:flex-row">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-row items-center text-lg gap-2">
              <FeatherIcon
                icon="heart"
                fill="#E05767"
                strokeWidth={0}
                className="h-5"
              />
              Blood Report Summary
            </div>
            <div className="max-w-lg leading-relaxed opacity-70 text-sm">
              {props.summary}
            </div>
          </div>
          <div className="flex flex-col lg:items-end lg:border-none pt-2 justify-center items-start border-t">
            <p className="text-xs opacity-50">Filename</p>
            <p className="mb-2">{props.name}</p>
            <p className="text-xs opacity-50">Date</p>
            <p className="mb-2">{props.date}</p>
            <p className="text-xs opacity-50">Type</p>
            <p className="mb-2">{props.type.toUpperCase()}</p>
            <p className="text-xs opacity-50">Tests in Range</p>
            <p
              className={`max-w-fill text-2xl font-medium ${
                props.percentInRange > 90
                  ? "text-green-500"
                  : props.percentInRange >= 5 && props.percentInRange <= 90
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            >
              {props.percentInRange}%
            </p>
          </div>
        </div>
      </Card>
      <a href={"/app/report/" + params.id + "/data"}>View All Data</a>
    </div>
  );
}
