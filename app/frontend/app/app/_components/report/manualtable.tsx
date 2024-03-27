import { GeistMono } from "geist/font/mono";
import ReportRange from "./reportrange";

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
        {Object.entries(reportData).map(([key, value], index) => (
          <tr key={index} className="rounded-md border dark:border-stone-900">
            <td className="rounded-md border p-1 dark:border-stone-900">
              {key.replace(/_/g, " ")}
            </td>
            <td className="rounded-md border p-1 opacity-50 dark:border-stone-900">
              {value}
            </td>
            <td className="h-[48px] rounded-md border p-1 opacity-50 dark:border-stone-900">
              <ReportRange item={key} value={value} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
