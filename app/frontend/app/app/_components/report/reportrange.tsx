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
  MedPreGeneral?: any;
  MedPreSpecific?: any;
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
  const userData = await getItem() as UserData;
  const increases: string[] = [];
  const decreases: string[] = [];

  Object.keys(rangeKey?.MedPreGeneral ?? {}).forEach(key => {
    if (userData.medications.includes(key) || userData.preconditions.includes(key)) {
      if (rangeKey.MedPreGeneral[key] === 'Increase') {
        increases.push(key);
      } else if (rangeKey.MedPreGeneral[key] === 'Decrease') {
        decreases.push(key);
      }
    }
  });

  const formatMedicationList = ({conditions}: {conditions: string[]}) => {
    if (conditions.length > 1) {
      return `${conditions.slice(0, -1).join(', ')} and ${conditions[conditions.length - 1]}`;
    }
    return conditions[0];
  };


  return (
    <div className="p-2">
      {increases.length > 0 && (
        <p>Since you are taking {formatMedicationList({ conditions: increases })}, your test results may be higher than normal. Please consult with your healthcare provider for more information.</p>
      )}
      {decreases.length > 0 && (
        <p>Since you are taking {formatMedicationList({ conditions: decreases })}, your test results may be lower than normal. Please consult with your healthcare provider for more information.</p>
      )}
    </div>
  );
}

async function ReportRange( { value, rangeKey, date }: { value: number, rangeKey: RangeItem, date: string }) {
  const userData = await getItem();

  if (!rangeKey) {
    return <p>No ranges</p>;
  }

  const male = userData.sex === 'Male';
  const birthday = calculateAgeInYears(userData.birthday, date);

  let specificRanges;
  if (userData.preconditions.length > 0 && rangeKey.MedPreSpecific) {
    const preconditionMatch = userData.preconditions.find(precondition => rangeKey.MedPreSpecific[precondition]);
    if (preconditionMatch) {
      specificRanges = rangeKey.MedPreSpecific[preconditionMatch];
    }
  }

  let genderKey = specificRanges ? (male ? specificRanges.Male : specificRanges.Female) : (male ? rangeKey.Male : rangeKey.Female);

  const entry = genderKey?.find(({ ageRange }: any) => birthday < ageRange[1]);
  const lowRange = entry?.range[0];
  const highRange = entry?.range[1];

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