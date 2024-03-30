import ranges from "./bloodtestresults.json";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface UserData {
  preconditions: any;
  medications: any;
  uniqueUserId: string;
  age: number;
  sex: string;
}

interface RangeAndUnitParams {
  item: string;
  value: any;
}

interface RangeParams {
  item: string;
  value: any;
  rangeKey: RangeItem;
}

interface RangeItem {
  Unit: string;
  Male: any;
  Female: any;
}

const findRangeAndUnit = ({ item, value }: RangeAndUnitParams) => {
  const findMatchingItem = (substring: string) => {
    const keys = Object.keys(ranges);
    const foundKey = keys.find((key) =>
      key.toLowerCase().includes(substring.toLowerCase()),
    );
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

async function ReportRange( { item, value, rangeKey }: RangeParams) {
  const { getIdToken } = getKindeServerSession();
  const uniqueUserId = (await getIdToken()).sub;
  const data = await getItem("kp_f85ba560eb6346ccb744778f7c8d769e") as unknown as UserData;

  const male = data.sex;
  const age = data.age;

  if (!rangeKey) {
    return <p>No ranges</p>;
  }
  
  let genderKey = male ? rangeKey.Male : rangeKey.Female;

  const entry = genderKey?.find(({ ageRange }: any) => age >= ageRange[0]);
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