import ReportTable from "../../_components/report/reporttable";
import { getUserId } from "../../_components/settings/userDataActions";

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

function summarizeTestResults(tests: any) {
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
      "If you have any questions or concerns, feel free to ask.",
      "Remember, I'm here to help you understand your health better.",
      "It's important to us that you feel informed about your health, so don't hesitate to reach out with questions.",
      "Do you have any questions about these results? I'm here to answer them.",
      "These results give us a lot to consider, but I'm here to guide you through it.",
      "Your understanding of your health is crucial, so please ask any questions you might have.",
      "Feel free to discuss any concerns or queries. We're here to support you.",
      "Let me know if there's anything you'd like to discuss further about these results."
  ];

  let withinCnt = 0

  const getStatusPhrase = (status: string) => {
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
              "is a tad above the normal limits.",
              "goes beyond the normal range, which is something to keep in mind.",
              "is above the standard range, suggesting we should monitor it closely."
          ]
      };
      const randomIndex = Math.floor(Math.random() * phrases[status].length);
      return phrases[status][randomIndex];
  };

  let summary = tests.test.map(test => {
      const [min, max] = test.range.split("-").map(Number);
      const value = parseFloat(test.value);
      let status;

      if (value < min) {
          status = 'below';
      } else if (value > max) {
          status = 'above';
      } else {
          status = 'within';
          withinCnt = withinCnt + 1

          if (withinCnt > 2) {
            return ""
          }
      }

      return `${test.bloodtestname} ${getStatusPhrase(status)}`;
  }).join(" ");

  const introIndex = Math.floor(Math.random() * introductions.length);
  const conclusionIndex = Math.floor(Math.random() * conclusions.length);

  let output = `${introductions[introIndex]} ${summary} ${conclusions[conclusionIndex]}`
  output = output.replace(/\s+/g, " ");

  return output;
}

const generatePrompt = (contextText: string) => {
  const prompt = `${`
  You are a medical practitioner extremely proficient in bloodwork.
  Assume your patient is a high school student.
  You wil be given a blood report in similar format to a json string.
  Act as if you are speaking to a patient explaining their bloodwork to them.
  Answer in an objective manner and err on the side of caution.
  Do not suggest any treatment options, simply summarize their blood report."`}

  Bloodwork Context:
  ${contextText}

  Question: Summarize the following blood report and answer as a nurse would
  explain the following results to a high school student. Emphasize the most important tests.
`;

  return prompt;
};

const generateAnswer = async (prompt: string) => {
	const res = await fetch(`http://localhost:3001/summarize?prompt=${prompt}`);

  const data = await res.json();
  return data.choices[0].message.content
};

interface Data {
  dateTimeType: string;
  uniqueUserId: string;
  data: any[];
}

export default async function ReportPage({ params }: any) {
  const uniqueUserId = await getUserId();

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

	// const prompt = generatePrompt(String(JSON.stringify(reportData)));
  // console.log(String(JSON.stringify(reportData)))
  // const gpt_out = await generateAnswer(prompt);

  const summaryParagraph = summarizeTestResults(reportData);

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
