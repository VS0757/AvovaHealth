export default async function DemographicsSettings() {
  return (
    <div>
      <div className="mt-4 flex flex-row items-center gap-4">
        <p>Sex</p>
        <select className="w-32 rounded-md border bg-inherit px-4 py-2 dark:border-stone-900">
          <option>Male</option>
          <option>Female</option>
          <option>Prefer Not To Say</option>
        </select>
      </div>
      <div className="mt-4 flex flex-row items-center gap-4">
        <p>Age</p>
        <input
          type="number"
          className="w-32 rounded-md border bg-inherit px-4 py-2 dark:border-stone-900"
          placeholder="21"
        />
      </div>
    </div>
  );
}