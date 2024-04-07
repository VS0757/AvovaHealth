"use client";
import Card from "@/_components/card";
import { getTestKeys } from "@/app/app/_components/report/testHelper";
import Button from "@/_components/button";
import { useState } from "react";
import {
  UserData,
  submitWatchlist,
} from "@/app/app/_components/settings/userDataActions";
import { toast } from "sonner";
import Link from "next/link";
import FeatherIcon from "feather-icons-react";

export default function WatchlistPage({
  userWatchlist,
  reports,
}: {
  userWatchlist: string[];
  reports: any;
}) {
  const [watchlist, setWatchlist] = useState<string[]>(userWatchlist);

  const keys = getTestKeys();

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    if (watchlist && e.target.checked) {
      const newWatchlist = watchlist.concat([key]);
      setWatchlist(newWatchlist);
    }
    if (watchlist && !e.target.checked) {
      const newWatchlist = watchlist.filter((w) => w !== key);
      setWatchlist(newWatchlist);
    }
  }

  function updateWatchlist() {
    toast.promise(submitWatchlist(watchlist ?? [""]), {
      loading: "Uploading...",
      success: "Succesfully updated watchlist",
      error: "Error updating watchlist",
    });
  }

  return (
    <main className="flex flex-col gap-4">
      <div className="w-fit right-0">
        <Button
          icon="check-circle"
          label="Submit"
          inverse
          onClick={() => updateWatchlist()}
        />
      </div>
      <Card>
        <table
          className={`text-xs justify-start items-start place-items-start w-full`}
        >
          <thead>
            <tr className="border-b h-12 text-md font-medium">
              <td className="px-4 w-4">Watching</td>
              <td className="opacity-50">Input</td>
              <td className="opacity-50">Trend</td>
              <td className="opacity-50">Recent Value</td>
              <td className="opacity-50">Last Date</td>
            </tr>
          </thead>
          <tbody className="divide-y">
            {keys.map((m, i) => (
              <tr key={m} className="even:bg-stone-100 h-10">
                <td className="flex flex-row h-10 justify-center items-center">
                  <input
                    type="checkbox"
                    defaultChecked={watchlist.includes(m)}
                    onChange={(e) => handleCheckbox(e, m)}
                  ></input>
                </td>
                <td className="">{m.split(";")[0]}</td>
                <td className="w-32">
                  <TrendRange test={m} reports={reports} />
                </td>
                <td className="w-32">
                  <ReportValue test={m} reports={reports} />
                </td>
                <td className="w-32">
                  <ReportDate test={m} reports={reports} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}

function ReportValue({ reports, test }: { reports: any; test: string }) {
  const [filteredTest, recent] = getFilteredTest(reports, test);
  if (!filteredTest) {
    return <p>-</p>;
  }

  const val = filteredTest.value;
  const unit = filteredTest.unit !== "None" ? filteredTest.unit : "";
  const reportId = recent.dateTimeType;
  const date = recent.dateTimeType.split("$")[0];

  return (
    <Link href={`/app/report/${reportId}`}>
      <p className="underline opacity-50">
        {val} {unit}
      </p>
    </Link>
  );
}

function ReportDate({ reports, test }: { reports: any; test: string }) {
  const [filteredTest, recent] = getFilteredTest(reports, test);
  if (!filteredTest) {
    return <p>-</p>;
  }

  const reportId = recent.dateTimeType;
  const date = recent.dateTimeType.split("$")[0];

  return (
    <Link href={`/app/report/${reportId}`}>
      <p className="underline opacity-50">{date}</p>
    </Link>
  );
}

function TrendRange({ reports, test }: { reports: any; test: string }) {
  const [filteredLast, filteredRecent, recent] = getLastFilteredTest(
    reports,
    test,
  );

  if (!filteredLast || !filteredRecent || !recent) {
    return <p>-</p>;
  }

  const oldVal = filteredLast.value;
  const recentVal = filteredRecent.value;
  const isIncreasing = recentVal - oldVal > 0;
  let changePercent = recentVal / oldVal;
  let color = "from-mint/25";
  if (isIncreasing) {
    changePercent = (changePercent - 1) * 100;
  } else {
    changePercent = (oldVal / recentVal - 1) * 100;
    color = "from-rose-600/25";
  }

  return (
    <div
      className={`border rounded-full px-2 py-1 flex flex-row max-w-fit gap-2 bg-gradient-to-br ${color}`}
    >
      {isIncreasing ? (
        <>
          {changePercent.toFixed(2)}%
          <FeatherIcon icon="trending-up" className="h-4" />
        </>
      ) : (
        <>
          {changePercent.toFixed(2)}%
          <FeatherIcon icon="trending-down" className="h-4" />
        </>
      )}
    </div>
  );
}

function getFilteredTest(reports: any, test: string): [any, any] {
  const filtered = reports.filter((r: any) => {
    const filteredTests = r.data.test.filter((t: any) => {
      return test.includes(t.bloodtestname);
    });
    return filteredTests.length >= 1;
  });

  if (filtered.length < 1) {
    return [null, null];
  }

  const recent = filtered[filtered.length - 1];
  const filteredTest = recent.data.test.filter((t: any) => {
    return test.includes(t.bloodtestname);
  })[0];

  return [filteredTest, recent];
}

function getLastFilteredTest(reports: any, test: string): [any, any, any] {
  const filtered = reports.filter((r: any) => {
    const filteredTests = r.data.test.filter((t: any) => {
      return test.includes(t.bloodtestname);
    });
    return filteredTests.length >= 1;
  });

  if (filtered.length < 2) {
    return [null, null, null];
  }

  const recent = filtered[filtered.length - 1];
  const last = filtered[filtered.length - 2];
  const filteredRecent = recent.data.test.filter((t: any) => {
    return test.includes(t.bloodtestname);
  })[0];
  const filteredLast = last.data.test.filter((t: any) => {
    return test.includes(t.bloodtestname);
  })[0];

  return [filteredLast, filteredRecent, recent];
}
