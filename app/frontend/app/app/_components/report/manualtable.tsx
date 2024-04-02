import { GeistMono } from "geist/font/mono";
import { ReportRange, MedPreNotes, BloodTestToolTip } from "./reportrange";
import { getFilteredUnit } from "./testHelper";

export default function ManualReportTable({ reportData }: any) {
  return (
    <table
      className={`mt-2 min-w-full border-collapse rounded-md border p-2 dark:border-stone-900 ${GeistMono.className}`}
    >
      <thead>
        <tr className="p-2 opacity-50">
          <td>Item</td>
          <td>Value</td>
          <td>Range</td>
        </tr>
      </thead>
      <tbody>
        {reportData.test.map(({ unit, value, bloodtestname}: any, index: any) => {
          if (isNaN(value)) {
            return null;
          }
          const rangeKey = getFilteredUnit(bloodtestname);
          return (
          <tr key={index} className="rounded-md border dark:border-stone-900">
            <td className="rounded-md border p-1 dark:border-stone-900">
              <BloodTestToolTip rangeKey={rangeKey} testName={bloodtestname} />
            </td>
            <td className="rounded-md border p-1 opacity-50 dark:border-stone-900">
              {value} {rangeKey && rangeKey.Unit ? rangeKey.Unit : ''}
            </td>
            <td className="h-[48px] rounded-md border p-1 opacity-50 dark:border-stone-900">
              <ReportRange value={value} bloodtestname={bloodtestname} date={reportData.effectiveDateTime} />
            </td>
            <td className="h-[48px] rounded-md border p-1 opacity-50 dark:border-stone-900">
              <MedPreNotes rangeKey={rangeKey} />
            </td>
          </tr>
          );
          })}
      </tbody>
    </table>
  );
}
