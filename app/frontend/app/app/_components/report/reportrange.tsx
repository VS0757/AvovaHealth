import { getUserId, getUserData } from "../settings/userDataActions";
import { getTestRange } from "./testHelper";

function calculateAgeInYears(birthDateString: string, onDateString: string) {
  const birthDate = new Date(birthDateString).getTime();
  const onDate = new Date(onDateString).getTime();

  const differenceInMilliseconds = onDate - birthDate;
  const years = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return years;
}

function BloodTestToolTip({ rangeKey, testName }: { rangeKey: any; testName: string }) {
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

async function MedPreNotes({ rangeKey }: { rangeKey: any }) {
  const userData = await getUserData(await getUserId());
  const increasesMedications: string[] = [];
  const decreasesMedications: string[] = [];
  const increasesPreconditions: string[] = [];
  const decreasesPreconditions: string[] = [];

  Object.keys(rangeKey?.MedPreGeneral ?? {}).forEach(key => {
    const effect = rangeKey.MedPreGeneral[key];
    if (userData.medications.includes(key)) {
      if (effect === 'Increase') {
        increasesMedications.push(key);
      } else if (effect === 'Decrease') {
        decreasesMedications.push(key);
      }
    }
    if (userData.preconditions.includes(key)) {
      if (effect === 'Increase') {
        increasesPreconditions.push(key);
      } else if (effect === 'Decrease') {
        decreasesPreconditions.push(key);
      }
    }
  });

  const formatList = ({conditions}: {conditions: string[]}) => {
    if (conditions.length > 1) {
      return `${conditions.slice(0, -1).join(', ')} and ${conditions[conditions.length - 1]}`;
    }
    return conditions[0];
  };

  return (
    <div className="p-2">
      {increasesMedications.length > 0 && (
        <p>Since you are taking {formatList({ conditions: increasesMedications })}, your test results may be higher than normal. Please consult with your healthcare provider for more information.</p>
      )}
      {decreasesMedications.length > 0 && (
        <p>Since you are taking {formatList({ conditions: decreasesMedications })}, your test results may be lower than normal. Please consult with your healthcare provider for more information.</p>
      )}
      {increasesPreconditions.length > 0 && (
        <p>Since you have {formatList({ conditions: increasesPreconditions })}, your test results may be higher than normal. Please consult with your healthcare provider for more information.</p>
      )}
      {decreasesPreconditions.length > 0 && (
        <p>Since you have {formatList({ conditions: decreasesPreconditions })}, your test results may be lower than normal. Please consult with your healthcare provider for more information.</p>
      )}
    </div>
  );
}

async function ReportRange( { value, bloodtestname, date }: { value: number, bloodtestname: string, date: string }) {
  const userData = await getUserData(await getUserId());
  const birthday = calculateAgeInYears(userData.birthday, date);
  const range = getTestRange(bloodtestname, userData.sex, birthday, userData.preconditions);

  if (range.high === 0 && range.low === 0) {
    return <p>No ranges</p>;
  }
  const lowRange = range.low;
  const highRange = range.high;

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

export {ReportRange, MedPreNotes, BloodTestToolTip};