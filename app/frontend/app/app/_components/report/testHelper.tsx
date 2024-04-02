import formats from "./bloodtestresults.json";

export function getFilteredUnit(test: string) {
  const keys = Object.keys(formats);
  const lowercaseItem = test.toLowerCase();

  const foundKey = keys.find((key) => {
    const options = key.split(";").map(option => option.toLowerCase());
    return options.includes(lowercaseItem);
  });

  return foundKey ? formats[foundKey as keyof typeof formats] : null;
};

export function getTestUnit(testName: string) {
  const test = getFilteredUnit(testName);

  return test ? test.Unit : "";
}

export function getTestRange(testName: string, gender: string, age: number) {
  const test = getFilteredUnit(testName);

  const range = {
    low: 0,
    high: 0,
  };

  if (!test) {
    return range;
  }

  if (gender.toLowerCase() === "male") {
    const entry = test.Male.filter((e: any) => {
      return age >= e.ageRange[0] && age <= e.ageRange[1];
    });
    if (entry.length != 0) {
      range.low = entry[0].range[0];
      range.high = entry[0].range[1];
    }
  } else {
    const entry = test.Female.filter((e: any) => {
      return age >= e.ageRange[0] && age <= e.ageRange[1];
    });
    if (entry.length != 0) {
      range.low = entry[0].range[0];
      range.high = entry[0].range[1];
    }
  }

  return range;
}
