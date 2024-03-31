"use client";
import FeatherIcon from "feather-icons-react";
import { useState } from "react";
import Button from "../primitives/button";
import { submitMedications } from "./userDataActions";
import { toast } from "sonner";

export default function MedicationSettings({
  initialMedications,
}: {
  initialMedications: string[];
}) {
  const [medications, setMedications] = useState<string[]>(initialMedications);

  const addMedication = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMedications(medications?.concat([""]));
  };

  const updateMedication = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    setMedications(medications.with(index, e.target.value));
  };

  const submitMedication = (e: React.MouseEvent<HTMLButtonElement>) => {
    toast.promise(submitMedications(medications), {
      loading: "Uploading...",
      success: "Successfully uploaded user data.",
      error: "Error uploading user data.",
    });
  };

  const deleteMedication = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    setMedications(
      medications.filter((val, i) => {
        return i != index;
      }),
    );
  };

  return (
    <div className="mt-4 flex flex-col items-start gap-1">
      <div className="flex flex-col gap-1">
        {medications?.map((name, index) => (
          <div key={index} className="align-center flex flex-row gap-1">
            <input
              type="text"
              value={name}
              onChange={(e) => updateMedication(e, index)}
              className="bgb-normal rounded-md px-4 py-2"
            />
            <button onClick={(e) => deleteMedication(e, index)}>
              <FeatherIcon icon="x-circle" className="h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="my-1 flex flex-row gap-1">
        <Button icon="plus-circle" label="Add" onClick={addMedication} />
        <Button icon="check-circle" label="Submit" onClick={submitMedication} />
      </div>
    </div>
  );
}
