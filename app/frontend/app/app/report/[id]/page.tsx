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

	const prompt = generatePrompt(String(JSON.stringify(reportData)));

	// const gpt_out = await generateAnswer(prompt);

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

        <div className="mt-8">
          <p className="opacity-50">Data</p>
          <ReportTable isFhir={type === "fhir"} reportData={reportData} />
        </div>

        <div className="mt-8">
          <p className="opacity-50">Blood Report Summary</p>
          <p>{"HEY DAD"}</p>
        </div>
      </div>
    </main>
  );
}
