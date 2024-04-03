import formats from "./bloodtestresults.json";

interface RangeItem {
  Unit: string;
  Male: any;
  Female: any;
  Definition: string;
  MedPreGeneral?: any;
  MedPreSpecific?: any;
}

export function getFilteredUnit(test: string) {
  const keys = Object.keys(formats);
  const lowercaseItem = test.toLowerCase();

  const foundKey = keys.find((key) => {
    const options = key.split(";").map(option => option.toLowerCase());
    return options.includes(lowercaseItem);
  });

  return foundKey ? formats[foundKey as keyof typeof formats] as RangeItem : null;
};

export function getTestUnit(testName: string) {
  const test = getFilteredUnit(testName);

  return test ? test.Unit : "";
}

export function getTestRange(testName: string, gender: string, age: number, preconditions: string[]) {
  const test = getFilteredUnit(testName);

  const range = {
    low: 0,
    high: 0,
  };

  if (!test) {
    return range;
  }

  let specificRanges;
  if (preconditions.length > 0 && test.MedPreSpecific) {
    const preconditionMatch = preconditions.find(precondition => test.MedPreSpecific[precondition]);
    if (preconditionMatch) {
      specificRanges = test.MedPreSpecific[preconditionMatch];
    }
  }

  let specificTestRange = specificRanges ? ((gender.toLowerCase() === "male") ? specificRanges.Male : specificRanges.Female) : ((gender.toLowerCase() === "male") ? test.Male : test.Female);
  const entry = specificTestRange.find(({ ageRange }: any) => age < ageRange[1]);
  range.low = entry?.range[0] || 0;
  range.high = entry?.range[1] || 0;

  return range;
}

export function getAge(birthday: string, testDate: string) {
  const birthDate = new Date(birthday).getTime();
  const onDate = new Date(testDate).getTime();

  const differenceInMilliseconds = onDate - birthDate;
  const years = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return years;
}

export function percentInRange() {
  return 0;
}
