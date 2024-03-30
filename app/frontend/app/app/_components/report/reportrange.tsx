import ranges from "./bloodtestresults.json";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface UserData {
  preconditions: Array<string>;
  medications: Array<string>;
  uniqueUserId: string;
  birthday: string;
  sex: string;
}

interface RangeItem {
  Unit: string;
  Male: any;
  Female: any;
  Definition: string;
  MedPre?: any;
}

function calculateAgeInYears(birthDateString: string, onDateString: string) {
  const birthDate = new Date(birthDateString).getTime();
  const onDate = new Date(onDateString).getTime();

  const differenceInMilliseconds = onDate - birthDate;
  const years = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return years;
}

const findRangeAndUnit = ({ item }: { item: string }) => {
  const findMatchingItem = (substring: string) => {
    const keys = Object.keys(ranges);
    const lowercaseItem = substring.toLowerCase();

    const foundKey = keys.find((key) => {
      const options = key.split(";").map(option => option.toLowerCase());
      return options.includes(lowercaseItem);
    });

    return foundKey ? ranges[foundKey as keyof typeof ranges] : null;
  };

  return findMatchingItem(item) as RangeItem;
}

async function getItem() {
  const { getIdToken } = getKindeServerSession();
  let uniqueUserId = (await getIdToken()).sub;
  uniqueUserId = "kp_f85ba560eb6346ccb744778f7c8d769e";
  const res = await fetch(
    `http://localhost:3001/retrieve-user-data?id=${uniqueUserId}`,
  );
  const data = await res.json();
  return data?.data as UserData;
}

function BloodTestToolTip({ rangeKey, testName }: { rangeKey: RangeItem; testName: string }) {
  const definition = rangeKey?.Definition || "No definition available";
  return (
    <div className="relative flex flex-col items-center group">
      <span>{testName}</span>
      <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
        <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg rounded-md">{definition}</span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
      </div>
    </div>
  );
}


async function MedPreNotes({ rangeKey }: { rangeKey: RangeItem }) {
  const data = await getItem();

  const matchingPreconditions: string[] = [];
  const matchingMedications: string[] = [];
  Object.keys(rangeKey?.MedPre ?? {}).forEach(key => {
    if (data.preconditions.includes(key)) {
      matchingPreconditions.push(rangeKey.MedPre[key]);
    }
    if (data.medications.includes(key)) {
      matchingMedications.push(rangeKey.MedPre[key]);
    }
  });

  return (
    <div className="p-2">
      {matchingPreconditions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Preconditions</h2>
          <ul>
            {matchingPreconditions.map((precondition, index) => (
              <li key={index}>{precondition}</li>
            ))}
          </ul>
        </div>
      )}
      {matchingMedications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Medications</h2>
          <ul>
            {matchingMedications.map((medication, index) => (
              <li key={index}>{medication}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

async function ReportRange( { value, rangeKey, date }: { value: number, rangeKey: RangeItem, date: string }) {
  const data = await getItem();

  if (!rangeKey) {
    return <p>No ranges</p>;
  }

  const male = data.sex;
  const age = calculateAgeInYears(data.birthday, date);

  console.log("YOUR EXACT AGE IS: " + age);

  let genderKey = male ? rangeKey.Male : rangeKey.Female;

  const entry = genderKey?.find(({ ageRange }: any) => age < ageRange[1]);
  const lowRange = entry?.range[0];
  const highRange = entry?.range[1];

  console.log(lowRange + " " + highRange);

  return (
    <div className={`px-2`}>
      <input
        type="range"
        min={lowRange}
        max={highRange}
        value={value}
        className="h-1 w-full rounded-lg border"
        disabled
      />
      <div className="flex justify-between">
        <p>{lowRange}</p>
        <p>{highRange}</p>
      </div>
    </div>
  );
};

export {findRangeAndUnit, ReportRange, MedPreNotes, BloodTestToolTip};