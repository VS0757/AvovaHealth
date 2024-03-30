import { GeistMono } from "geist/font/mono";
import { findRangeAndUnit, ReportRange } from "./reportrange";

export default function FhirReportTable({ reportData }: any) {
  const value = reportData.valueQuantity.value;
  const unit = reportData.valueQuantity.unit;
  const label = reportData.code.text;

  const interpretation = reportData.interpretation[0].text;
  const rangeKey = findRangeAndUnit({ item: label.split(",")[0], value: value});

  return (
    <table
      className={`mt-2 min-w-full border-collapse rounded-md border p-2 dark:border-stone-900 ${GeistMono.className}`}
    >
      <tbody>
        <tr className="rounded-md border dark:border-stone-900">
          <td className="rounded-md border p-1 dark:border-stone-900">
            {label}
          </td>
          <td className="rounded-md border p-1 opacity-50 dark:border-stone-900">
            {value} {unit}
          </td>
          <td className="rounded-md border p-1 opacity-50 dark:border-stone-900">
            <ReportRange item={label.split(",")[0]} value={value} rangeKey={rangeKey} />
          </td>
        </tr>
        <tr className="rounded-md border dark:border-stone-900">
          <td className="rounded-md border p-1 dark:border-stone-900">
            Interpretation
          </td>
          <td className="rounded-md border p-1 opacity-50 dark:border-stone-900">
            {interpretation}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
