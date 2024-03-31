"use client";
import FeatherIcon from "feather-icons-react";
import { useState } from "react";
import Button from "../primitives/button";
import { submitConditions } from "./userDataActions";
import { toast } from "sonner";

export default function PatientHistorySettings({
  initialConditions,
}: {
  initialConditions: string[];
}) {
  const [conditions, setConditions] = useState<string[]>(initialConditions);

  const addCondition = (e: React.MouseEvent<HTMLButtonElement>) => {
    setConditions(conditions?.concat([""]));
  };

  const updateCondition = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    setConditions(conditions.with(index, e.target.value));
  };

  const submitCondition = (e: React.MouseEvent<HTMLButtonElement>) => {
    toast.promise(submitConditions(conditions), {
      loading: "Uploading...",
      success: "Successfully uploaded user data.",
      error: "Error uploading user data.",
    });
  };

  const deleteCondition = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    setConditions(
      conditions.filter((val, i) => {
        return i != index;
      }),
    );
  };

  return (
    <div className="mt-4 flex flex-col items-start gap-1">
      <div className="flex flex-col gap-1">
        {conditions?.map((name, index) => (
          <div key={index} className="align-center flex flex-row gap-1">
            <input
              type="text"
              value={name}
              onChange={(e) => updateCondition(e, index)}
              className="bgb-normal rounded-md px-4 py-2"
            />
            <button onClick={(e) => deleteCondition(e, index)}>
              <FeatherIcon icon="x-circle" className="h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="my-1 flex flex-row gap-1">
        <Button icon="plus-circle" label="Add" onClick={addCondition} />
        <Button icon="check-circle" label="Submit" onClick={submitCondition} />
      </div>
    </div>
  );
}
