"use client";
import { useState } from "react";
import Button from "../primitives/button";
import { submitBirthday } from "./userDataActions";
import { toast } from "sonner";

export default function DemographicsSettings({
  initialSex,
  initialBirthday,
}: {
  initialSex: string;
  initialBirthday: string;
}) {
  const [sex, setSex] = useState<string>(initialSex);
  const [birthday, setBirthday] = useState<string>(initialBirthday);

  const submit = (e: React.MouseEvent<HTMLButtonElement>) => {
    toast.promise(submitBirthday(sex, birthday), {
      loading: "Uploading...",
      success: "Updated Demographic Data.",
      error: "Failed to update Demographic Data",
    });
  };

  const updateSex = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSex(e.target.value);
  };

  const updateBirthday = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(e.target.value);
  };

  return (
    <div>
      <div className="mt-4 flex flex-row items-center gap-4">
        <p>Sex</p>
        <select
          className="w-32 rounded-md border bg-inherit px-4 py-2 dark:border-stone-900"
          value={sex}
          onChange={updateSex}
        >
          <option>Male</option>
          <option>Female</option>
          <option>Prefer Not To Say</option>
        </select>
      </div>
      <div className="mb-2 mt-4 flex flex-row items-center gap-4">
        <p>Birthday</p>
        <input
          type="date"
          className="rounded-md border bg-inherit px-4 py-2 dark:border-stone-900"
          value={birthday}
          onChange={updateBirthday}
        />
      </div>
      <Button icon="check-circle" label="Submit" onClick={submit} />
    </div>
  );
}
