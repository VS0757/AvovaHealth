import formats from "./bloodtestresults.json";

function getFilteredUnit(test: string) {
  const entries = Object.entries(formats);

  const filtered = entries.filter((e: any) => {
    const names: string = e[0];
    return names.includes(test);
  });

  return filtered[0];
}

export function getTestUnit(testName: string) {
  const test = getFilteredUnit(testName);

  return test ? test[1].Unit : "";
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
    const entry = test[1].Male.filter((e: any) => {
      return age >= e.ageRange[0] && age <= e.ageRange[1];
    });
    if (entry.length != 0) {
      range.low = entry[0].range[0];
      range.high = entry[0].range[1];
    }
  } else {
    const entry = test[1].Female.filter((e: any) => {
      return age >= e.ageRange[0] && age <= e.ageRange[1];
    });
    if (entry.length != 0) {
      range.low = entry[0].range[0];
      range.high = entry[0].range[1];
    }
  }

  return range;
}
