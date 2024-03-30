import ranges from "./bloodtestresults.json";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface UserData {
  preconditions: any;
  medications: any;
  uniqueUserId: string;
  birthday: string;
  sex: string;
}

interface RangeParams {
  value: any;
  rangeKey: RangeItem;
  date: string;
}

interface RangeItem {
  Unit: string;
  Male: any;
  Female: any;
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

async function getItem(uniqueUserId: String) {
  const res = await fetch(
    `http://localhost:3001/retrieve-user-data?id=${uniqueUserId}`,
  );
  const data = await res.json();
  return data?.data as any[];
}

async function ReportRange( { value, rangeKey, date }: RangeParams) {
  const { getIdToken } = getKindeServerSession();
  const uniqueUserId = (await getIdToken()).sub;
  const data = await getItem("kp_f85ba560eb6346ccb744778f7c8d769e") as unknown as UserData;

  if (!rangeKey) {
    return <p>No ranges</p>;
  }

  const male = data.sex;
  const age = calculateAgeInYears(data.birthday, date);

  console.log("YOUER EXACT AGE IS: " + age);

  
  let genderKey = male ? rangeKey.Male : rangeKey.Female;

  const entry = genderKey?.find(({ ageRange }: any) => age < ageRange[1]);
  console.log(entry)
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

export {findRangeAndUnit, ReportRange};