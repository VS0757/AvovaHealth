import ReportTable from "../../_components/report/reporttable";
import { externalGetUserData, getUserId } from "../../_components/settings/userDataActions";
import { getAge, getTestRange} from "../../_components/report/testHelper";

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
  if (test.code && test.valueQuantity && test.valueQuantity.value !== undefined) {
    const testName = test.code.text;
    const testValue = test.valueQuantity.value; 
    return { testName, testValue, range: undefined }; 
  } else if (test.range && test.value && test.bloodtestname) {
    const testName = test.bloodtestname;
    const testValue = parseFloat(test.value);
    return { testName, testValue, range: test.range.split("-").map(Number) };
  }

  return null;
}

function summarizeTestResults(input: any, userData: any) {
  const effectiveDate = input.effectiveDateTime

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
      "Your test results are in, and I'm here to go through them with you."
  ];

  const conclusions = [
      "Please consult a healthcare professional with more information."
  ];

  const getStatusPhrase = (status: 'below' | 'within' | 'above') => {
      const phrases = {
          below: [
              "is a bit lower than what we normally expect.",
              "is slightly below the normal range.",
              "falls a little under the standard range.",
              "is lower than usual, which we should keep an eye on.",
              "is a little lower than we'd like to see.",
              "doesn't quite reach the normal range, which is something to note.",
              "is under the normal range, indicating we should look into it."
          ],
          within: [
              "is exactly where we want it to be, right within the normal range.",
              "looks good and falls within the normal range.",
              "is within the healthy range, which is great news.",
              "is right on target, within the normal range.",
              "falls perfectly within the range we're looking for.",
              "is in the ideal range, which is fantastic.",
              "is well within the normal range, just as we hoped."
          ],
          above: [
              "is a bit higher than the normal range.",
              "is slightly above what we typically see.",
              "exceeds the usual range a bit.",
              "is higher than we normally expect, which warrants attention.",
              "is slightly above the normal limits.",
              "goes beyond the normal range, which is something to keep in mind.",
              "is above the standard range, suggesting we should monitor it closely."
          ]
      };
      const randomIndex = Math.floor(Math.random() * phrases[status].length);
      return phrases[status][randomIndex];
  };

  let age = 25;
  if (effectiveDate != null) {
    age = getAge(userData.birthday, effectiveDate)
  }

  let summary = tests.map((test: any) => {
    const testInfo = determineTestFormat(test);
    
    if (!testInfo) {
      return ""
    }
    testInfo.range = getTestRange(testInfo.testName, userData.sex, age, userData.preconditions);

    const min = testInfo.range.low
    const max = testInfo.range.high

    const value = testInfo.testValue;

    let status: 'below' | 'above' | 'within';
    let withinCnt = 0

    if (min === 0 && max === 0) {
      return "";
    }
    else if (value < min) {
        status = 'below';
    } else if (value > max) {
        status = 'above';
    } else {
        status = 'within';
        if (withinCnt > 2) {
          return "";
        }
        withinCnt += 1;
    }

    return `${testInfo.testName} ${getStatusPhrase(status)}`;
  }).filter(Boolean).join(" ");

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

  const data = await getReport(
    uniqueUserId,
    params.id,
  );
  const report = (data[0] as Data)!;

  const date = report.dateTimeType.split("$")[0];
  const type = report.dateTimeType.split("$")[1].toLowerCase();
  const name = report.dateTimeType.split("$")[2];

  const year = date.split("-")[0];
  const month = date.split("-")[1];
  const day = date.split("-")[2];

  const reportData = report.data;

  const summaryParagraph = summarizeTestResults(reportData, userData);

  return (
    <main>
      <h1>Report View</h1>

      <div className="mt-16 flex flex-col gap-2">
        <div className="">
          <p className="opacity-50">Filename</p>
          <p>{name}</p>
        </div>

        <div className="">
          <p className="opacity-50">Date Uploaded</p>
          <p>
            {month}/{day}, {year}
          </p>
        </div>

        <div className="">
          <p className="opacity-50">Upload Type</p>
          <p className="uppercase">{type}</p>
        </div>

        <div className="mt-8 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
          <div className="flex items-center space-x-2">
          <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656l-7.07 7.07a.75.75 0 01-1.06 0l-7.07-7.07a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Blood Report Summary</h3>
          </div>
          <div className="mt-4 text-gray-600">
            <p>{summaryParagraph}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="opacity-50">Data</p>
          <ReportTable isFhir={type === "fhir"} reportData={reportData} />
        </div>
      </div>
    </main>
  );
}
