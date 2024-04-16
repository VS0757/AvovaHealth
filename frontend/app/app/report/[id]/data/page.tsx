import FeatherIcon from "feather-icons-react";
import ReportTable from "../../../_components/report/reporttable";
import { externalGetUserData } from "../../../_components/settings/userDataActions";
import { getAge, getTestRange } from "../../../_components/report/testHelper";
import Card from "@/_components/card";
import { getPercentInRange } from "@/_components/dashboard/range_graph";
import { Suspense } from "react";
import { getUserId } from "@/_lib/actions";

async function fetchRecommendations() {
  const response = require("../recs.json");
  return response;
}

async function getReport(uniqueUserId: any, date: any) {
  const res = await fetch(
    "http://localhost:3001/retrieve-blood-data?id=" +
      uniqueUserId +
      "&date=" +
      date,
  );
  const data = await res.json();
  return data?.data as any[];
}

function determineTestFormat(test: any) {
  const testName = test.bloodtestname;
  const testValue = parseFloat(test.value);
  const range = test.range;
  return { testName, testValue, range };
}

async function provideRecommendations(input: any, userData: any) {
  const effectiveDate = input.effectiveDateTime;
  let age = 25;
  if (effectiveDate != null) {
    age = getAge(userData.birthday, effectiveDate);
  }

  let tests;
  if (Array.isArray(input)) {
    tests = input;
  } else if (input.test && Array.isArray(input.test)) {
    tests = input.test;
  } else {
    tests = [input];
  }

  const recommendations = await fetchRecommendations();

  let recommendationsArray: string[] = [];

  tests.forEach((test: any) => {
    const testInfo = determineTestFormat(test);
    if (!testInfo) return;
    let min = 0,
      max = 0;

    if (testInfo.range != null) {
      [min, max] = testInfo.range;
    }

    const range = getTestRange(
      testInfo.testName,
      userData.sex,
      age,
      userData.preconditions,
    );

    min = range.low;
    max = range.high;

    const value = testInfo.testValue;
    const testName = testInfo.testName.toUpperCase();

    let action = null;
    if (recommendations[testName]) {
      if (min === 0 && max === 0) {
        // not a valid range :)
      } else if (value < min) {
        action = recommendations[testName].low;
      } else if (value > max) {
        action = recommendations[testName].high;
      }
    }

    if (action) {
      recommendationsArray.push(`${testInfo.testName}: ${action}`);
    }
  });

  // css elements for bullet point @om feel free to adjust
  const bulletPointStyle = {
    listStyleType: "disc",
    marginLeft: "20px",
  };

  let outputJSX;
  if (recommendationsArray.length > 0) {
    outputJSX = (
      <div>
        <ul style={bulletPointStyle}>
          {recommendationsArray.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    outputJSX = <p>No specific recommendations are needed at this time.</p>;
  }

  return outputJSX;
}

function summarizeTestResults(input: any, userData: any) {
  const effectiveDate = input.effectiveDateTime;

  let tests;
  if (Array.isArray(input)) {
    tests = input;
  } else if (input.test && Array.isArray(input.test)) {
    tests = input.test;
  } else {
    tests = [input];
  }

  const introductions = [
    "Let's go over your test results together.",
    "I've taken a look at your test results, and here's what we've found.",
    "I have your test results here, and I'd like to discuss them with you.",
    "Let me walk you through your test results and explain what they mean.",
    "We've received your test results, and I'll help you understand what they indicate.",
    "Here are the details of your test results. Let's review them together.",
    "I've reviewed your tests, and I'd like to share the findings with you.",
    "Your test results are in, and I'm here to go through them with you.",
  ];

  const conclusions = [
    "Please consult a healthcare professional with more information.",
  ];

  const getStatusPhrase = (status: "below" | "within" | "above") => {
    const phrases = {
      below: [
        "is a bit lower than what we normally expect.",
        "is slightly below the normal range.",
        "falls a little under the standard range.",
        "is lower than usual, which we should keep an eye on.",
        "is a little lower than we'd like to see.",
        "doesn't quite reach the normal range, which is something to note.",
        "is under the normal range, indicating we should look into it.",
      ],
      within: [
        "is exactly where we want it to be, right within the normal range.",
        "looks good and falls within the normal range.",
        "is within the healthy range, which is great news.",
        "is right on target, within the normal range.",
        "falls perfectly within the range we're looking for.",
        "is in the ideal range, which is fantastic.",
        "is well within the normal range, just as we hoped.",
      ],
      above: [
        "is a bit higher than the normal range.",
        "is slightly above what we typically see.",
        "exceeds the usual range a bit.",
        "is higher than we normally expect, which warrants attention.",
        "is slightly above the normal limits.",
        "goes beyond the normal range, which is something to keep in mind.",
        "is above the standard range, suggesting we should monitor it closely.",
      ],
    };
    const randomIndex = Math.floor(Math.random() * phrases[status].length);
    return phrases[status][randomIndex];
  };

  let age = 25;
  if (effectiveDate != null) {
    age = getAge(userData.birthday, effectiveDate);
  }
  let withinCnt = 0;
  let summary = tests
    .map((test: any) => {
      const testInfo = determineTestFormat(test);

      if (!testInfo) {
        return "";
      }
      const testInfoRange = getTestRange(
        testInfo.testName,
        userData.sex,
        age,
        userData.preconditions,
      );

      const min = testInfoRange.low;
      const max = testInfoRange.high;

      const value = testInfo.testValue;

      let status: "below" | "above" | "within";

      if (min === 0 && max === 0) {
        return "";
      } else if (value < min) {
        status = "below";
      } else if (value > max) {
        status = "above";
      } else {
        status = "within";
        if (withinCnt > 2) {
          return "";
        }
        withinCnt += 1;
      }

      return `${testInfo.testName} ${getStatusPhrase(status)}`;
    })
    .filter(Boolean)
    .join(" ");

  const introIndex = Math.floor(Math.random() * introductions.length);
  const conclusionIndex = Math.floor(Math.random() * conclusions.length);

  let output = `${introductions[introIndex]} ${summary} ${conclusions[conclusionIndex]}`;
  output = output.trim().replace(/\s+/g, " ");

  return output;
}

interface Data {
  dateTimeType: string;
  uniqueUserId: string;
  data: any[];
}

export default async function ReportPage({ params }: any) {
  const uniqueUserId = await getUserId();
  const userData = await externalGetUserData();

  const data = await getReport(uniqueUserId, params.id);
  const report = (data[0] as Data)!;

  const date = report.dateTimeType.split("$")[0];
  const type = report.dateTimeType.split("$")[1].toLowerCase();
  const name = report.dateTimeType.split("$")[2];

  const year = date.split("-")[0];
  const month = date.split("-")[1];
  const day = date.split("-")[2];

  const reportData = report.data;
  const summaryParagraph = summarizeTestResults(reportData, userData);
  const recs = provideRecommendations(reportData, userData);

  const ranges = await getPercentInRange();
  const range = ranges.filter((r: any) => {
    return r.dateTimeType === report.dateTimeType;
  })[0];
  const percentInRange = range.range;

  return (
    <main
      className="flex flex-col gap-8 max-w-screen-md mx-auto"
      suppressHydrationWarning={true}
    >
      <div className="opacity-50">
        <a href={"/app/report/" + params.id}>Back</a>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl">Report</h1>
          <h1 className="text-lg opacity-50">[{name}]</h1>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xs opacity-50">Date</p>
          <p>{date}</p>
        </div>
      </div>
      <Card>
        <div className="w-full">
          <ReportTable isFhir={type === "fhir"} reportData={reportData} />
        </div>
      </Card>
    </main>
  );
}
