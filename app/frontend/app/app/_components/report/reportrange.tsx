import ranges from "./bloodtestresults.json";

interface RangeParams {
  item: string;
  value: any;
}

interface RangeItem {
  Unit: string;
  Male: any;
  Female: any;
}

export default function ReportRange({ item, value }: RangeParams) {
  const findMatchingItem = (substring: string) => {
    const keys = Object.keys(ranges);
    const foundKey = keys.find((key) =>
      key.toLowerCase().includes(substring.toLowerCase()),
    );
    return foundKey ? ranges[foundKey as keyof typeof ranges] : null;
  };

  const male = true;
  const age = 15.0;

  const rangeKey = findMatchingItem(item) as RangeItem;
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
}
