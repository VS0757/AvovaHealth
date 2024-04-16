"use client";

import { useEffect, useState } from "react";

export type TableValue = {
  key: string;
  components: {
    key: string;
    node: React.ReactNode;
    sortValue: number;
  }[];
};

export type TableProps = {
  columns: string[];
  rows: TableValue[];
};

export default function Table(props: TableProps) {
  const [sortKey, setSortKey] = useState<string>("Item");
  let rows = props.rows;
  let seed = 1;

  useEffect(() => {
    rows.sort(sortByKey);
  }, [sortKey, rows]);

  const sortByKey = (n1: any, n2: any) => {
    const firstValue = n1.components.filter((p: any) => p.key === sortKey)[0]
      .sortValue;
    const secondValue = n2.components.filter((p: any) => p.key === sortKey)[0]
      .sortValue;

    return firstValue - secondValue;
  };

  return (
    <table
      className={`text-xs justify-start items-start place-items-start w-full`}
    >
      <thead>
        <tr className="border-b h-12 text-md font-medium">
          {props.columns.map((k) => {
            return (
              <td key={k} className="px-4 opacity-50">
                <button
                  onClick={() => {
                    setSortKey(k);
                  }}
                >
                  {k}
                </button>
              </td>
            );
          })}
        </tr>
      </thead>
      <tbody className="divide-y">
        {rows.sort(sortByKey).map((r) => {
          return (
            <tr key={r.key} className="even:bg-stone-100">
              {r.components.map((c) => {
                return (
                  <td key={c.key} className="h-12 px-4">
                    {c.node}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
