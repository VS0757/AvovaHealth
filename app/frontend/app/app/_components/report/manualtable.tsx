import { GeistMono } from "geist/font/mono";
import { ReportRange, MedPreNotes, BloodTestToolTip } from "./reportrange";
import { getFilteredUnit } from "./testHelper";

export default function ManualReportTable({ reportData }: any) {
  return (
    <table
      className={`text-xs justify-start items-start place-items-start w-full`}
    >
      <thead>
        <tr className="border-b h-12 text-md font-medium">
          <td className="px-4">Item</td>
          <td className="opacity-50">Value</td>
          <td className="opacity-50">Range</td>
        </tr>
      </thead>
      <tbody className="divide-y">
        {reportData.test &&
          reportData.test.length > 0 &&
          reportData.test.map(
            ({ unit, value, bloodtestname }: any, index: any) => {
              if (isNaN(value)) {
                return null;
              }
              const rangeKey = getFilteredUnit(bloodtestname);
              return (
                <tr key={index} className="even:bg-stone-100">
                  <td className="min-h-10 px-4 flex flex-col justify-center py-2">
                    <BloodTestToolTip
                      rangeKey={rangeKey}
                      testName={bloodtestname}
                    />
                    <MedPreNotes rangeKey={rangeKey} />
                  </td>
                  <td className="">
                    {value} {rangeKey && rangeKey.Unit ? rangeKey.Unit : ""}
                  </td>
                  <td className="w-[240px]">
                    <ReportRange
                      value={value}
                      bloodtestname={bloodtestname}
                      date={reportData.effectiveDateTime}
                    />
                  </td>
                </tr>
              );
            },
          )}
      </tbody>
    </table>
  );
}
